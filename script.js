/**
 * ==============================================================================
 * THIỆP CHÚC MỪNG TỐT NGHIỆP BONBON - SCRIPT.JS
 * Xử lý tải ảnh chân dung gắn cứng & cơ chế dự phòng (fallback) tự động
 * ==============================================================================
 */

/**
 * Xử lý khi ảnh chân dung images/photo.jpg tải thành công:
 * - Hiển thị ảnh chân dung cắt tròn hoàn hảo
 * - Ẩn placeholder màu nâu hồng "Hình chị ở đây"
 * 
 * @param {HTMLImageElement} img - Thẻ <img> chứa ảnh
 */
function handlePhotoLoad(img) {
  const placeholder = document.getElementById('photoPlaceholder');
  if (img && placeholder) {
    img.style.display = 'block';
    placeholder.style.display = 'none';
  }
}

/**
 * Xử lý khi images/photo.jpg chưa tồn tại trong thư mục hoặc gặp lỗi tải (404):
 * - Tự động ẩn thẻ <img>
 * - Hiển thị lại placeholder màu nâu hồng (#c4897a) với chữ "Hình chị ở đây"
 * 
 * @param {HTMLImageElement} img - Thẻ <img> chứa ảnh
 */
function handlePhotoError(img) {
  const placeholder = document.getElementById('photoPlaceholder');
  if (img && placeholder) {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  }
}

/**
 * Xử lý an toàn cho các sticker trang trí (nếu người dùng chưa bỏ ảnh sticker vào):
 * - Ẩn thẻ ảnh sticker bị lỗi để tránh hiện biểu tượng ảnh vỡ của trình duyệt
 * - Ngay khi có file PNG hợp lệ, sticker sẽ tự động hiện lơ lửng tuyệt đẹp
 * 
 * @param {HTMLImageElement} img - Thẻ <img> chứa sticker
 */
function handleStickerError(img) {
  if (img) {
    img.style.display = 'none';
  }
}

// Kiểm tra trạng thái ảnh khi trang web được tải xong (phòng trường hợp ảnh đã được cache)
document.addEventListener('DOMContentLoaded', () => {
  const photo = document.getElementById('bonbonPhoto');
  const placeholder = document.getElementById('photoPlaceholder');

  if (photo && placeholder) {
    // Nếu ảnh đã hoàn tất tải và có kích thước hợp lệ
    if (photo.complete && photo.naturalWidth > 0) {
      photo.style.display = 'block';
      placeholder.style.display = 'none';
    } else if (photo.complete && photo.naturalWidth === 0) {
      // Nếu trình duyệt đã thử tải nhưng thất bại (chưa có file)
      photo.style.display = 'none';
      placeholder.style.display = 'flex';
    }
  }
});
