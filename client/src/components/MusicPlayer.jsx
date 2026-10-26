import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function MusicPlayer({ audioConfig, onUserInteract }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const userInteractedRef = useRef(false);

  const musicUrl = audioConfig?.musicUrl || '';
  const playOnAnyButtonClick = audioConfig?.playOnAnyButtonClick ?? true;
  const buttonSoundEffect = audioConfig?.buttonSoundEffect ?? true;
  const musicVolume = audioConfig?.musicVolume ?? 0.7;
  const soundVolume = audioConfig?.soundVolume ?? 0.5;

  useEffect(() => {
    soundFX.setEnabled(buttonSoundEffect);
    soundFX.setVolume(soundVolume);
  }, [buttonSoundEffect, soundVolume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  const togglePlay = () => {
    soundFX.playButtonTap();
    if (!audioRef.current || !musicUrl) {
      alert('Chưa có liên kết nhạc. Vui lòng thêm link hoặc upload file MP3 trong phần Chỉnh sửa ⚙️');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn('Autoplay prevented:', err);
        });
    }
  };

  // Handle global button clicks if playOnAnyButtonClick is enabled
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Find if clicked element is a button or interactive
      const target = e.target.closest('button, .btn, .dot, #env, .clickable');
      if (target) {
        if (playOnAnyButtonClick && musicUrl && !isPlaying && !userInteractedRef.current) {
          userInteractedRef.current = true;
          if (audioRef.current) {
            audioRef.current.play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          }
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [playOnAnyButtonClick, musicUrl, isPlaying]);

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
      />
      <button
        id="mus"
        className="music-toggle-btn"
        onClick={togglePlay}
        title={isPlaying ? "Tạm dừng nhạc" : "Bật nhạc nền"}
        style={{
          position: 'fixed',
          top: 'calc(10px + env(safe-area-inset-top, 0px))',
          right: '12px',
          zIndex: 100,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          background: isPlaying ? 'rgba(232, 97, 154, 0.9)' : 'rgba(255, 255, 255, 0.85)',
          color: isPlaying ? '#fff' : '#c2377a',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(120, 30, 80, 0.25)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease'
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
