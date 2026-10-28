import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function StageInvite({ onPrev, onNext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(35); // 0 - 100%

  // Lắng nghe trạng thái phát nhạc từ MusicPlayer toàn app
  useEffect(() => {
    const handleStatus = (e) => {
      if (e.detail && typeof e.detail.isPlaying === 'boolean') {
        setIsPlaying(e.detail.isPlaying);
      }
    };

    window.addEventListener('app:music-status', handleStatus);
    return () => {
      window.removeEventListener('app:music-status', handleStatus);
    };
  }, []);

  // Mô phỏng tiến trình phát nhạc khi đang phát
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlaybackProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Kích hoạt pháo bông & mở phong bì thư
  const handleOpenEnvelope = () => {
    if (isOpen) return;
    soundFX.playEnvelopeOpen();
    setIsOpen(true);

    // Bắn pháo bông rực rỡ nhiều đợt chào đón tốt nghiệp
    triggerCelebrationFireworks();
  };

  const triggerCelebrationFireworks = () => {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 32, spread: 360, ticks: 70, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    // Đợt 1: Bắn pháo bông nổ bung ở giữa
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.62 },
      colors: ['#e26928', '#f6a6c1', '#ffd700', '#7aa2f7', '#ffffff', '#ff7d8f']
    });

    // Đợt 2: Các cụm pháo hoa liên tiếp từ 2 bên sườn
    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 45 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.15, 0.35), y: Math.random() - 0.2 },
        colors: ['#ff7d8f', '#ffd700', '#e26928', '#ffffff']
      });

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.65, 0.85), y: Math.random() - 0.2 },
        colors: ['#f6a6c1', '#7aa2f7', '#ffd700', '#ffffff', '#e87738']
      });
    }, 280);
  };

  // Điều khiển nhạc từ Mini Player ở chân card
  const toggleMusic = () => {
    window.dispatchEvent(new CustomEvent('app:music-toggle'));
  };

  const handlePrevTrack = () => {
    window.dispatchEvent(new CustomEvent('app:music-seek', { detail: -10 }));
    setPlaybackProgress((prev) => Math.max(0, prev - 10));
  };

  const handleNextTrack = () => {
    window.dispatchEvent(new CustomEvent('app:music-seek', { detail: 10 }));
    setPlaybackProgress((prev) => Math.min(100, prev + 10));
  };

  const handleProgressBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setPlaybackProgress(newProgress);
  };

  return (
    <div className="invite-stage-wrapper">
      {!isOpen ? (
        /* ========================================================
           TRẠNG THÁI 1: TẤM THIỆP / PHONG BÌ CHỜ BẤM ĐỂ MỞ
           ======================================================== */
        <div className="card-van-gogh card-envelope-page">
          <img
            src="/ornament.png"
            alt="Hoa văn trang trí"
            className="sticker-ornament"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          <h2 className="envelope-heading">Thư mời tốt nghiệp 🎓</h2>
          <p className="envelope-guide-text">Chạm vào phong thư để mở thư mời nhé 💌</p>

          <div
            className="envelope-box clickable"
            onClick={handleOpenEnvelope}
            title="Nhấn vào phong bì để mở thư mời và ngắm pháo bông!"
          >
            <div className="envelope-back" />
            <div className="envelope-letter-peek">
              <span className="letter-peek-title">Thư mời</span>
            </div>
            <div className="envelope-front" />
            <div className="envelope-flap" />

            {/* Con dấu sáp trái tim đập nhịp nhàng */}
            <div className="wax-seal beat" title="Nhấn để mở">
              <svg viewBox="0 0 100 92" className="seal-heart-svg">
                <defs>
                  <radialGradient id="sealGrad" cx=".35" cy=".3" r=".9">
                    <stop offset="0" stopColor="#ff7d8f" />
                    <stop offset=".45" stopColor="#d4132f" />
                    <stop offset="1" stopColor="#5a0014" />
                  </radialGradient>
                </defs>
                <path
                  fill="url(#sealGrad)"
                  d="M50 88C20 66 3 48 3 28 3 13 14 3 28 3c9 0 18 5 22 13C54 8 63 3 72 3c14 0 25 10 25 25 0 20-17 38-47 60z"
                />
              </svg>
            </div>
          </div>

          <div className="envelope-actions">
            <button className="btn-back-card" onClick={onPrev} title="Quay lại trang tâm sự">
              ‹ Quay lại tâm sự
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================
           TRẠNG THÁI 2: THƯ MỜI CHÍNH THỨC (THEO ĐÚNG THIẾT KẾ MẪU)
           ======================================================== */
        <div className="card-van-gogh card-invite-card" id="inviteCard">
          {/* Tiêu đề "Thư mời" màu cam vàng nghệ thuật */}
          <h2 className="invite-title">Thư mời</h2>

          {/* Khối thông tin chi tiết */}
          <div className="invite-content-block">
            {/* Hàng 1: Thời gian */}
            <div className="invite-row">
              <span className="invite-label">Thời gian:</span>
              <span className="invite-value">
                11h30 &nbsp;–&nbsp; 13h30
                <br />
                <span className="invite-subdate">04/11/2026 (tức vào thứ 4 tuần sau)</span>
              </span>
            </div>

            {/* Hàng 2: Địa điểm */}
            <div className="invite-row">
              <span className="invite-label">Địa điểm:</span>
              <span className="invite-value">
                Số 10–12 Đinh Tiên Hoàng, phường Sài Gòn, TP. Hồ Chí Minh
                <br />
                <span className="invite-subplace">(Trường ĐH KHXH & NV - Cơ sở Sài Gòn)</span>
              </span>
            </div>

            {/* Hàng 3: Liên hệ qua */}
            <div className="invite-row">
              <span className="invite-label">Liên hệ qua:</span>
              <span className="invite-value">
                <a href="tel:0876277582" className="phone-link" title="Bấm để gọi điện">
                  0876277582
                </a>
              </span>
            </div>

            {/* Dòng nhắn nhủ thân thương in nghiêng mềm mại */}
            <p className="invite-closing-note">
              Sự hiện diện của bạn là một món quà lớn với mình!
              <br />
              <span className="invite-subnote">
                (Bòn xin phép không nhận quà đâu nhé – mình gặp nhau chụp hình là zui lắm rồi)
              </span>
            </p>
          </div>

          {/* KHU VỰC CHÂN THƯ MỜI: SÓNG NHẠC AUDIO WAVEFORM & MINI MUSIC PLAYER */}
          <div className="invite-audio-section">
            {/* Sóng âm thanh nhảy theo điệu nhạc */}
            <div className={`audio-waveform ${isPlaying ? 'playing' : 'paused'}`}>
              {Array.from({ length: 32 }).map((_, i) => (
                <span
                  key={i}
                  className="wave-bar"
                  style={{
                    animationDelay: `${(i * 0.06).toFixed(2)}s`,
                    height: isPlaying ? undefined : `${15 + (i % 5) * 8}%`
                  }}
                />
              ))}
            </div>

            {/* Thanh tiến trình phát nhạc */}
            <div className="audio-progress-track" onClick={handleProgressBarClick} title="Tua nhạc">
              <div
                className="audio-progress-bar"
                style={{ width: `${playbackProgress}%` }}
              />
              <div
                className="audio-scrubber-dot"
                style={{ left: `${playbackProgress}%` }}
              />
            </div>

            {/* Nút điều khiển nhạc: Lùi lại, Phát/Dừng, Bài tiếp */}
            <div className="audio-controls-row">
              <button
                className="audio-ctrl-btn"
                onClick={handlePrevTrack}
                title="Lùi 10 giây"
              >
                <SkipBack size={16} />
              </button>

              <button
                className="audio-play-btn"
                onClick={toggleMusic}
                title={isPlaying ? 'Tạm dừng nhạc' : 'Tiếp tục phát nhạc'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
              </button>

              <button
                className="audio-ctrl-btn"
                onClick={handleNextTrack}
                title="Tua tới 10 giây"
              >
                <SkipForward size={16} />
              </button>
            </div>
          </div>

          {/* STICKER CÚN CƯNG ĐỘI NÓN TỐT NGHIỆP Ở GÓC DƯỚI BÊN PHẢI */}
          <div className="puppy-corner-sticker" title="Cún cưng tốt nghiệp của Bonbon">
            <img
              src="/puppy-grad.png"
              alt="Cún cưng đội mũ cử nhân"
              className="puppy-grad-img"
              onError={(e) => {
                // Fallback nếu có lỗi
                e.currentTarget.src = '/puppy_raw.png';
              }}
            />
          </div>

          {/* NÚT ĐIỀU HƯỚNG DƯỚI CÙNG */}
          <div className="invite-footer-actions">
            <button className="btn-back-card" onClick={onPrev} title="Quay lại xem tâm sự">
              ‹ Quay lại tâm sự
            </button>
            <button
              className="btn-fold-card"
              onClick={() => setIsOpen(false)}
              title="Gấp lại phong bì thư"
            >
              💌 Đóng thư
            </button>
            {onNext && (
              <button
                className="btn-open-card btn-next-wishes"
                onClick={onNext}
                title="Sang trang gửi lời chúc và xem kỷ niệm"
              >
                Gửi lời chúc 💌 ›
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
