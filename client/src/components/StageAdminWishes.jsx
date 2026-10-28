import React, { useState } from 'react';
import { Lock, User, KeyRound, Eye, EyeOff, Trash2, ArrowLeft, LogOut, Sparkles, BookHeart, Calendar } from 'lucide-react';

export default function StageAdminWishes({ wishes = [], onDeleteWish, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('bonbon_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'BonBon' && password === '1234567') {
      setIsAuthenticated(true);
      setError('');
      try {
        sessionStorage.setItem('bonbon_admin_auth', 'true');
      } catch (err) {}
    } else {
      setError('Tài khoản hoặc mật khẩu không chính xác! Chỉ có BonBon mới xem được nhé 🔒');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    try {
      sessionStorage.removeItem('bonbon_admin_auth');
    } catch (err) {}
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="admin-wishes-stage-wrapper">
      {!isAuthenticated ? (
        /* ========================================================
           MÀN HÌNH ĐĂNG NHẬP DÀNH RIÊNG CHO BONBON
           ======================================================== */
        <div className="card-van-gogh card-admin-login">
          <img
            src="/ornament.png"
            alt="Hoa văn trang trí"
            className="sticker-ornament"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          <div className="admin-lock-badge">
            <Lock size={28} />
          </div>

          <h2 className="admin-login-title">Hộp thư bí mật của BonBon 💌</h2>
          <p className="admin-login-subtitle">
            Trang xem toàn bộ lời chúc đã gửi. Vui lòng đăng nhập tài khoản BonBon để mở sổ lưu bút nhé!
          </p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-input-group">
              <User size={18} className="admin-input-icon" />
              <input
                type="text"
                placeholder="Tài khoản (BonBon)..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                className="admin-input"
                autoComplete="username"
                required
              />
            </div>

            <div className="admin-input-group">
              <KeyRound size={18} className="admin-input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Mật khẩu..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="admin-input"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-toggle-pass"
                onClick={() => setShowPass(!showPass)}
                title={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {error && <div className="admin-error-msg">{error}</div>}

            <button type="submit" className="btn-open-card admin-submit-btn">
              Mở sổ lưu bút 🔓
            </button>
          </form>

          <div className="admin-footer-actions">
            <button className="btn-back-card" onClick={onBack}>
              <ArrowLeft size={15} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Quay lại trang lời chúc
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================
           TRANG XEM TOÀN BỘ LỜI CHÚC ĐÃ GỬI (CHỈ BONBON XEM ĐƯỢC)
           ======================================================== */
        <div className="card-van-gogh card-admin-vault">
          <img
            src="/ornament.png"
            alt="Hoa văn trang trí"
            className="sticker-ornament"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          <div className="admin-vault-header">
            <div className="admin-vault-title-row">
              <BookHeart size={26} className="vault-icon" />
              <h2 className="admin-vault-title">Sổ Lưu Bút Của BonBon</h2>
              <Sparkles size={22} className="sparkle-icon" />
            </div>
            <p className="admin-vault-count">
              Tổng cộng có <strong>{wishes.length}</strong> lời chúc yêu thương đã được gửi đến bạn 💖
            </p>
          </div>

          <div className="admin-wishes-grid">
            {wishes && wishes.length > 0 ? (
              wishes.map((w, idx) => (
                <div key={w.id || idx} className="admin-wish-card">
                  <div className="admin-wish-card-top">
                    <div className="admin-wish-author-wrap">
                      <span className="admin-wish-number">#{wishes.length - idx}</span>
                      <span className="admin-wish-author">{w.name || 'Người bạn thân mến'}</span>
                    </div>
                    <div className="admin-wish-meta">
                      {w.createdAt && (
                        <span className="admin-wish-time">
                          <Calendar size={12} /> {formatTime(w.createdAt)}
                        </span>
                      )}
                      {onDeleteWish && (
                        <button
                          type="button"
                          className="admin-wish-delete-btn"
                          onClick={() => onDeleteWish(w.id)}
                          title="Xóa lời chúc này"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="admin-wish-text">{w.text}</p>
                </div>
              ))
            ) : (
              <div className="admin-empty-wishes">
                Chưa có lời chúc nào được lưu trong sổ lưu bút 🌸
              </div>
            )}
          </div>

          <div className="admin-vault-footer">
            <button className="btn-back-card" onClick={onBack}>
              ‹ Quay lại trang gửi lời chúc
            </button>
            <button className="btn-fold-card admin-logout-btn" onClick={handleLogout}>
              <LogOut size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
              Đăng xuất (Khóa sổ)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

