import React, { useState, useEffect, useRef } from 'react';

const LETTER_TEXT = `Cuối cùng thì giờ vàng đã điểm, ngày Bonbon tốt nghiệp đang đến gần rồi nên nhân cơ hội này mình muốn tâm sự đôi lời. Trong suốt 4 năm qua, từng người mình gặp, từng sự kiện trải qua đều để lại trong mình những dấu ấn riêng thật đặc biệt. 

Đầu tiên, mình muốn gửi lời cảm ơn đến AIESEC. Là những ngày tháng miệt mài chạy số, nhảy AIESEC dance, đón EPs, giải quyết một đống bùi nhùi cùng nhau. Sau khi rời AIESEC, mình phải chữa lành một thời gian dài, nhưng tuyệt nhiên khi nhớ lại quãng thời gian gắn bó với mọi người ở đó thì luôn là những kỷ niệm đẹp và cảm ơn vì đã dạy Bon lớn.  

Tiếp theo chắc chắn là ngôi nhà thứ 2 của mình - Khoa Ngữ Văn Đức. Ôi trời ơi, làm sao người ta có thể hiểu được nỗi khổ của sinh viên khoa Đức về việc ra trường đúng hạn nhỉ??? Là những giờ học C1 kinh khủng, khóc lên khóc xuống cùng mấy đứa bạn cùng bàn, thuyết trình rồi dự án liên tục. Huhu! Sau khi rời khoa, mình lại phải chữa lành một thời gian. Nhưng khi ngồi viết ra những dòng này lại tự thấy mình thật may mắn vì được vào khoa Đức. Bởi làm sao tìm được những người thầy giáo, cô giáo tâm huyết với sinh viên như ở khoa Đức và cũng không thể tìm được những đứa bạn “Hội bàn vuông” và tập thể K22. 

Và cuối cùng là lời cảm ơn, biết ơn sâu sắc đến gia đình, là hậu phương vững chắc giúp con luôn tự tin làm những điều mình muốn. Yêu mẹ iu và ba ba và cả đại gia đình mình nữa. 

Bon muốn viết nhiều lắm, nhưng văn đã dài rùi nên hẹn cả nhà đến chung vui cùng Bon trong lễ tốt nghiệp để mình tái ngộ và tâm sự thêm nhé! 

Trân trọng,
Nam Anh - Bonbon ♡`;

// Kích thước chuẩn tỷ lệ cố định của Trang 2 (Bức thư to hơn, giữ nguyên tỷ lệ trên mọi thiết bị & khi thu phóng)
const DESIGN_WIDTH = 640;
const DESIGN_HEIGHT = 820;

export default function StageLetter({ onPrev, onNext }) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Dành khoảng đệm an toàn cho thanh nav-dots phía trên và viền 2 bên
      const availW = vw - 24;
      const availH = vh - 72;
      const scaleW = availW / DESIGN_WIDTH;
      const scaleH = availH / DESIGN_HEIGHT;
      // Giữ nguyên tỉ lệ khung hình chuẩn xác khi phóng to / thu nhỏ hoặc đổi thiết bị
      const nextScale = Math.max(0.32, Math.min(scaleW, scaleH, 1.35));
      setScale(nextScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateScale);
    }
    return () => {
      window.removeEventListener('resize', updateScale);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateScale);
      }
    };
  }, []);

  const handlePrev = () => {
    onPrev();
  };

  const handleNext = () => {
    if (onNext) onNext();
  };

  return (
    <div className="letter-stage-viewport" ref={wrapperRef}>
      <div
        className="letter-fixed-ratio-scaler"
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          transform: `scale(${scale})`
        }}
      >
        <div className="card-van-gogh card-letter-page" id="letterCard">
          {/* Hoa văn đỉnh */}
          <img
            src="/ornament.png"
            alt="Hoa văn trang trí"
            className="sticker-ornament"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          <h2 className="letter-title">Tâm sự của Bonbon 💌</h2>

          {/* Nội dung tâm sự - Tỷ lệ bức thư lớn hơn, rõ ràng và giữ nguyên bố cục */}
          <div className="letter-body">
            {LETTER_TEXT}
          </div>

          {/* Ảnh cún cưng kỷ niệm */}
          <div className="letter-photo-box">
            <img
              src="/anconcho.jpg"
              alt="Kỷ niệm tốt nghiệp"
              className="letter-photo-img"
              onError={(e) => {
                e.currentTarget.src = '/anconcho2.jpg';
              }}
            />
          </div>

          {/* Nút quay lại và nút sang trang Thư mời */}
          <div className="letter-arrows">
            <button className="btn-back-card" onClick={handlePrev} title="Quay lại trang bìa">
              ‹ Xem lại bìa
            </button>
            <button className="btn-open-card btn-next-invite" onClick={handleNext} title="Xem thư mời tốt nghiệp">
              Xem thư mời 💌 ›
            </button>
          </div>

          {/* Sticker góc dưới */}
          <img
            src="/graduation-cap.png"
            alt="Mũ cử nhân"
            className="sticker-vg sticker-cap-vg sticker-small"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          <img
            src="/notebook.png"
            alt="Quyển sổ"
            className="sticker-vg sticker-notebook-vg sticker-small"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>
    </div>
  );
}
