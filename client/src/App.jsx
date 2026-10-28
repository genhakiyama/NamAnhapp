import React, { useState, useEffect } from 'react';
import MusicPlayer from './components/MusicPlayer';
import StagePhoto from './components/StagePhoto';
import StageLetter from './components/StageLetter';
import StageInvite from './components/StageInvite';
import StageMemoriesWishes from './components/StageMemoriesWishes';
import MusicRain from './components/MusicRain';

const INITIAL_WISHES = [
  {
    id: 'w1',
    name: 'Nam Anh (Bonbon)',
    text: 'Cảm ơn mọi người đã đồng hành và chia sẻ niềm vui tốt nghiệp cùng mình! ♡',
    createdAt: Date.now()
  },
  {
    id: 'w2',
    name: 'Hội bạn thân K22',
    text: 'Chúc Bonbon luôn rạng rỡ, thành công và mãi giữ nụ cười thật tươi nhé! 🎓✨',
    createdAt: Date.now() - 3600000
  }
];

export default function App() {
  const [curStage, setCurStage] = useState(0);
  const [wishes, setWishes] = useState(() => {
    try {
      const saved = localStorage.getItem('bonbon_wishes');
      return saved ? JSON.parse(saved) : INITIAL_WISHES;
    } catch (e) {
      return INITIAL_WISHES;
    }
  });

  // Tải lời chúc mới nhất từ API Worker (nếu có)
  useEffect(() => {
    fetch('/api/wishes')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API not available');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setWishes(data);
          try {
            localStorage.setItem('bonbon_wishes', JSON.stringify(data));
          } catch (e) {}
        }
      })
      .catch(() => {
        // Sử dụng localStorage và dữ liệu mặc định mượt mà
      });
  }, []);

  const handleStageChange = (idx) => {
    setCurStage(idx);
  };

  const handleSendWish = async (wish) => {
    const newWish = {
      id: 'wish-' + Date.now(),
      name: wish.name || 'Người bạn thân mến',
      text: wish.text,
      createdAt: Date.now()
    };

    setWishes((prev) => {
      const updated = [newWish, ...prev];
      try {
        localStorage.setItem('bonbon_wishes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wish)
      });
    } catch (err) {
      console.warn('Saved to localStorage, offline API note:', err);
    }
  };

  return (
    <div className="app-container">
      {/* Nền tranh sơn dầu Van Gogh (Tự động đổi sang bầu trời sao xoáy hồng ở Trang 4) */}
      <div
        className={`bg-van-gogh ${curStage === 3 ? 'bg-pink-swirl-active' : ''}`}
        aria-hidden="true"
      />

      {/* Cơn mưa nốt nhạc bay lượn liên tục từ trên xuống */}
      <MusicRain count={32} />

      {/* Điều khiển nhạc nền YouTube: Tự động phát khi đi từ trang 2 trở về sau */}
      <MusicPlayer curStage={curStage} />

      {/* Chấm chuyển trang điều hướng trên cùng (4 trang) */}
      <nav className="nav-dots">
        <button
          className={`nav-dot ${curStage === 0 ? 'active' : ''}`}
          onClick={() => handleStageChange(0)}
          title="Trang 1: Bìa thiệp"
        />
        <button
          className={`nav-dot ${curStage === 1 ? 'active' : ''}`}
          onClick={() => handleStageChange(1)}
          title="Trang 2: Tâm sự tiếp nối"
        />
        <button
          className={`nav-dot ${curStage === 2 ? 'active' : ''}`}
          onClick={() => handleStageChange(2)}
          title="Trang 3: Thư mời tốt nghiệp"
        />
        <button
          className={`nav-dot ${curStage === 3 ? 'active' : ''}`}
          onClick={() => handleStageChange(3)}
          title="Trang 4: Kỷ niệm & Lời chúc"
        />
      </nav>

      {/* Vùng hiển thị các trang */}
      <main className="stages-wrapper">
        {/* Trang 1: Bìa thiệp tốt nghiệp Van Gogh */}
        <div className={`stage-slide ${curStage === 0 ? 'active' : 'inactive-prev'}`}>
          <StagePhoto onNext={() => handleStageChange(1)} />
        </div>

        {/* Trang 2: Trang tâm sự tiếp nối */}
        <div
          className={`stage-slide ${
            curStage === 1 ? 'active' : curStage > 1 ? 'inactive-prev' : 'inactive-next'
          }`}
        >
          <StageLetter
            onPrev={() => handleStageChange(0)}
            onNext={() => handleStageChange(2)}
          />
        </div>

        {/* Trang 3: Thư mời tốt nghiệp & Cún cưng đội nón cử nhân */}
        <div
          className={`stage-slide ${
            curStage === 2 ? 'active' : curStage > 2 ? 'inactive-prev' : 'inactive-next'
          }`}
        >
          <StageInvite
            onPrev={() => handleStageChange(1)}
            onNext={() => handleStageChange(3)}
          />
        </div>

        {/* Trang 4: Trang cuối kỷ niệm với Video 1 & 2 + Lời chúc */}
        <div className={`stage-slide ${curStage === 3 ? 'active' : 'inactive-next'}`}>
          <StageMemoriesWishes
            wishes={wishes}
            onSendWish={handleSendWish}
            onPrev={() => handleStageChange(2)}
          />
        </div>
      </main>
    </div>
  );
}
