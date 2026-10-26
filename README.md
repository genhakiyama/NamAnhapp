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

## ☁️ Hướng dẫn Deploy lên Cloudflare Pages (Miễn phí 100%)

Dự án đã được cấu hình sẵn **Cloudflare Pages Functions** (`functions/api/`), file định tuyến `_routes.json`, file cấu hình `_headers` và cơ chế lưu trữ bền vững (Local cache + Serverless API).

### Cách 1: Kết nối tự động qua GitHub (Khuyên dùng - Dễ nhất & Miễn phí)

1. Đẩy code lên GitHub:
   ```bash
   git add .
   git commit -m "feat: configure cloudflare pages deployment"
   git push -u origin main
   ```
2. Truy cập [Cloudflare Dashboard](https://dash.cloudflare.com/) (đăng ký tài khoản miễn phí nếu chưa có).
3. Vào mục **Workers & Pages** -> chọn **Create application** -> chọn thẻ **Pages** -> **Connect to Git**.
4. Chọn repository **`NamAnhapp`** của bạn.
5. Cài đặt thông số Build (Build settings):
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `client/dist`
   - **Root directory**: `/` (để trống hoặc điền `/`)
6. Bấm **Save and Deploy**. Sau ~1 phút, bạn sẽ nhận được một địa chỉ web miễn phí dạng:  
   👉 `https://namanh-app.pages.dev` (kèm chứng chỉ bảo mật HTTPS vĩnh viễn miễn phí, hỗ trợ gắn tên miền riêng miễn phí).

---

### Cách 2: Deploy trực tiếp từ Terminal bằng Wrangler

Nếu bạn muốn deploy ngay lập tức từ máy tính mà không cần qua GitHub:
```bash
npm run deploy
```
*(Lần đầu chạy lệnh, terminal sẽ mở trình duyệt để bạn đăng nhập tài khoản Cloudflare, sau đó ứng dụng sẽ tự động tải lên và cấp link web ngay lập tức).*

