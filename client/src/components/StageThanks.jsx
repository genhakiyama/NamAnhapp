import React from 'react';
import { soundFX } from '../utils/soundEffects';

export default function StageThanks({
  stageData,
  onPrev,
  onNext
}) {
  const title = stageData?.title || 'Lời cảm ơn';
  const paragraphs = stageData?.paragraphs || [];
  const signature = stageData?.signature || 'Vielen Dank! — Bonbon';
  const nextButtonText = stageData?.nextButtonText || 'Tiếp ›';

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

      <div className="thanks-content">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="thanks-p">
            {p}
          </p>
        ))}
      </div>

      <p className="signature-text">
        {signature}
      </p>

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
