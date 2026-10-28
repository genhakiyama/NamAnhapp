import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'WZ-yPu55BSo'; // A Whole New World Live (LAYERS CLASSIC)

export default function MusicPlayer({ curStage }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef(null);
  const shouldPlayRef = useRef(false);

  // Load YouTube IFrame Player API script
  useEffect(() => {
    // 1. Kiểm tra xem script đã có chưa
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        try {
          playerRef.current = new window.YT.Player('yt-bg-player', {
            height: '10',
            width: '10',
            videoId: YOUTUBE_VIDEO_ID,
            playerVars: {
              autoplay: 0,
              controls: 0,
              loop: 1,
              playlist: YOUTUBE_VIDEO_ID,
              playsinline: 1,
              modestbranding: 1
            },
            events: {
              onReady: (event) => {
                setIsReady(true);
                // Nếu người dùng đã chuyển sang trang 2 trước khi player sẵn sàng
                if (shouldPlayRef.current) {
                  try {
                    event.target.playVideo();
                    setIsPlaying(true);
                  } catch (e) {}
                }
              },
              onStateChange: (event) => {
                if (window.YT && window.YT.PlayerState) {
                  if (event.data === window.YT.PlayerState.PLAYING) {
                    setIsPlaying(true);
                    window.dispatchEvent(new CustomEvent('app:music-status', { detail: { isPlaying: true } }));
                  } else if (
                    event.data === window.YT.PlayerState.PAUSED ||
                    event.data === window.YT.PlayerState.ENDED
                  ) {
                    setIsPlaying(false);
                    window.dispatchEvent(new CustomEvent('app:music-status', { detail: { isPlaying: false } }));
                  }
                }
              }
            }
          });
        } catch (e) {
          console.warn('Error initializing YT Player:', e);
        }
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      // Dọn dẹp
    };
  }, []);

  // Tự động phát nhạc khi đi từ trang 2 trở về sau (curStage >= 1)
  useEffect(() => {
    if (curStage >= 1) {
      shouldPlayRef.current = true;
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        try {
          playerRef.current.playVideo();
          setIsPlaying(true);
        } catch (err) {
          console.warn('Cannot autoplay YT video:', err);
        }
      }
    }
  }, [curStage]);

  // Phát sự kiện trạng thái nhạc cho các component khác (như Mini Player ở Trang 3)
  const broadcastStatus = (playing) => {
    window.dispatchEvent(
      new CustomEvent('app:music-status', {
        detail: { isPlaying: playing }
      })
    );
  };

  // Lắng nghe sự kiện từ Mini Player trên Trang 3
  useEffect(() => {
    const handleToggle = () => togglePlay();
    const handlePlay = () => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
        setIsPlaying(true);
        broadcastStatus(true);
      }
    };
    const handlePause = () => {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        broadcastStatus(false);
      }
    };
    const handleSeek = (e) => {
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        const delta = e.detail || 0;
        const cur = playerRef.current.getCurrentTime ? playerRef.current.getCurrentTime() : 0;
        playerRef.current.seekTo(Math.max(0, cur + delta), true);
      }
    };

    window.addEventListener('app:music-toggle', handleToggle);
    window.addEventListener('app:music-play', handlePlay);
    window.addEventListener('app:music-pause', handlePause);
    window.addEventListener('app:music-seek', handleSeek);

    return () => {
      window.removeEventListener('app:music-toggle', handleToggle);
      window.removeEventListener('app:music-play', handlePlay);
      window.removeEventListener('app:music-pause', handlePause);
      window.removeEventListener('app:music-seek', handleSeek);
    };
  }, [isPlaying]);

  // Bấm nút bật/tắt nhạc
  const togglePlay = () => {
    if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') {
      return;
    }

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        broadcastStatus(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
        broadcastStatus(true);
      }
    } catch (e) {
      console.warn('Toggle play error:', e);
    }
  };

  return (
    <>
      {/* Container ẩn của YouTube Player */}
      <div
        style={{
          position: 'fixed',
          bottom: '-120px',
          right: '-120px',
          width: '10px',
          height: '10px',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -9999
        }}
      >
        <div id="yt-bg-player" />
      </div>

      {/* Nút điều khiển âm nhạc góc phải trên cùng */}
      <button
        id="mus"
        className="music-toggle-btn"
        onClick={togglePlay}
        title={isPlaying ? 'Tạm dừng nhạc (A Whole New World)' : 'Phát nhạc nền'}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 100,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '1px solid rgba(226, 105, 40, 0.4)',
          background: isPlaying ? 'linear-gradient(135deg, #e87738, #d85f24)' : 'rgba(255, 255, 255, 0.85)',
          color: isPlaying ? '#ffffff' : '#e26928',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isPlaying
            ? '0 6px 18px rgba(226, 105, 40, 0.45)'
            : '0 4px 14px rgba(40, 20, 30, 0.12)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {isPlaying ? (
          <Volume2 size={20} className="pulse-icon" />
        ) : (
          <Music size={19} />
        )}
      </button>
    </>
  );
}
