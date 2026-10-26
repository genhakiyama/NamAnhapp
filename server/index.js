import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// 4. Add Wish
app.post('/api/wishes', (req, res) => {
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

  res.status(201).json({ message: 'Gửi lời chúc thành công', wish: newWish });
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
