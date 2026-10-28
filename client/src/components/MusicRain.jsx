import React, { useMemo } from 'react';

// Cơn mưa nốt nhạc rơi liên tục từ trên xuống dưới
// Sử dụng các nốt nhạc màu cam đào, hồng pastel như hình vẽ của người dùng
const NOTE_SYMBOLS = ['♪', '♫', '♬', '♩', 'svg-single', 'svg-double'];

const NOTE_COLORS = [
  '#f97316', // Cam ấm
  '#fb7185', // Hồng đào
  '#f59e0b', // Vàng hổ phách
  '#fb923c', // Cam san hô
  '#f43f5e', // Hồng thắm
  '#e26928', // Cam Van Gogh
  '#ec4899', // Hồng phấn
  '#fca311'  // Vàng cam
];

export default function MusicRain({ count = 28 }) {
  // Tạo mảng nốt nhạc ngẫu nhiên với vị trí và thời gian rơi khác nhau
  const notes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const type = NOTE_SYMBOLS[i % NOTE_SYMBOLS.length];
      const color = NOTE_COLORS[i % NOTE_COLORS.length];
      const left = Math.round((i / count) * 96 + (Math.random() * 4 - 2)); // phân bố đều từ 2% - 98%
      const duration = (4.5 + (i % 5) * 0.8 + Math.random() * 1.5).toFixed(2); // 4.5s - 9.5s
      const delay = (-Math.random() * 9).toFixed(2); // delay âm để nốt nhạc đã rơi sẵn khi load trang
      const size = Math.round(18 + (i % 4) * 5 + Math.random() * 4); // 18px - 38px
      const opacity = (0.45 + (i % 3) * 0.15 + Math.random() * 0.15).toFixed(2);
      const swayOffset = ((i % 2 === 0 ? 1 : -1) * (10 + Math.random() * 15)).toFixed(1);

      return {
        id: i,
        type,
        color,
        left: Math.max(2, Math.min(96, left)),
        duration: `${duration}s`,
        delay: `${delay}s`,
        size: `${size}px`,
        opacity,
        swayOffset: `${swayOffset}px`
      };
    });
  }, [count]);

  return (
    <div className="music-rain-container" aria-hidden="true">
      {notes.map((note) => (
        <span
          key={note.id}
          className="falling-note"
          style={{
            left: `${note.left}%`,
            animationDuration: note.duration,
            animationDelay: note.delay,
            fontSize: note.size,
            color: note.color,
            opacity: note.opacity,
            '--sway-offset': note.swayOffset
          }}
        >
          {note.type === 'svg-single' ? (
            <svg
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              fill="currentColor"
              style={{ filter: 'drop-shadow(0 2px 6px rgba(226, 105, 40, 0.35))' }}
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          ) : note.type === 'svg-double' ? (
            <svg
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              fill="currentColor"
              style={{ filter: 'drop-shadow(0 2px 6px rgba(244, 63, 94, 0.35))' }}
            >
              <path d="M19 3H9v11.18A3.001 3.001 0 0 0 7 13c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V7h7v7.18A3.001 3.001 0 0 0 15 13c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V3z" />
            </svg>
          ) : (
            <span style={{ filter: 'drop-shadow(0 2px 6px rgba(226, 105, 40, 0.35))' }}>
              {note.type}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
