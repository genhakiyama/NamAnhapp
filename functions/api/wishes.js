// Cloudflare Pages Function: /api/wishes
const INITIAL_WISHES = [
  {
    id: "wish-1",
    name: "Nam Anh",
    text: "Chúc mừng Bonbon tốt nghiệp xuất sắc! Tự hào về bạn rất nhiều 🎓✨",
    createdAt: 1793000000000
  },
  {
    id: "wish-2",
    name: "Thầy cô Khoa Tiếng Đức",
    text: "Chúc em vững bước trên con đường tương lai, luôn giữ trọn ngọn lửa đam mê!",
    createdAt: 1792990000000
  }
];

export async function onRequestGet(context) {
  const { env } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    if (env && env.GRAD_KV) {
      const stored = await env.GRAD_KV.get('wishes', 'json');
      if (Array.isArray(stored)) {
        return new Response(JSON.stringify(stored), { headers });
      }
    }
  } catch (err) {
    console.error('KV get wishes error:', err);
  }

  return new Response(JSON.stringify(INITIAL_WISHES), { headers });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const body = await request.json();
    const { name, text } = body;
    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Lời chúc không được để trống' }), { status: 400, headers });
    }

    let wishes = INITIAL_WISHES;
    if (env && env.GRAD_KV) {
      const stored = await env.GRAD_KV.get('wishes', 'json');
      if (Array.isArray(stored)) {
        wishes = stored;
      }
    }

    const newWish = {
      id: 'wish-' + Date.now() + '-' + Math.round(Math.random() * 1000),
      name: name && name.trim() ? name.trim() : 'Bạn ẩn danh',
      text: text.trim(),
      createdAt: Date.now()
    };

    wishes.unshift(newWish);

    if (env && env.GRAD_KV) {
      await env.GRAD_KV.put('wishes', JSON.stringify(wishes));
    }

    return new Response(JSON.stringify({ message: 'Gửi lời chúc thành công', wish: newWish }), { status: 201, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers });
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Thiếu wish id' }), { status: 400, headers });
    }

    if (env && env.GRAD_KV) {
      let wishes = (await env.GRAD_KV.get('wishes', 'json')) || INITIAL_WISHES;
      wishes = wishes.filter(w => w.id !== id);
      await env.GRAD_KV.put('wishes', JSON.stringify(wishes));
    }

    return new Response(JSON.stringify({ message: 'Đã xóa lời chúc', id }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
