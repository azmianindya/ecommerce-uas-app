import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email, password);
    
    if (result.success) {
      if (result.user.role === 'user') {
        navigate('/user/dashboard');
      } else {
        setError('Ini adalah halaman login user. Silakan gunakan login admin.');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Login Customer NindyaMart</h1>
              <p className="auth-subtitle">Masuk ke akun pelanggan Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="user@nindyamart.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox-input" />
                  <span className="checkbox-text">Ingat saya</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Lupa password?
                </Link>
              </div>

              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">⚠️</span>
                  <span className="alert-text">{error}</span>
                </div>
              )}

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-auth"
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Masuk ke Akun'}
                </button>
              </div>

              <div className="auth-divider">
                <span className="divider-text">atau</span>
              </div>

              <div className="social-login">
                <button type="button" className="btn btn-outline btn-social">
                  <span className="social-icon">G</span>
                  Login dengan Google
                </button>
              </div>

              <div className="auth-links">
                <p className="auth-text">
                  Belum punya akun?{' '}
                  <Link to="/register" className="auth-link">
                    Daftar sebagai Pelanggan Baru
                  </Link>
                </p>
                <Link to="/admin/login" className="auth-link">
                  Login sebagai Admin
                </Link>
                <Link to="/" className="auth-link">
                  ← Kembali ke Beranda
                </Link>
              </div>

              <div className="auth-info">
                <p className="info-text">
                  <strong>Akun Demo Customer:</strong><br />
                  Email: user@nindyamart.com<br />
                  Password: user123
                </p>
                <p className="info-text">
                  <strong>Akun Demo Customer 2:</strong><br />
                  Email: customer@nindyamart.com<br />
                  Password: customer123
                </p>
              </div>
            </form>
          </div>

          <div className="auth-side">
            <div className="side-content">
              <h2 className="side-title">Keuntungan Login sebagai Customer</h2>
              <ul className="side-features">
                <li className="feature-item">🚚 Lacak Status Pesanan</li>
                <li className="feature-item">❤️ Simpan Produk Favorit</li>
                <li className="feature-item">💳 Pembayaran Lebih Cepat</li>
                <li className="feature-item">📝 Riwayat Belanja Lengkap</li>
                <li className="feature-item">🎁 Kumpulkan Poin Reward</li>
                <li className="feature-item">📧 Notifikasi Promo Eksklusif</li>
              </ul>
              <div className="security-note">
                <span className="security-icon">🔒</span>
                <p>Data pribadi Anda terlindungi dengan enkripsi SSL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;