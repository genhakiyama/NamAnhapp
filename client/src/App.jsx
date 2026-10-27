import React, { useState, useEffect } from 'react';
import { Settings, Eye } from 'lucide-react';

import BackgroundDecorations from './components/BackgroundDecorations';
import MusicPlayer from './components/MusicPlayer';
import StagePhoto from './components/StagePhoto';
import StageThanks from './components/StageThanks';
import StageInvite from './components/StageInvite';
import StageWishes from './components/StageWishes';
import StageLetter from './components/StageLetter';
import EditModal from './components/EditModal';
import { soundFX } from './utils/soundEffects';

const DEFAULT_CONFIG = {
  general: {
    siteTitle: 'Mừng tốt nghiệp · Bonbon',
    graduateName: 'Bonbon',
    fieldAndSchool: 'Germanistik · USSH TP.HCM',
    themeColor: '#e8619a',
    cardBgColor: 'rgba(255, 248, 243, 0.93)',
    textColor: '#5a2547',
    customBgUrl: '/background.jpg'
  },
  stage0: {
    badgeText: 'Chúc mừng tốt nghiệp!',
    heroTagline: 'Bốn năm với tiếng Đức — cảm ơn vì đã ghé thăm ngày đặc biệt này 🎓',
    photoUrl: '',
    buttonText: 'Bắt đầu ♡'
  },
  stage1: {
    title: 'Lời cảm ơn',
    paragraphs: [
      'Danke schön! Cảm ơn gia đình đã luôn là điểm tựa, cảm ơn thầy cô đã dẫn dắt mình đi qua từng bài chia động từ và từng trang văn học, cảm ơn bạn bè đã cùng mình học, cùng cười và cùng thức khuya.',
      'Cảm ơn các bạn học viên, những người cho mình biết dạy học hạnh phúc đến nhường nào. Hành trình này chưa dừng lại: phía trước vẫn còn nhiều trang tiếng Đức để viết tiếp.'
    ],
    signature: 'Vielen Dank! — Bonbon',
    nextButtonText: 'Tiếp ›'
  },
  stage2: {
    title: 'Thư mời',
    hintText: 'Nhấn vào phong thư để mở nhé 💌',
    invitationHeading: 'Bonbon trân trọng mời bạn đến chung vui lễ tốt nghiệp',
    time: '08:30 · Thứ Bảy, 15/11/2026',
    place: 'Hội trường A · ĐH KHXH&NV, Đinh Tiên Hoàng, Q.1',
    dressCode: 'Tone Pastel / Tự do lịch sự',
    closingMessage: 'Sự hiện diện của bạn là món quà đẹp nhất. Auf Wiedersehen — và hẹn gặp bạn nhé! 🎓',
    nextButtonText: 'Gửi lời chúc ›'
  },
  stage3: {
    title: 'Lời chúc từ bạn',
    subtitle: 'Để lại vài dòng chúc mừng cho Bonbon nhé!',
    namePlaceholder: 'Tên của bạn',
    messagePlaceholder: 'Lời chúc của bạn…',
    sendButtonText: 'Gửi lời chúc 💌'
  },
  audio: {
    musicUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
    playOnAnyButtonClick: true,
    buttonSoundEffect: true,
    musicVolume: 0.7,
    soundVolume: 0.5
  }
};

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [wishes, setWishes] = useState([]);
  const [curStage, setCurStage] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load config & wishes from server with LocalStorage fallback
  useEffect(() => {
    // 1. Instant check from localStorage
    try {
      const cachedConfig = localStorage.getItem('grad-config');
      if (cachedConfig) {
        setConfig(JSON.parse(cachedConfig));
      }
      const cachedWishes = localStorage.getItem('grad-wishes');
      if (cachedWishes) {
        setWishes(JSON.parse(cachedWishes));
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }

    // 2. Fetch fresh data from API
    const fetchData = async () => {
      try {
        const [configRes, wishesRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/wishes')
        ]);

        if (configRes.ok) {
          const cfg = await configRes.json();
          if (cfg && Object.keys(cfg).length > 0) {
            setConfig(cfg);
            try {
              localStorage.setItem('grad-config', JSON.stringify(cfg));
            } catch (e) {}
          }
        }

        if (wishesRes.ok) {
          const w = await wishesRes.json();
          if (Array.isArray(w) && w.length > 0) {
            setWishes(w);
            try {
              localStorage.setItem('grad-wishes', JSON.stringify(w));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('Could not fetch from server, using cached/defaults:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync document title and theme color CSS variables
  useEffect(() => {
    if (config.general?.siteTitle) {
      document.title = config.general.siteTitle;
    }
    const root = document.documentElement;
    if (config.general?.themeColor) {
      root.style.setProperty('--pink', config.general.themeColor);
    }
    if (config.general?.cardBgColor) {
      root.style.setProperty('--card', config.general.cardBgColor);
    }
    if (config.general?.textColor) {
      root.style.setProperty('--ink', config.general.textColor);
    }
  }, [config]);

  const handleStageChange = (idx) => {
    soundFX.playButtonTap();
    setCurStage(Math.max(0, Math.min(4, idx)));
  };

  const handleSaveConfig = async (newConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('grad-config', JSON.stringify(newConfig));
    } catch (e) {}

    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
    } catch (err) {
      console.warn('Saved locally, API sync note:', err);
    }
  };

  const handleResetConfig = async () => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem('grad-config');
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(DEFAULT_CONFIG)
      });
    } catch (err) {
      console.warn('Reset locally, API sync note:', err);
    }
  };

  const handleSendWish = async (wish) => {
    const fallbackWish = {
      id: 'wish-' + Date.now(),
      name: wish.name || 'Bạn ẩn danh',
      text: wish.text,
      createdAt: Date.now()
    };

    // Update state & localStorage first for instant responsiveness
    setWishes(prev => {
      const updated = [fallbackWish, ...prev];
      try {
        localStorage.setItem('grad-wishes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wish)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.wish) {
          setWishes(prev => {
            const replaced = prev.map(w => w.id === fallbackWish.id ? data.wish : w);
            try {
              localStorage.setItem('grad-wishes', JSON.stringify(replaced));
            } catch (e) {}
            return replaced;
          });
        }
      }
    } catch (err) {
      console.warn('Wish saved locally, API sync note:', err);
    }
  };

  const handleDeleteWish = async (id) => {
    setWishes(prev => {
      const updated = prev.filter(w => w.id !== id);
      try {
        localStorage.setItem('grad-wishes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      await fetch(`/api/wishes?id=${id}`, {
        method: 'DELETE'
      });
      await fetch(`/api/wishes/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Deleted locally, API sync note:', err);
    }
  };

  const handleUploadPhoto = async (file) => {
    // 1. Try server API upload
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const result = await res.json();
        if (result.url) {
          const updatedConfig = {
            ...config,
            stage0: {
              ...config.stage0,
              photoUrl: result.url
            }
          };
          handleSaveConfig(updatedConfig);
          return;
        }
      }
    } catch (err) {
      console.warn('API upload fallback to local FileReader:', err);
    }

    // 2. Client-side FileReader fallback
    const reader = new FileReader();
    reader.onload = () => {
      const updatedConfig = {
        ...config,
        stage0: {
          ...config.stage0,
          photoUrl: reader.result
        }
      };
      handleSaveConfig(updatedConfig);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Background with landmarks & cute animations */}
      <BackgroundDecorations customBgUrl={config.general?.customBgUrl} />

      {/* Floating Edit Mode Button */}
      <button
        className="floating-admin-btn"
        onClick={() => {
          soundFX.playButtonTap();
          setIsEditModalOpen(true);
        }}
        title="Chỉnh sửa nội dung, ảnh bìa, nhạc nền..."
      >
        <Settings size={16} /> Chỉnh sửa
      </button>

      {/* Top Dot Navigation */}
      <nav id="nav">
        {[0, 1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className={`dot ${curStage === idx ? 'on' : ''}`}
            onClick={() => handleStageChange(idx)}
            title={`Giai đoạn ${idx + 1}`}
          />
        ))}
      </nav>

      {/* Top Right Music Player */}
      <MusicPlayer audioConfig={config.audio} />

      {/* Stage 0: Ảnh bìa */}
      <section className={`stage ${curStage === 0 ? 'on' : ''}`}>
        <StagePhoto
          stageData={config.stage0}
          generalData={config.general}
          onNext={() => handleStageChange(1)}
          onUploadPhoto={handleUploadPhoto}
        />
      </section>

      {/* Stage 1: Lời cảm ơn */}
      <section className={`stage ${curStage === 1 ? 'on' : ''}`}>
        <StageThanks
          stageData={config.stage1}
          onPrev={() => handleStageChange(0)}
          onNext={() => handleStageChange(2)}
        />
      </section>

      {/* Stage 2: Thư mời */}
      <section className={`stage ${curStage === 2 ? 'on' : ''}`}>
        <StageInvite
          stageData={config.stage2}
          onPrev={() => handleStageChange(1)}
          onNext={() => handleStageChange(3)}
        />
      </section>

      {/* Stage 3: Lời chúc */}
      <section className={`stage ${curStage === 3 ? 'on' : ''}`}>
        <StageWishes
          stageData={config.stage3}
          wishes={wishes}
          isEditMode={true}
          onSendWish={handleSendWish}
          onDeleteWish={handleDeleteWish}
          onPrev={() => handleStageChange(2)}
          onNext={() => handleStageChange(4)}
        />
      </section>

      {/* Stage 4: Thư tâm sự */}
      <section className={`stage ${curStage === 4 ? 'on' : ''}`}>
        <StageLetter onPrev={() => handleStageChange(3)} />
      </section>

      {/* Live Customizer Modal */}
      <EditModal
        config={config}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveConfig}
        onReset={handleResetConfig}
      />
    </div>
  );
}
