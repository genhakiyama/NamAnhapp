// Cloudflare Pages Function: /api/upload
export async function onRequestPost(context) {
  const { request } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file || !(file instanceof File)) {
        return new Response(JSON.stringify({ error: 'Không tìm thấy tệp tải lên' }), { status: 400, headers });
      }

      // Convert file buffer to base64 Data URL (serverless & zero external storage cost)
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      const dataUrl = `data:${file.type || 'application/octet-stream'};base64,${base64}`;

      return new Response(JSON.stringify({
        message: 'Tải tệp thành công',
        url: dataUrl,
        filename: file.name,
        size: file.size
      }), { headers });
    }

    return new Response(JSON.stringify({ error: 'Định dạng yêu cầu phải là multipart/form-data' }), { status: 400, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
