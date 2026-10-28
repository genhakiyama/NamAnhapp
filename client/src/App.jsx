import React, { useState, useEffect } from 'react';
import MusicPlayer from './components/MusicPlayer';
import StagePhoto from './components/StagePhoto';
import StageLetter from './components/StageLetter';
import StageInvite from './components/StageInvite';
import StageMemoriesWishes from './components/StageMemoriesWishes';
import StageAdminWishes from './components/StageAdminWishes';
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

function mergeWishesList(localList, remoteList) {
  const map = new Map();
  // Ưu tiên giữ toàn bộ lời chúc đã lưu trên máy người dùng và từ API, tránh mất lời chúc vừa gửi
  [...(Array.isArray(localList) ? localList : []), ...(Array.isArray(remoteList) ? remoteList : [])].forEach((item) => {
    if (!item || !item.text) return;
    const key = item.id || `${item.name || ''}-${item.text}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  });
  return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export default function App() {
  const [curStage, setCurStage] = useState(0);
  const [wishes, setWishes] = useState(() => {
    try {
      const saved = localStorage.getItem('bonbon_wishes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_WISHES;
    } catch (e) {
      return INITIAL_WISHES;
    }
  });

  // Đồng bộ wishes vào localStorage mỗi khi state wishes thay đổi để đảm bảo lời chúc luôn được giữ lại
  useEffect(() => {
    try {
      localStorage.setItem('bonbon_wishes', JSON.stringify(wishes));
    } catch (e) {}
  }, [wishes]);

  // Tải lời chúc từ API Worker / Server và gộp với lời chúc đã lưu ở localStorage (không ghi đè làm mất lời chúc)
  useEffect(() => {
    fetch('/api/wishes')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API not available');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setWishes((prev) => mergeWishesList(prev, data));
        }
      })
      .catch(() => {
        // Giữ nguyên dữ liệu từ localStorage
      });
  }, []);

  const handleStageChange = (idx) => {
    setCurStage(idx);
  };

  const handleSendWish = async (wish) => {
    const newWish = {
      id: 'wish-' + Date.now() + '-' + Math.round(Math.random() * 1000),
      name: wish.name || 'Người bạn thân mến',
      text: wish.text,
      createdAt: Date.now()
    };

    // Cập nhật ngay lập tức và lưu bền vững vào localStorage
    setWishes((prev) => {
      const updated = [newWish, ...prev];
      try {
        localStorage.setItem('bonbon_wishes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWish.name, text: newWish.text })
      });
      if (res.ok) {
        const result = await res.json();
        if (result && result.wish) {
          setWishes((prev) => {
            const updated = prev.map((w) => (w.id === newWish.id ? result.wish : w));
            try {
              localStorage.setItem('bonbon_wishes', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      }
    } catch (err) {
      console.warn('Saved to localStorage, offline API note:', err);
    }
  };

  const handleDeleteWish = async (wishId) => {
    setWishes((prev) => {
      const updated = prev.filter((w) => w.id !== wishId);
      try {
        localStorage.setItem('bonbon_wishes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      await fetch(`/api/wishes/${encodeURIComponent(wishId)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      // Đã xóa trong localStorage
    }
  };

  return (
    <div className="app-container">
      {/* Nền tranh sơn dầu Van Gogh (Tự động đổi sang bầu trời sao xoáy hồng ở Trang 4 & 5) */}
      <div
        className={`bg-van-gogh ${curStage >= 3 ? 'bg-pink-swirl-active' : ''}`}
        aria-hidden="true"
      />

      {/* Cơn mưa nốt nhạc bay lượn liên tục từ trên xuống */}
      <MusicRain count={32} />

      {/* Điều khiển nhạc nền YouTube: Tự động phát khi đi từ trang 2 trở về sau */}
      <MusicPlayer curStage={curStage} />

      {/* Chấm chuyển trang điều hướng trên cùng (5 trang, trang 5 là hộp thư mật của BonBon) */}
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
        <button
          className={`nav-dot nav-dot-admin ${curStage === 4 ? 'active' : ''}`}
          onClick={() => handleStageChange(4)}
          title="Trang 5: Hộp thư lưu bút (Chỉ dành cho BonBon)"
        />
      </nav>

      {/* Vùng hiển thị các trang */}
      <main className="stages-wrapper">
        {/* Trang 1: Bìa thiệp tốt nghiệp Van Gogh */}
        <div className={`stage-slide ${curStage === 0 ? 'active' : 'inactive-prev'}`}>
          <StagePhoto onNext={() => handleStageChange(1)} />
        </div>

        {/* Trang 2: Trang tâm sự tiếp nối (Giữ nguyên tỷ lệ bức thư to trên mọi thiết bị/zoom) */}
        <div
          className={`stage-slide stage-slide-letter ${
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

        {/* Trang 4: Trang kỷ niệm với Video 1 & 2 + Gửi lời chúc */}
        <div
          className={`stage-slide ${
            curStage === 3 ? 'active' : curStage > 3 ? 'inactive-prev' : 'inactive-next'
          }`}
        >
          <StageMemoriesWishes
            wishes={wishes}
            onSendWish={handleSendWish}
            onPrev={() => handleStageChange(2)}
            onOpenAdmin={() => handleStageChange(4)}
          />
        </div>

        {/* Trang 5: Trang quản lý & xem toàn bộ lời chúc đã gửi (Chỉ tài khoản BonBon / pass 1234567) */}
        <div className={`stage-slide ${curStage === 4 ? 'active' : 'inactive-next'}`}>
          <StageAdminWishes
            wishes={wishes}
            onDeleteWish={handleDeleteWish}
            onBack={() => handleStageChange(3)}
          />
        </div>
      </main>
    </div>
  );
}
