import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Send, Heart, Play, Pause, Volume2, VolumeX, Sparkles, Film, Lock } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function StageMemoriesWishes({
  stageData,
  wishes = [],
  onSendWish,
  onPrev,
  onOpenAdmin
}) {
  const [activeVideo, setActiveVideo] = useState(2); // 1 hoặc 2 (mặc định video 2 như mockup)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef(null);

  // Form lời chúc
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Trạng thái mini music player
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    const handleStatus = (e) => {
      if (e.detail && typeof e.detail.isPlaying === 'boolean') {
        setIsMusicPlaying(e.detail.isPlaying);
      }
    };
    window.addEventListener('app:music-status', handleStatus);
    return () => window.removeEventListener('app:music-status', handleStatus);
  }, []);

  // Xử lý khi đổi video
  const handleSelectVideo = (videoNum) => {
    setActiveVideo(videoNum);
    setIsVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  // Toggle video play / pause
  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  // Toggle video mute / sound
  const toggleVideoMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsVideoMuted(videoRef.current.muted);
  };

  // Gửi lời chúc
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    soundFX.playChord();
    setLoading(true);

    try {
      if (onSendWish) {
        await onSendWish({ name: name.trim(), text: text.trim() });
      }
      setText('');
      setSentSuccess(true);
      soundFX.playSuccess();

      confetti({
        particleCount: 100,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#e26928', '#f6a6c1', '#ffd700', '#ffffff', '#7aa2f7']
      });

      setTimeout(() => {
        setSentSuccess(false);
      }, 2500);
    } catch (err) {
      console.error('Error sending wish:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMusic = () => {
    window.dispatchEvent(new CustomEvent('app:music-toggle'));
  };

  return (
    <div className="stage-final-container">
      {/* ========================================================
          CỘT TRÁI (LEFT PANEL): VIDEO 1, 2, 3, 4, 5 + POLAROID + MINI PLAYER
          ======================================================== */}
      <aside className="final-left-decor">
        {/* Khung phát Video 1 -> 5 */}
        <div className="final-video-box">
          {/* Tab chọn Video 1, 2, 3, 4, 5 */}
          <div className="video-tabs-row">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`video-tab-btn ${activeVideo === num ? 'active' : ''}`}
                onClick={() => handleSelectVideo(num)}
                title={`Xem Video kỷ niệm ${num}`}
              >
                <Film size={12} /> Video {num}
              </button>
            ))}
          </div>

          {/* Vùng hiển thị video */}
          <div className="video-player-wrap" onClick={toggleVideoPlay}>
            <video
              ref={videoRef}
              key={activeVideo}
              src={`/video${activeVideo}.mp4`}
              className="final-video-element"
              playsInline
              loop
              autoPlay
              muted={isVideoMuted}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />

            {/* Nút Play to tròn ở giữa khi tạm dừng (như trong ảnh mẫu) */}
            {!isVideoPlaying && (
              <div className="video-center-play-btn" title="Phát video">
                <Play size={26} fill="#ffffff" color="#ffffff" style={{ marginLeft: '3px' }} />
              </div>
            )}

            {/* Nút bật / tắt âm thanh video ở góc trên */}
            <button
              className="video-mute-badge"
              onClick={toggleVideoMute}
              title={isVideoMuted ? 'Bật âm thanh video' : 'Tắt tiếng video'}
            >
              {isVideoMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>

        {/* Sticker Polaroid ảnh Lâu đài & thanh điều khiển mini */}
        <div className="polaroid-music-sticker" title="Kỷ niệm nước Đức xinh đẹp">
          <img
            src="/sticker_polaroid.png"
            alt="Ảnh Polaroid lâu đài"
            className="polaroid-sticker-img"
          />
        </div>

        {/* Sóng nhạc Waveform + Avatar NA (như trong ảnh mẫu) */}
        <div className="final-mini-audio-bar">
          <div className="waveform-avatar-row">
            {/* Sóng nhạc nhảy nhót */}
            <div
              className={`mini-waveform ${isMusicPlaying ? 'playing' : 'paused'}`}
              onClick={toggleMusic}
              title="Bật/Tắt nhạc nền"
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <span key={i} className="mini-wave-bar" style={{ animationDelay: `${i * 0.07}s` }} />
              ))}
            </div>

            {/* Icon Avatar tròn NA có chấm đỏ thông báo */}
            <div className="na-avatar-circle" title="Nam Anh - Bonbon">
              <span className="na-text">NA</span>
              <span className="na-red-dot" />
            </div>
          </div>

          {/* Nút điều khiển nhạc mini */}
          <div className="final-audio-controls">
            <button
              className="final-ctrl-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('app:music-seek', { detail: -10 }))}
              title="Lùi 10s"
            >
              ◀◀
            </button>
            <button
              className="final-play-btn"
              onClick={toggleMusic}
              title={isMusicPlaying ? 'Tạm dừng nhạc' : 'Tiếp tục phát'}
            >
              {isMusicPlaying ? <Pause size={13} fill="#fff" /> : <Play size={13} fill="#fff" style={{ marginLeft: '1px' }} />}
            </button>
            <button
              className="final-ctrl-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('app:music-seek', { detail: 10 }))}
              title="Tiến 10s"
            >
              ▶▶
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          Ở GIỮA (CENTER): THẺ LỜI CHÚC TỪ BẠN (GIỮ NGUYÊN FORM)
          ======================================================== */}
      <main className="card-van-gogh card-wishes-final" id="wishesCard">
        {/* Hoa văn đỉnh */}
        <img
          src="/ornament.png"
          alt="Hoa văn trang trí"
          className="sticker-ornament"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />

        <h2 className="wishes-main-title">
          <Sparkles size={22} className="sparkle-icon" />
          <span>Lời chúc từ bạn</span>
          <Sparkles size={22} className="sparkle-icon" />
        </h2>

        <p className="wishes-subtitle">
          Để lại vài dòng chúc mừng tốt nghiệp cho Bonbon nhé! 🎓✨
        </p>

        {/* Form gửi lời chúc */}
        <form onSubmit={handleSend} className="wishes-input-form">
          <input
            id="wn"
            type="text"
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên hoặc biệt danh của bạn…"
            className="wish-text-input"
            required
          />
          <textarea
            id="wt"
            rows={3}
            maxLength={400}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Gửi lời chúc yêu thương đến Bonbon…"
            className="wish-textarea"
            required
          />
          <button
            type="submit"
            id="send"
            className="btn-open-card btn-send-wish"
            disabled={loading || !text.trim()}
          >
            {sentSuccess ? (
              <span className="btn-flex-inner">
                <Heart size={18} fill="#ffffff" /> Cảm ơn bạn rất nhiều! 💖
              </span>
            ) : (
              <span className="btn-flex-inner">
                <Send size={16} /> Gửi lời chúc 💌
              </span>
            )}
          </button>
        </form>

        {/* Danh sách lời chúc đã gửi (ẩn tên người gửi theo yêu cầu) */}
        <div id="list" className="wishes-stream-box">
          <h3 className="wishes-list-heading">Sổ lưu bút kỷ niệm 📖</h3>
          {wishes && wishes.length > 0 ? (
            <div className="wishes-scrollable-list">
              {wishes.map((w, index) => (
                <div key={w.id || index} className="wish-item-card">
                  <div className="wish-header">
                    <span className="wish-heart-icon">💌 Lời chúc gửi tặng Bonbon ♡</span>
                  </div>
                  <p className="wish-content">{w.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="wishes-empty-text">
              Chưa có lời chúc nào. Hãy là người đầu tiên gửi tặng Bonbon nhé! 🌸
            </p>
          )}
        </div>

        {/* Nút quay lại xem thư mời & Nút mở trang xem lời chúc dành riêng cho BonBon */}
        <div className="wishes-bottom-actions">
          <button className="btn-back-card" onClick={onPrev} title="Quay lại xem Thư mời">
            ‹ Xem lại Thư mời
          </button>
          {onOpenAdmin && (
            <button
              className="btn-admin-vault"
              onClick={onOpenAdmin}
              title="Trang xem lời chúc đã gửi (Chỉ dành cho BonBon)"
            >
              <Lock size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
              Hộp thư BonBon
            </button>
          )}
        </div>
      </main>

      {/* ========================================================
          CỘT PHẢI (RIGHT PANEL): STICKER MÁY NINTENDO SWITCH ẢNH BONBON
          ======================================================== */}
      <aside className="final-right-decor">
        <div className="switch-console-sticker" title="Bonbon (Nam Anh) - Kỷ niệm tốt nghiệp">
          <img
            src="/sticker_switch.png"
            alt="Ảnh kỷ niệm Bonbon trên khung Switch"
            className="switch-sticker-img"
            onError={(e) => {
              e.currentTarget.src = '/switch_raw.png';
            }}
          />
        </div>
      </aside>
    </div>
  );
}
