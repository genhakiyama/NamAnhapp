import React, { useRef } from 'react';
import confetti from 'canvas-confetti';
import { Camera } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function StagePhoto({
  stageData,
  generalData,
  onNext,
  onUploadPhoto
}) {
  const fileInputRef = useRef(null);

  const photoUrl = stageData?.photoUrl || '';
  const badgeText = stageData?.badgeText || 'Chúc mừng tốt nghiệp!';
  const graduateName = generalData?.graduateName || 'Bonbon';
  const fieldAndSchool = generalData?.fieldAndSchool || 'Germanistik · USSH TP.HCM';
  const heroTagline = stageData?.heroTagline || 'Bốn năm với tiếng Đức — cảm ơn vì đã ghé thăm ngày đặc biệt này 🎓';
  const buttonText = stageData?.buttonText || 'Bắt đầu ♡';

  const handleStart = () => {
    soundFX.playChord();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e8619a', '#fbd0df', '#ffd700', '#c2377a', '#ffffff']
    });
    onNext();
  };

  const handlePhotoClick = () => {
    soundFX.playButtonTap();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && onUploadPhoto) {
      onUploadPhoto(file);
    }
  };

  return (
    <div className="card stage-card">
      <div
        id="photo"
        onClick={handlePhotoClick}
        title="Nhấn để đổi ảnh đại diện"
        style={{
          backgroundImage: photoUrl ? `url(${photoUrl})` : 'none',
          backgroundColor: photoUrl ? 'transparent' : '#ffe3ee',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {!photoUrl && (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <Camera size={34} color="#c2377a" style={{ margin: '0 auto 6px' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#5a2547' }}>
              Nhấn để thêm ảnh của bạn
            </span>
          </div>
        )}
        {photoUrl && (
          <div className="photo-overlay-hint">
            <Camera size={20} color="#fff" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <h1 className="stage-title">{badgeText}</h1>
      <p className="subtitle">
        <b>{graduateName}</b> · {fieldAndSchool}
      </p>
      <p className="tagline">{heroTagline}</p>

      <div className="arrows">
        <button className="btn btn-primary" onClick={handleStart}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
