import React, { useRef } from 'react';
import confetti from 'canvas-confetti';

export default function StagePhoto({ onNext }) {
  const fileInputRef = useRef(null);
  const [photoSrc, setPhotoSrc] = React.useState('/profile4.jpg');

  // Load custom photo if saved in localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('bonbon_custom_photo_v4');
      if (saved) {
        setPhotoSrc(saved);
      }
    } catch (e) {}
  }, []);

  const handleStart = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#e26928', '#f6a6c1', '#ffd700', '#7aa2f7', '#ffffff']
    });
    onNext();
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setPhotoSrc(dataUrl);
        try {
          localStorage.setItem('bonbon_custom_photo_v4', dataUrl);
        } catch (err) {}
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="card-van-gogh" id="card">
      {/* Hoa văn trang trí trên đỉnh khung */}
      <img
        src="/ornament.png"
        alt="Hoa văn trang trí"
        className="sticker-ornament"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />

      {/* Hình tròn Profile Picture */}
      <div
        className="photo-circle-vg"
        onClick={handlePhotoClick}
        title="Nhấn để thay đổi ảnh nếu muốn"
      >
        <img
          src={photoSrc}
          alt="Ảnh tốt nghiệp Bonbon"
          className="photo-img-vg"
          onError={(e) => {
            e.currentTarget.src = '/profile.png';
          }}
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Dòng chữ chúc mừng màu cam nghệ thuật */}
      <div className="title-container-vg">
        <h1 className="card-title-vg">
          <span>Chúc mừng Bonbon tốt</span>
          <span>nghiệp</span>
        </h1>
      </div>

      {/* Nút bấm chuyển sang trang tiếp nối */}
      <div className="next-btn-wrapper">
        <button className="btn-open-card" onClick={handleStart} title="Nhấn để xem trang tiếp theo">
          Mở xem thiệp ›
        </button>
      </div>

      {/* Sticker góc dưới bên trái: Mũ cử nhân + cuộn bằng tốt nghiệp */}
      <img
        src="/graduation-cap.png"
        alt="Mũ cử nhân và cuộn bằng"
        className="sticker-vg sticker-cap-vg"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />

      {/* Sticker góc dưới bên phải: Quyển sổ xanh có trái tim + cây bút chì */}
      <img
        src="/notebook.png"
        alt="Quyển sổ và bút chì"
        className="sticker-vg sticker-notebook-vg"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
  );
}
