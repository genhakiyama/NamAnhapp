import React, { useState, useRef } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Upload,
  Music,
  Image as ImageIcon,
  Sparkles,
  Palette,
  FileText,
  Mail,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function EditModal({
  config,
  isOpen,
  onClose,
  onSave,
  onReset
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(config)));
  const [uploading, setUploading] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const photoFileRef = useRef(null);
  const musicFileRef = useRef(null);
  const bgFileRef = useRef(null);

  if (!isOpen) return null;

  const handleTextChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleParagraphChange = (index, value) => {
    setFormData(prev => {
      const newParagraphs = [...(prev.stage1?.paragraphs || [])];
      newParagraphs[index] = value;
      return {
        ...prev,
        stage1: {
          ...prev.stage1,
          paragraphs: newParagraphs
        }
      };
    });
  };

  const handleAddParagraph = () => {
    soundFX.playButtonTap();
    setFormData(prev => ({
      ...prev,
      stage1: {
        ...prev.stage1,
        paragraphs: [...(prev.stage1?.paragraphs || []), 'Đoạn văn lời cảm ơn mới...']
      }
    }));
  };

  const handleRemoveParagraph = (index) => {
    soundFX.playButtonTap();
    setFormData(prev => ({
      ...prev,
      stage1: {
        ...prev.stage1,
        paragraphs: prev.stage1.paragraphs.filter((_, i) => i !== index)
      }
    }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    soundFX.playButtonTap();

    // Try server/Cloudflare API upload first
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        const result = await res.json();
        if (result.url) {
          if (type === 'photo') handleTextChange('stage0', 'photoUrl', result.url);
          else if (type === 'music') handleTextChange('audio', 'musicUrl', result.url);
          else if (type === 'bg') handleTextChange('general', 'customBgUrl', result.url);
          setUploading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API upload fallback to local FileReader:', err);
    }

    // Client-side FileReader fallback (works everywhere without backend)
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (type === 'photo') handleTextChange('stage0', 'photoUrl', dataUrl);
      else if (type === 'music') handleTextChange('audio', 'musicUrl', dataUrl);
      else if (type === 'bg') handleTextChange('general', 'customBgUrl', dataUrl);
      setUploading(false);
    };
    reader.onerror = () => {
      setUploading(false);
      alert('Không thể đọc tệp. Vui lòng thử lại!');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    soundFX.playSuccess();
    await onSave(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#e8619a" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#5a2547' }}>
              Chỉnh sửa nội dung & giao diện
            </h3>
          </div>
          <button className="icon-btn" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => { soundFX.playButtonTap(); setActiveTab('general'); }}
          >
            <ImageIcon size={15} /> Ảnh & Bìa
          </button>
          <button
            className={`tab-btn ${activeTab === 'thanks' ? 'active' : ''}`}
            onClick={() => { soundFX.playButtonTap(); setActiveTab('thanks'); }}
          >
            <FileText size={15} /> Lời cảm ơn
          </button>
          <button
            className={`tab-btn ${activeTab === 'invite' ? 'active' : ''}`}
            onClick={() => { soundFX.playButtonTap(); setActiveTab('invite'); }}
          >
            <Mail size={15} /> Thư mời
          </button>
          <button
            className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => { soundFX.playButtonTap(); setActiveTab('audio'); }}
          >
            <Music size={15} /> Nhạc & Nút
          </button>
          <button
            className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => { soundFX.playButtonTap(); setActiveTab('theme'); }}
          >
            <Palette size={15} /> Màu sắc
          </button>
        </div>

        {/* Tab Contents */}
        <div className="modal-body">
          {/* TAB 1: General & Stage 0 */}
          {activeTab === 'general' && (
            <div className="form-group-list">
              <div className="form-item">
                <label>Tên người tốt nghiệp:</label>
                <input
                  type="text"
                  value={formData.general?.graduateName || ''}
                  onChange={(e) => handleTextChange('general', 'graduateName', e.target.value)}
                  placeholder="VD: Bonbon"
                />
              </div>

              <div className="form-item">
                <label>Ngành học & Trường:</label>
                <input
                  type="text"
                  value={formData.general?.fieldAndSchool || ''}
                  onChange={(e) => handleTextChange('general', 'fieldAndSchool', e.target.value)}
                  placeholder="VD: Germanistik · USSH TP.HCM"
                />
              </div>

              <div className="form-item">
                <label>Tiêu đề trang:</label>
                <input
                  type="text"
                  value={formData.stage0?.badgeText || ''}
                  onChange={(e) => handleTextChange('stage0', 'badgeText', e.target.value)}
                  placeholder="VD: Chúc mừng tốt nghiệp!"
                />
              </div>

              <div className="form-item">
                <label>Lời tựa mở đầu:</label>
                <textarea
                  rows={2}
                  value={formData.stage0?.heroTagline || ''}
                  onChange={(e) => handleTextChange('stage0', 'heroTagline', e.target.value)}
                  placeholder="VD: Bốn năm với tiếng Đức — cảm ơn vì đã ghé thăm ngày đặc biệt này 🎓"
                />
              </div>

              <div className="form-item">
                <label>Ảnh đại diện / Ảnh cử nhân:</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={formData.stage0?.photoUrl || ''}
                    onChange={(e) => handleTextChange('stage0', 'photoUrl', e.target.value)}
                    placeholder="Dán link ảnh (URL) hoặc tải từ máy"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => photoFileRef.current?.click()}
                    disabled={uploading}
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                  >
                    <Upload size={14} /> {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
                  </button>
                  <input
                    type="file"
                    ref={photoFileRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, 'photo')}
                  />
                </div>
                {formData.stage0?.photoUrl && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={formData.stage0.photoUrl}
                      alt="Preview"
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="text-btn danger"
                      onClick={() => handleTextChange('stage0', 'photoUrl', '')}
                    >
                      Xóa ảnh
                    </button>
                  </div>
                )}
              </div>

              <div className="form-item">
                <label>Chữ trên nút bắt đầu:</label>
                <input
                  type="text"
                  value={formData.stage0?.buttonText || ''}
                  onChange={(e) => handleTextChange('stage0', 'buttonText', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Thanks */}
          {activeTab === 'thanks' && (
            <div className="form-group-list">
              <div className="form-item">
                <label>Tiêu đề:</label>
                <input
                  type="text"
                  value={formData.stage1?.title || ''}
                  onChange={(e) => handleTextChange('stage1', 'title', e.target.value)}
                />
              </div>

              <div className="form-item">
                <label>Các đoạn văn lời cảm ơn:</label>
                {(formData.stage1?.paragraphs || []).map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => handleParagraphChange(idx, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="icon-btn danger"
                      onClick={() => handleRemoveParagraph(idx)}
                      title="Xóa đoạn này"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddParagraph}
                  style={{ fontSize: '13px', padding: '6px 12px' }}
                >
                  <Plus size={14} /> Thêm đoạn văn
                </button>
              </div>

              <div className="form-item">
                <label>Chữ ký / Lời kết:</label>
                <input
                  type="text"
                  value={formData.stage1?.signature || ''}
                  onChange={(e) => handleTextChange('stage1', 'signature', e.target.value)}
                />
              </div>

              <div className="form-item">
                <label>Chữ trên nút tiếp:</label>
                <input
                  type="text"
                  value={formData.stage1?.nextButtonText || ''}
                  onChange={(e) => handleTextChange('stage1', 'nextButtonText', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 3: Invite */}
          {activeTab === 'invite' && (
            <div className="form-group-list">
              <div className="form-item">
                <label>Tiêu đề thư mời:</label>
                <input
                  type="text"
                  value={formData.stage2?.title || ''}
                  onChange={(e) => handleTextChange('stage2', 'title', e.target.value)}
                />
              </div>

              <div className="form-item">
                <label>Gợi ý trước khi mở thư:</label>
                <input
                  type="text"
                  value={formData.stage2?.hintText || ''}
                  onChange={(e) => handleTextChange('stage2', 'hintText', e.target.value)}
                />
              </div>

              <div className="form-item">
                <label>Lời mời trân trọng:</label>
                <input
                  type="text"
                  value={formData.stage2?.invitationHeading || ''}
                  onChange={(e) => handleTextChange('stage2', 'invitationHeading', e.target.value)}
                />
              </div>

              <div className="form-item">
                <label>Thời gian:</label>
                <input
                  type="text"
                  value={formData.stage2?.time || ''}
                  onChange={(e) => handleTextChange('stage2', 'time', e.target.value)}
                  placeholder="VD: 08:30 · Thứ Bảy, 15/11/2026"
                />
              </div>

              <div className="form-item">
                <label>Địa điểm:</label>
                <input
                  type="text"
                  value={formData.stage2?.place || ''}
                  onChange={(e) => handleTextChange('stage2', 'place', e.target.value)}
                  placeholder="VD: Hội trường A · ĐH KHXH&NV"
                />
              </div>

              <div className="form-item">
                <label>Gợi ý trang phục (Dress code):</label>
                <input
                  type="text"
                  value={formData.stage2?.dressCode || ''}
                  onChange={(e) => handleTextChange('stage2', 'dressCode', e.target.value)}
                  placeholder="VD: Tone Pastel / Tự do lịch sự"
                />
              </div>

              <div className="form-item">
                <label>Thông điệp kết thư:</label>
                <textarea
                  rows={2}
                  value={formData.stage2?.closingMessage || ''}
                  onChange={(e) => handleTextChange('stage2', 'closingMessage', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 4: Audio & Buttons */}
          {activeTab === 'audio' && (
            <div className="form-group-list">
              <div className="form-item">
                <label>File nhạc nền (.mp3 URL hoặc tải lên):</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={formData.audio?.musicUrl || ''}
                    onChange={(e) => handleTextChange('audio', 'musicUrl', e.target.value)}
                    placeholder="https://...link file nhạc .mp3"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => musicFileRef.current?.click()}
                    disabled={uploading}
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                  >
                    <Upload size={14} /> Tải file nhạc
                  </button>
                  <input
                    type="file"
                    ref={musicFileRef}
                    accept="audio/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, 'music')}
                  />
                </div>
                <small style={{ color: '#777', marginTop: '4px', display: 'block' }}>
                  Hỗ trợ định dạng mp3, wav, ogg, m4a. Nhạc nền phát lặp êm dịu.
                </small>
              </div>

              <div className="form-item-checkbox">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.audio?.playOnAnyButtonClick ?? true}
                    onChange={(e) => handleTextChange('audio', 'playOnAnyButtonClick', e.target.checked)}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <span><b>Tự động phát nhạc khi bấm các nút</b> (Tối ưu trải nghiệm cho khách mời)</span>
                </label>
              </div>

              <div className="form-item-checkbox">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.audio?.buttonSoundEffect ?? true}
                    onChange={(e) => handleTextChange('audio', 'buttonSoundEffect', e.target.checked)}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <span><b>Hiệu ứng âm thanh nút bấm</b> (Tiếng chuông nhẹ nhàng, mở phong thư, pháo chúc mừng)</span>
                </label>
              </div>

              <div className="form-item">
                <label>Âm lượng nhạc nền: {Math.round((formData.audio?.musicVolume ?? 0.7) * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.audio?.musicVolume ?? 0.7}
                  onChange={(e) => handleTextChange('audio', 'musicVolume', parseFloat(e.target.value))}
                />
              </div>

              <div className="form-item">
                <label>Âm lượng hiệu ứng âm thanh: {Math.round((formData.audio?.soundVolume ?? 0.5) * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.audio?.soundVolume ?? 0.5}
                  onChange={(e) => handleTextChange('audio', 'soundVolume', parseFloat(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* TAB 5: Theme & Colors */}
          {activeTab === 'theme' && (
            <div className="form-group-list">
              <div className="form-item">
                <label>Màu chủ đạo:</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.general?.themeColor || '#e8619a'}
                    onChange={(e) => handleTextChange('general', 'themeColor', e.target.value)}
                    style={{ width: '45px', height: '40px', padding: 0, borderRadius: '8px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={formData.general?.themeColor || '#e8619a'}
                    onChange={(e) => handleTextChange('general', 'themeColor', e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="form-item">
                <label>Màu nền thẻ thiệp (Card Background):</label>
                <input
                  type="text"
                  value={formData.general?.cardBgColor || 'rgba(255, 248, 243, 0.93)'}
                  onChange={(e) => handleTextChange('general', 'cardBgColor', e.target.value)}
                  placeholder="rgba(255, 248, 243, 0.93)"
                />
              </div>

              <div className="form-item">
                <label>Màu chữ chính:</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.general?.textColor || '#5a2547'}
                    onChange={(e) => handleTextChange('general', 'textColor', e.target.value)}
                    style={{ width: '45px', height: '40px', padding: 0, borderRadius: '8px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={formData.general?.textColor || '#5a2547'}
                    onChange={(e) => handleTextChange('general', 'textColor', e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="form-item">
                <label>Hình nền trang web (Tùy chỉnh):</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={formData.general?.customBgUrl || ''}
                    onChange={(e) => handleTextChange('general', 'customBgUrl', e.target.value)}
                    placeholder="Để trống sẽ dùng nền tranh vẽ mặc định"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => bgFileRef.current?.click()}
                    disabled={uploading}
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                  >
                    <Upload size={14} /> Tải ảnh nền
                  </button>
                  <input
                    type="file"
                    ref={bgFileRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, 'bg')}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (confirm('Khôi phục toàn bộ nội dung về mặc định ban đầu?')) {
                onReset();
              }
            }}
            style={{ marginRight: 'auto' }}
          >
            <RotateCcw size={15} /> Khôi phục gốc
          </button>

          {savedToast && (
            <span style={{ color: '#2b8a3e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
              <CheckCircle2 size={16} /> Đã lưu thành công!
            </span>
          )}

          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> Lưu thay đổi 💾
          </button>
        </div>
      </div>
    </div>
  );
}
