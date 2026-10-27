/**
 * ==============================================================================
 * THIỆP CHÚC MỪNG TỐT NGHIỆP - script.js
 * Xử lý ảnh gắn cứng images/photo.jpg + fallback placeholder
 * Ẩn sticker nếu file PNG không tồn tại
 * ==============================================================================
 */

/**
 * Khi ảnh photo.jpg tải thành công
 */
function handlePhotoLoad(img) {
  const placeholder = document.getElementById("photoPlaceholder");
  if (img && placeholder) {
    img.style.display = "block";
    placeholder.style.display = "none";
  }
}

/**
 * Khi ảnh photo.jpg không tồn tại hoặc lỗi tải -> trở về placeholder
 */
function handlePhotoError(img) {
  const placeholder = document.getElementById("photoPlaceholder");
  if (img && placeholder) {
    img.style.display = "none";
    placeholder.style.display = "flex";
  }
}

/**
 * Ẩn sticker nếu không tải được để tránh icon ảnh vỡ
 */
function handleStickerError(img) {
  if (img) {
    img.style.display = "none";
  }
}

// Kiểm tra cache
document.addEventListener("DOMContentLoaded", () => {
  const photo = document.getElementById("bonbonPhoto");
  const placeholder = document.getElementById("photoPlaceholder");

  if (photo && placeholder) {
    if (photo.complete && photo.naturalWidth > 0) {
      photo.style.display = "block";
      placeholder.style.display = "none";
    } else if (photo.complete && photo.naturalWidth === 0) {
      photo.style.display = "none";
      placeholder.style.display = "flex";
    }
  }
});
