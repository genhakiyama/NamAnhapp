import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tự động load file .env từ thư mục server (ưu tiên) và thư mục gốc
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '.env'), override: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const WISHES_FILE = path.join(DATA_DIR, 'wishes.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Copy extracted_bg.jpeg to uploads if it exists and not already copied
const extractedBgSrc = path.join(__dirname, '..', 'extracted_bg.jpeg');
const extractedBgDest = path.join(UPLOADS_DIR, 'background_default.jpg');
if (fs.existsSync(extractedBgSrc) && !fs.existsSync(extractedBgDest)) {
  fs.copyFileSync(extractedBgSrc, extractedBgDest);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB
});

// Helper functions
async function sendNotificationEmail(wish) {
  // Đọc lại file .env mới nhất mỗi lần gửi để nếu người dùng vừa sửa .env không cần khởi động lại server
  dotenv.config({ path: path.join(__dirname, '..', '.env'), override: true });
  dotenv.config({ path: path.join(__dirname, '.env'), override: true });

  const rawReceiver = process.env.RECEIVER_EMAIL || process.env.NOTIFICATION_EMAIL || 'bonnanguyen2004@gmail.com';
  const emailUser = (process.env.EMAIL_USER || 'sandundertailroal@gmail.com').trim();
  const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();

  // Gửi đồng thời tới cả RECEIVER_EMAIL trong .env và sandundertailroal@gmail.com để bạn kiểm tra hòm thư nào cũng thấy ngay
  const recipientsSet = new Set(
    rawReceiver
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean)
  );
  if (emailUser) {
    recipientsSet.add(emailUser);
  }
  const recipientsList = Array.from(recipientsSet);
  const targetEmail = recipientsList.join(', ');
  const subject = `🎓 Lời chúc tốt nghiệp mới từ ${wish.name || 'Người bạn thân'}!`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 580px; margin: 0 auto; border: 1.5px solid #fed7aa; border-radius: 16px; background: #fffcf9; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #e26928; margin: 0; font-size: 24px;">🎓 Có lời chúc tốt nghiệp mới dành cho Bonbon! 💌</h2>
        <p style="color: #8c583a; font-size: 14px; margin-top: 6px;">Thời gian: ${new Date(wish.createdAt).toLocaleString('vi-VN')}</p>
      </div>

      <div style="background: #ffffff; padding: 18px 20px; border-left: 5px solid #e26928; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #b94b15;">
          Người gửi: <span style="color: #222;">${wish.name || 'Bạn ẩn danh'}</span>
        </p>
        <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #333; white-space: pre-wrap;">${wish.text}</p>
      </div>

      <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
        Thư thông báo tự động từ trang kỷ niệm tốt nghiệp Bonbon (Nam Anh) 🌸
      </p>
    </div>
  `;

  // 1. Nếu có RESEND_API_KEY thì ưu tiên gửi qua Resend REST API
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Bonbon Graduation <onboarding@resend.dev>',
          to: recipientsList,
          subject,
          html
        })
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        console.log(`✅ [Resend REST API] Gửi email thành công tới [${targetEmail}]!`);
        return { sent: true, provider: 'resend-rest-api', messageId: data.id || null, to: targetEmail };
      }
    } catch (err) {
      console.error('Resend API error:', err.message);
    }
  }

  console.log(`[Nodemailer] Đang gửi thông báo lời chúc tới: ${targetEmail}`);

  if (!emailUser || !emailPass) {
    console.warn('⚠️ [Nodemailer] Thiếu EMAIL_USER hoặc EMAIL_PASS trong file .env');
    return { sent: false, error: 'Missing EMAIL_USER or EMAIL_PASS in .env' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });

    const mailOptions = {
      from: `"Thiệp Tốt Nghiệp Bonbon" <${emailUser}>`,
      to: targetEmail,
      subject: `🎓 Lời chúc tốt nghiệp mới từ ${wish.name || 'Người bạn thân'}!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 580px; margin: 0 auto; border: 1.5px solid #fed7aa; border-radius: 16px; background: #fffcf9; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #e26928; margin: 0; font-size: 24px;">🎓 Có lời chúc tốt nghiệp mới dành cho Bonbon! 💌</h2>
            <p style="color: #8c583a; font-size: 14px; margin-top: 6px;">Thời gian: ${new Date(wish.createdAt).toLocaleString('vi-VN')}</p>
          </div>

          <div style="background: #ffffff; padding: 18px 20px; border-left: 5px solid #e26928; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #b94b15;">
              Người gửi: <span style="color: #222;">${wish.name || 'Bạn ẩn danh'}</span>
            </p>
            <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #333; white-space: pre-wrap;">${wish.text}</p>
          </div>

          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
            Thư thông báo tự động qua Nodemailer từ trang kỷ niệm tốt nghiệp Bonbon (Nam Anh) 🌸
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Nodemailer] Gửi email thành công tới [${targetEmail}]! Message ID: ${info.messageId}`);
    return { sent: true, messageId: info.messageId, to: targetEmail };
  } catch (err) {
    console.error('❌ [Nodemailer] Gặp lỗi khi gửi email qua Gmail:', err.message);
    return { sent: false, error: err.message };
  }
}

function readJson(filePath, defaultData = {}) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultData;
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Routes
// 1. Get Config
app.get('/api/config', (req, res) => {
  const config = readJson(CONFIG_FILE, {});
  res.json(config);
});

// 2. Save Config
app.post('/api/config', (req, res) => {
  const newConfig = req.body;
  if (!newConfig || typeof newConfig !== 'object') {
    return res.status(400).json({ error: 'Dữ liệu cấu hình không hợp lệ' });
  }
  const success = writeJson(CONFIG_FILE, newConfig);
  if (success) {
    res.json({ message: 'Lưu cấu hình thành công', config: newConfig });
  } else {
    res.status(500).json({ error: 'Không thể lưu cấu hình' });
  }
});

// 3. Get Wishes
app.get('/api/wishes', (req, res) => {
  const wishes = readJson(WISHES_FILE, []);
  res.json(wishes);
});

// 4. Add Wish (Lưu lời chúc & gửi email qua Nodemailer)
app.post('/api/wishes', async (req, res) => {
  const { name, text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Lời chúc không được để trống' });
  }

  const wishes = readJson(WISHES_FILE, []);
  const newWish = {
    id: 'wish-' + Date.now() + '-' + Math.round(Math.random() * 1000),
    name: name && name.trim() ? name.trim() : 'Bạn ẩn danh',
    text: text.trim(),
    createdAt: Date.now()
  };

  wishes.unshift(newWish);
  writeJson(WISHES_FILE, wishes);

  // Gửi email qua Nodemailer và trả kết quả về cho client
  const emailResult = await sendNotificationEmail(newWish);

  res.status(201).json({
    message: 'Gửi lời chúc thành công',
    wish: newWish,
    emailSent: emailResult.sent,
    emailTo: emailResult.to || null,
    emailError: emailResult.error || null
  });
});

// 5. Delete Wish
app.delete('/api/wishes/:id', (req, res) => {
  const { id } = req.params;
  let wishes = readJson(WISHES_FILE, []);
  const initialLength = wishes.length;
  wishes = wishes.filter(w => w.id !== id);

  if (wishes.length !== initialLength) {
    writeJson(WISHES_FILE, wishes);
    res.json({ message: 'Đã xóa lời chúc', id });
  } else {
    res.status(404).json({ error: 'Không tìm thấy lời chúc' });
  }
});

// 6. File Upload (Image / Audio)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Không có tệp tải lên' });
  }

  // Construct URL
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: 'Tải tệp lên thành công',
    url: fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
