import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundEffects';

export default function StageInvite({
  stageData,
  onPrev,
  onNext
}) {
  const [isOpen, setIsOpen] = useState(false);

  const title = stageData?.title || 'Thư mời';
  const hintText = stageData?.hintText || 'Nhấn vào phong thư để mở nhé 💌';
  const invitationHeading = stageData?.invitationHeading || 'Bonbon trân trọng mời bạn đến chung vui lễ tốt nghiệp';
  const time = stageData?.time || '[Thời gian]';
  const place = stageData?.place || '[Địa điểm]';
  const dressCode = stageData?.dressCode || '[Gợi ý trang phục]';
  const closingMessage = stageData?.closingMessage || 'Sự hiện diện của bạn là món quà đẹp nhất. Auf Wiedersehen — và hẹn gặp bạn nhé! 🎓';
  const nextButtonText = stageData?.nextButtonText || 'Gửi lời chúc ›';

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    soundFX.playEnvelopeOpen();
    setIsOpen(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#fbd0df', '#e8619a', '#d6407f', '#ffffff']
    });
  };

  const handlePrev = () => {
    soundFX.playButtonTap();
    onPrev();
  };

  const handleNext = () => {
    soundFX.playChord();
    onNext();
  };

  return (
    <div className="card stage-card">
      <h2 className="stage-heading">{title}</h2>

      {!isOpen && <p id="hint">{hintText}</p>}

      {!isOpen ? (
        <div
          id="env"
          className="clickable"
          onClick={handleOpenEnvelope}
          title="Nhấn để mở phong bì thư"
        >
          <div className="back"></div>
          <div className="front"></div>
          <div className="flap"></div>
          <svg className="seal beat" viewBox="0 0 100 92">
            <path
              fill="url(#hg)"
              d="M50 88C20 66 3 48 3 28 3 13 14 3 28 3c9 0 18 5 22 13C54 8 63 3 72 3c14 0 25 10 25 25 0 20-17 38-47 60z"
            />
          </svg>
        </div>
      ) : (
        <div id="inv" className="show">
          <p style={{ textAlign: 'center', marginBottom: '14px' }}>
            <b>{invitationHeading}</b>
          </p>
          <div className="row">
            <b>Thời gian</b>
            <span id="iT">{time}</span>
          </div>
          <div className="row">
            <b>Địa điểm</b>
            <span id="iP">{place}</span>
          </div>
          <div className="row">
            <b>Dress code</b>
            <span id="iD">{dressCode}</span>
          </div>
          <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '14px' }}>
            {closingMessage}
          </p>
        </div>
      )}

      <div className="arrows">
        <button className="btn btn-secondary" onClick={handlePrev} title="Quay lại">
          ‹
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          {nextButtonText}
        </button>
      </div>
    </div>
  );
}
