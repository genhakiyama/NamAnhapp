// Cloudflare Pages Function: /api/config
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

export async function onRequestGet(context) {
  const { env } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    if (env && env.GRAD_KV) {
      const stored = await env.GRAD_KV.get('config', 'json');
      if (stored) {
        return new Response(JSON.stringify(stored), { headers });
      }
    }
  } catch (err) {
    console.error('KV get error:', err);
  }

  return new Response(JSON.stringify(DEFAULT_CONFIG), { headers });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const newConfig = await request.json();
    if (env && env.GRAD_KV) {
      await env.GRAD_KV.put('config', JSON.stringify(newConfig));
    }
    return new Response(JSON.stringify({ message: 'Lưu cấu hình thành công', config: newConfig }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
