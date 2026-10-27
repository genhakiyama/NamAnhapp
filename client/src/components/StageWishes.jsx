import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, Trash2, Heart } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function StageWishes({
  stageData,
  wishes,
  isEditMode,
  onSendWish,
  onDeleteWish,
  onPrev,
  onNext
}) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = stageData?.title || 'Lời chúc từ bạn';
  const subtitle = stageData?.subtitle || 'Để lại vài dòng chúc mừng cho Bonbon nhé!';
  const namePlaceholder = stageData?.namePlaceholder || 'Tên của bạn';
  const messagePlaceholder = stageData?.messagePlaceholder || 'Lời chúc của bạn…';
  const sendButtonText = stageData?.sendButtonText || 'Gửi lời chúc 💌';

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    soundFX.playChord();
    setLoading(true);

    try {
      await onSendWish({ name: name.trim(), text: text.trim() });
      setText('');
      setSentSuccess(true);
      soundFX.playSuccess();

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e8619a', '#ffd700', '#fbd0df', '#d6407f']
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

  const handlePrev = () => {
    soundFX.playButtonTap();
    onPrev();
  };

  return (
    <div className="card stage-card">
      <h2 className="stage-heading">{title}</h2>
      <p style={{ fontSize: '14px', margin: '0 0 14px', opacity: 0.85 }}>
        {subtitle}
      </p>

      <form onSubmit={handleSend} style={{ width: '100%', textAlign: 'left' }}>
        <input
          id="wn"
          type="text"
          maxLength={40}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={namePlaceholder}
        />
        <textarea
          id="wt"
          rows={3}
          maxLength={400}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={messagePlaceholder}
        />
        <button
          type="submit"
          id="send"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '6px' }}
          disabled={loading || !text.trim()}
        >
          {sentSuccess ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Heart size={18} fill="#fff" /> Cảm ơn bạn! 💖
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Send size={16} /> {sendButtonText}
            </span>
          )}
        </button>
      </form>

      {/* Wishes stream */}
      <div id="list" className="wishes-list">
        {wishes && wishes.length > 0 ? (
          wishes.map((w) => (
            <div key={w.id} className="w">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <b>{w.name || 'Bạn ẩn danh'}</b>
                {isEditMode && onDeleteWish && (
                  <button
                    className="delete-wish-btn"
                    onClick={() => {
                      soundFX.playButtonTap();
                      if (confirm(`Xóa lời chúc từ "${w.name || 'Bạn ẩn danh'}"?`)) {
                        onDeleteWish(w.id);
                      }
                    }}
                    title="Xóa lời chúc này"
                  >
                    <Trash2 size={14} color="#e53e3e" />
                  </button>
                )}
              </div>
              <span> — {w.text}</span>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', margin: '14px 0' }}>
            Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc nhé! ✨
          </p>
        )}
      </div>

      <div className="arrows">
        <button className="btn btn-secondary" onClick={handlePrev} title="Quay lại">
          ‹
        </button>
        {onNext && (
          <button className="btn btn-primary" onClick={() => { soundFX.playChord(); onNext(); }}>
            Tiếp ›
          </button>
        )}
      </div>
    </div>
  );
}
