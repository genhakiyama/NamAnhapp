// Cloudflare Worker entry point
// - /api/*  -> handled here (config, wishes, upload)
// - other   -> served from static assets (client/dist) via env.ASSETS
//
// Optional persistence: bind a KV namespace as GRAD_KV (see wrangler.toml).
// Without KV, the API returns defaults and the client keeps data in localStorage.

import nodemailer from 'nodemailer';

function buildWishEmailHtml(wish) {
  return `
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
}

async function sendWishEmailFromWorker(wish, env) {
  const rawReceiver = env.RECEIVER_EMAIL || 'bonnanguyen2004@gmail.com, sandundertailroal@gmail.com';
  const emailUser = (env.EMAIL_USER || 'sandundertailroal@gmail.com').trim();
  const emailPass = (env.EMAIL_PASS || 'fhsb mbea idhf jlbo').replace(/\s+/g, '');
  const resendApiKey = (env.RESEND_API_KEY || '').trim();
  const brevoApiKey = (env.BREVO_API_KEY || '').trim();

  const recipients = Array.from(
    new Set(
      rawReceiver
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean)
        .concat(emailUser ? [emailUser] : [])
    )
  );
  const subject = `🎓 Lời chúc tốt nghiệp mới từ ${wish.name || 'Người bạn thân'}!`;
  const html = buildWishEmailHtml(wish);

  // 1. Gửi qua Resend REST API (HTTPS POST - chuẩn cho Cloudflare Worker nếu có RESEND_API_KEY)
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.RESEND_FROM || 'Bonbon Graduation <onboarding@resend.dev>',
          to: recipients,
          subject,
          html
        })
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return { sent: true, provider: 'resend-rest-api', id: data.id || null, to: recipients.join(', ') };
      }
    } catch (err) {
      console.error('Resend REST API error:', err);
    }
  }

  // 2. Gửi qua Brevo REST API (HTTPS POST - nếu có BREVO_API_KEY)
  if (brevoApiKey) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Thiệp Tốt Nghiệp Bonbon', email: emailUser },
          to: recipients.map((email) => ({ email })),
          subject,
          htmlContent: html
        })
      });
      if (res.ok) {
        return { sent: true, provider: 'brevo-rest-api', to: recipients.join(', ') };
      }
    } catch (err) {
      console.error('Brevo REST API error:', err);
    }
  }

  // 3. Gửi qua Nodemailer với nodejs_compat trên Cloudflare Workers (Port 465 SSL)
  if (emailUser && emailPass) {
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

      const info = await transporter.sendMail({
        from: `"Thiệp Tốt Nghiệp Bonbon" <${emailUser}>`,
        to: recipients.join(', '),
        subject,
        html
      });

      return { sent: true, provider: 'nodemailer-worker', messageId: info.messageId, to: recipients.join(', ') };
    } catch (err) {
      console.error('Worker Nodemailer error:', err);
      return { sent: false, error: err.message };
    }
  }

  return { sent: false, error: 'No email credentials configured' };
}

const DEFAULT_CONFIG = {
  general: {
    siteTitle: 'Mừng tốt nghiệp · Bonbon',
    graduateName: 'Bonbon',
    fieldAndSchool: 'Germanistik · USSH TP.HCM',
    themeColor: '#e8619a',
    cardBgColor: 'rgba(255, 248, 243, 0.93)',
    textColor: '#5a2547',
    customBgUrl: ''
  },
  stage0: {
    badgeText: 'Chúc mừng tốt nghiệp!',
    heroTagline: 'Bốn năm với tiếng Đức — cảm ơn vì đã ghé thăm ngày đặc biệt này 🎓',
    photoUrl: '',
    buttonText: 'Bắt đầu ♡'
  },
  stage1: {
    title: 'Lời cảm ơn',
    paragraphs: [
      'Danke schön! Cảm ơn gia đình đã luôn là điểm tựa, cảm ơn thầy cô đã dẫn dắt mình đi qua từng bài chia động từ và từng trang văn học, cảm ơn bạn bè đã cùng mình học, cùng cười và cùng thức khuya.',
      'Cảm ơn các bạn học viên, những người cho mình biết dạy học hạnh phúc đến nhường nào. Hành trình này chưa dừng lại: phía trước vẫn còn nhiều trang tiếng Đức để viết tiếp.'
    ],
    signature: 'Vielen Dank! — Bonbon',
    nextButtonText: 'Tiếp ›'
  },
  stage2: {
    title: 'Thư mời',
    hintText: 'Nhấn vào phong thư để mở nhé 💌',
    invitationHeading: 'Bonbon trân trọng mời bạn đến chung vui lễ tốt nghiệp',
    time: '08:30 · Thứ Bảy, 15/11/2026',
    place: 'Hội trường A · ĐH KHXH&NV, Đinh Tiên Hoàng, Q.1',
    dressCode: 'Tone Pastel / Tự do lịch sự',
    closingMessage: 'Sự hiện diện của bạn là món quà đẹp nhất. Auf Wiedersehen — và hẹn gặp bạn nhé! 🎓',
    nextButtonText: 'Gửi lời chúc ›'
  },
  stage3: {
    title: 'Lời chúc từ bạn',
    subtitle: 'Để lại vài dòng chúc mừng cho Bonbon nhé!',
    namePlaceholder: 'Tên của bạn',
    messagePlaceholder: 'Lời chúc của bạn…',
    sendButtonText: 'Gửi lời chúc 💌'
  },
  audio: {
    musicUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
    playOnAnyButtonClick: true,
    buttonSoundEffect: true,
    musicVolume: 0.7,
    soundVolume: 0.5
  }
};

const INITIAL_WISHES = [
  {
    id: 'wish-1',
    name: 'Nam Anh',
    text: 'Chúc mừng Bonbon tốt nghiệp xuất sắc! Tự hào về bạn rất nhiều 🎓✨',
    createdAt: 1793000000000
  },
  {
    id: 'wish-2',
    name: 'Thầy cô Khoa Tiếng Đức',
    text: 'Chúc em vững bước trên con đường tương lai, luôn giữ trọn ngọn lửa đam mê!',
    createdAt: 1792990000000
  }
];

let memoryWishes = [...INITIAL_WISHES];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
  });
}

async function kvGet(env, key, fallback) {
  if (!env.GRAD_KV) {
    if (key === 'wishes') return memoryWishes;
    return fallback;
  }
  try {
    const value = await env.GRAD_KV.get(key, 'json');
    return value ?? fallback;
  } catch (err) {
    console.error('KV get error:', err);
    return fallback;
  }
}

async function kvPut(env, key, value) {
  if (key === 'wishes') {
    memoryWishes = value;
  }
  if (!env.GRAD_KV) return true;
  await env.GRAD_KV.put(key, JSON.stringify(value));
  return true;
}

// ---------- /api/config ----------
async function handleConfig(request, env) {
  if (request.method === 'GET') {
    return json(await kvGet(env, 'config', DEFAULT_CONFIG));
  }
  if (request.method === 'POST') {
    const newConfig = await request.json();
    if (!newConfig || typeof newConfig !== 'object') {
      return json({ error: 'Dữ liệu cấu hình không hợp lệ' }, 400);
    }
    const persisted = await kvPut(env, 'config', newConfig);
    return json({ message: 'Lưu cấu hình thành công', persisted, config: newConfig });
  }
  return json({ error: 'Method not allowed' }, 405);
}

// ---------- /api/wishes ----------
async function handleWishes(request, env, url) {
  if (request.method === 'GET') {
    return json(await kvGet(env, 'wishes', INITIAL_WISHES));
  }

  if (request.method === 'POST') {
    const { name, text } = await request.json();
    if (!text || !String(text).trim()) {
      return json({ error: 'Lời chúc không được để trống' }, 400);
    }
    const wishes = await kvGet(env, 'wishes', [...INITIAL_WISHES]);
    const newWish = {
      id: 'wish-' + Date.now() + '-' + Math.round(Math.random() * 1000),
      name: name && String(name).trim() ? String(name).trim().slice(0, 40) : 'Bạn ẩn danh',
      text: String(text).trim().slice(0, 400),
      createdAt: Date.now()
    };
    wishes.unshift(newWish);
    await kvPut(env, 'wishes', wishes.slice(0, 500));

    // Gửi email thông báo tự động qua REST API / Worker Nodemailer
    const emailResult = await sendWishEmailFromWorker(newWish, env);

    return json(
      {
        message: 'Gửi lời chúc thành công',
        wish: newWish,
        emailSent: emailResult.sent,
        emailProvider: emailResult.provider || null,
        emailTo: emailResult.to || null,
        emailError: emailResult.error || null
      },
      201
    );
  }

  if (request.method === 'DELETE') {
    // Supports both /api/wishes?id=xxx and /api/wishes/xxx
    const parts = url.pathname.split('/').filter(Boolean); // ['api','wishes',id?]
    const id = url.searchParams.get('id') || parts[2];
    if (!id) return json({ error: 'Thiếu wish id' }, 400);
    const wishes = await kvGet(env, 'wishes', [...INITIAL_WISHES]);
    await kvPut(env, 'wishes', wishes.filter((w) => w.id !== id));
    return json({ message: 'Đã xóa lời chúc', id });
  }

  return json({ error: 'Method not allowed' }, 405);
}

// ---------- /api/upload ----------
// Converts the uploaded file to a data URL (no external storage needed).
async function handleUpload(request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return json({ error: 'Định dạng yêu cầu phải là multipart/form-data' }, 400);
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return json({ error: 'Không tìm thấy tệp tải lên' }, 400);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  const dataUrl = `data:${file.type || 'application/octet-stream'};base64,${btoa(binary)}`;

  return json({ message: 'Tải tệp thành công', url: dataUrl, filename: file.name, size: file.size });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: CORS_HEADERS });
      }
      try {
        if (url.pathname === '/api/config') return await handleConfig(request, env);
        if (url.pathname === '/api/wishes' || url.pathname.startsWith('/api/wishes/')) {
          return await handleWishes(request, env, url);
        }
        if (url.pathname === '/api/upload') return await handleUpload(request);
        return json({ error: 'Not found' }, 404);
      } catch (err) {
        return json({ error: err.message || 'Server error' }, 500);
      }
    }

    // Everything else: static React build
    return env.ASSETS.fetch(request);
  }
};
