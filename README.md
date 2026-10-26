# 🎓 NamAnhapp - Trang Chúc Mừng & Thiệp Mời Tốt Nghiệp Tương Tác

Ứng dụng web Full-stack (React + Node.js Express) được phát triển dựa trên mẫu thiệp tốt nghiệp kỷ niệm tiếng Đức ("Mừng tốt nghiệp · Bonbon").

---

## ✨ Tính năng nổi bật

1. **Giao diện React tương tác đa tầng (4 Giai đoạn)**:
   - **Giai đoạn 1 (Ảnh bìa)**: Ảnh cử nhân hình tròn, tiêu đề, ngành học, trường học, hiệu ứng pháo hoa giấy (confetti) khi nhấn bắt đầu.
   - **Giai đoạn 2 (Lời cảm ơn)**: Những dòng tri ân chân thành tới gia đình, thầy cô, bạn bè và học viên.
   - **Giai đoạn 3 (Thư mời 3D)**: Phong thư 3D với con dấu sáp trái tim đập nhịp, hiệu ứng mở nắp phong thư và rút thiệp mời xem thời gian, địa điểm, dress code.
   - **Giai đoạn 4 (Lời chúc trực tiếp)**: Form để khách mời gửi lời chúc, hiển thị danh sách lời chúc theo thời gian thực kết nối với Backend.

2. **Âm nhạc & Hiệu ứng âm thanh khi bấm nút**:
   - **Nhạc nền**: Nút bật/tắt nhạc nền 🎵/🔊 góc phải trên cùng.
   - **Tự động kích hoạt khi nhấn nút**: Có thể bật tính năng tự động phát nhạc khi người dùng nhấn bất kỳ nút nào trên màn hình.
   - **Hiệu ứng âm thanh (Sound FX)**: Tích hợp Web Audio API phát tiếng chuông trong trẻo, tiếng mở phong thư và âm thanh chúc mừng mà không cần tải file ngoài.

3. **Bảng điều khiển Chỉnh sửa trực tiếp (Live Customizer / Admin Modal)**:
   - Nhấn nút **"Chỉnh sửa ⚙️"** ở góc trái trên cùng để mở bảng điều khiển:
     - **Ảnh & Bìa**: Đổi tên, ngành học, trường, tiêu đề, tải ảnh đại diện từ máy tính hoặc nhập link URL.
     - **Lời cảm ơn**: Chỉnh sửa tiêu đề, thêm/bớt/sửa các đoạn văn tri ân, đổi chữ ký.
     - **Thư mời**: Cập nhật thời gian, địa điểm tổ chức, dress code, thông điệp mời.
     - **Nhạc & Nút**: Đổi link nhạc .mp3 hoặc tải file nhạc lên, bật/tắt tự phát nhạc khi bấm nút, chỉnh âm lượng.
     - **Màu sắc & Giao diện**: Chọn màu chủ đạo (Color picker), màu nền thiệp, màu chữ, ảnh nền trang web.
   - Nút **Lưu thay đổi 💾** lưu trực tiếp vào cơ sở dữ liệu server (`server/data/config.json`).
   - Nút **Khôi phục gốc 🔄** để quay về cài đặt ban đầu.

4. **Đồ họa minh họa & Hình ảnh gốc**:
   - Kiến trúc Đức đặc trưng: Köln Dom, Brandenburger Tor, Mathildenhöhe (Hochzeitsturm).
   - Hai chú cún cưng hoạt họa đáng yêu (chó đốm và chó vàng đội mũ cử nhân).
   - Nốt nhạc bay lượn và trái tim đập nhịp nhàng.

---

## 🚀 Hướng dẫn cài đặt và khởi chạy

### Yêu cầu:
- Node.js (phiên bản 18+ trở lên)
- npm

### 1. Cài đặt các gói phụ thuộc:
```bash
npm run install:all
```

### 2. Chạy cả Backend & Frontend đồng thời:
```bash
npm run dev
```

- **Frontend (React)**: [http://localhost:3000](http://localhost:3000)
- **Backend (API Server)**: [http://localhost:5000](http://localhost:5000)

---

## ☁️ Deploy lên Cloudflare Workers (Miễn phí)

Dự án dùng **Cloudflare Workers + Static Assets**:
- `wrangler.toml`: cấu hình Worker `namanhapp`, phục vụ file tĩnh từ `client/dist`.
- `worker/index.js`: xử lý `/api/config`, `/api/wishes`, `/api/upload`; các đường dẫn khác trả về React app.

### Cách 1: Kết nối GitHub (tự deploy mỗi lần push)

Trong Cloudflare Dashboard → **Workers & Pages** → Worker `namanhapp` → **Settings** → **Build**:
- **Build command**: `npm run build`
- **Deploy command**: `npx wrangler deploy`
- **Root directory**: `/` (để trống)

### Cách 2: Deploy từ Terminal
```bash
npm run deploy
```

### (Tùy chọn) Lưu lời chúc vĩnh viễn bằng Workers KV
Nếu không có KV, lời chúc và chỉnh sửa chỉ được lưu trong trình duyệt của từng người (localStorage).
Để mọi khách mời cùng thấy lời chúc của nhau:
```bash
npx wrangler kv namespace create GRAD_KV
```
Sau đó bỏ comment khối `[[kv_namespaces]]` trong `wrangler.toml`, dán `id` vừa nhận rồi push lại.

