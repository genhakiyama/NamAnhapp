import React from 'react';
import { soundFX } from '../utils/soundEffects';

const LETTER_TEXT = `Cuối cùng thì giờ vàng đã điểm, ngày Bonbon tốt nghiệp đang đến gần rồi nên nhân cơ hội này mình muốn tâm sự đôi lời. Trong suốt 4 năm qua, từng người mình gặp, từng sự kiện trải qua đều để lại trong mình những dấu ấn riêng thật đặc biệt. 

Đầu tiên, mình muốn gửi lời cảm ơn đến AIESEC,. Là những ngày tháng miệt mài chạy số, nhảy AIESEC dance, đón EPs, giải quyết một đống bùi nhùi cùng nhau. Sau khi rời AIESEC, mình phải chữa lành một thời gian dài, nhưng tuyệt nhiên khi nhớ lại quãng thời gian gắn bó với mọi người ở đó thì luôn là những kỷ niệm đẹp và cảm ơn vì đã dạy Bon lớn.  

Tiếp theo chắc chắn là ngôi nhà thứ 2 của mình - Khoa Ngữ Văn Đức. Ôi trời ơi, làm sao người ta có thể hiểu được nỗi khổ của sinh viên khoa Đức về việc ra trường đúng hạn nhỉ??? Là những giờ học C1 kinh khủng, khóc lên khóc xuống cùng mấy đứa bạn cùng bàn, thuyết trình rồi dự án liên tục. Huhu! Sau khi rời khoa, mình lại phải chữa lành một thời gian. Nhưng khi ngồi viết ra những dòng này lại tự thấy mình thật may mắn vì được vào khoa Đức. Bởi làm sao tìm được những người thầy giáo, cô giáo tâm huyết với sinh viên như ở khoa Đức và cũng không thể tìm được những đứa bạn “Hội bàn vuông” và tập thể K22. 

Và cuối cùng là lời cảm ơn, biết ơn sâu sắc đến gia đình, là hậu phương vững chắc giúp con luôn tự tin làm những điều mình muốn. Yêu mẹ iu và ba ba và cả đại gia đình mình nữa. 

Bon muốn viết nhiều lắm, nhưng văn đã dài rùi nên hẹn cả nhà đến chung vui cùng Bon trong lễ tốt nghiệp để mình tái ngộ và tâm sự thêm nhé! 
Trân trọng
Nam Anh - Bonbon.`;

export default function StageLetter({ onPrev }) {
  const handlePrev = () => {
    soundFX.playButtonTap();
    onPrev();
  };

  return (
    <div className="card stage-card" style={{ maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <h2 className="stage-heading">Tâm sự của Bonbon</h2>

      <div
        className="thanks-content"
        style={{
          whiteSpace: 'pre-wrap',
          textAlign: 'left',
          lineHeight: '1.9',
          fontSize: 'clamp(13px, 2.2vw, 15px)',
          padding: '4px 6px'
        }}
      >
        {LETTER_TEXT}
      </div>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
        <img
          src="/anconcho.jpg"
          alt="Ảnh con chó"
          style={{
            width: 'min(70%, 260px)',
            height: 'auto',
            borderRadius: '16px',
            boxShadow: '0 12px 30px rgba(90, 37, 71, 0.18)',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.currentTarget.src = '/anconcho2.jpg';
          }}
        />
      </div>

      <div style={{ marginTop: '26px', textAlign: 'center' }}>
        <a
          href="/index.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 18px',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #e8619a 0%, #c2377a 100%)',
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 10px 24px rgba(194, 55, 122, 0.22)'
          }}
          onClick={() => soundFX.playChord()}
        >
          Click vào đây để nhận thiệp ạ!!
        </a>
      </div>

      <div className="arrows" style={{ marginTop: '22px' }}>
        <button className="btn btn-secondary" onClick={handlePrev} title="Quay lại">
          ‹ Quay lại
        </button>
      </div>
    </div>
  );
}
