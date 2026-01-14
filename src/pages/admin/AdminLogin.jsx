import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const AdminLogin = () => {
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
    if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
    } else {
        setError('Ini adalah halaman login admin. Silakan gunakan login user.');
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
              <h1 className="auth-title">Login Admin NindyaMart</h1>
              <p className="auth-subtitle">Masuk ke dashboard administrator</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Admin
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="admin@nindyamart.com"
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
                  {loading ? 'Memproses...' : 'Login sebagai Admin'}
                </button>
              </div>

              <div className="auth-links">
                <Link to="/user/login" className="auth-link">
                  Login sebagai Customer
                </Link>
                <Link to="/" className="auth-link">
                  ← Kembali ke Beranda
                </Link>
              </div>

              <div className="auth-info">
                <p className="info-text">
                  <strong>Akun Demo Admin:</strong><br />
                  Email: admin@nindyamart.com<br />
                  Password: admin123
                </p>
              </div>
            </form>
          </div>

          <div className="auth-side">
            <div className="side-content">
              <h2 className="side-title">Dashboard Admin NindyaMart</h2>
              <ul className="side-features">
                <li className="feature-item">📊 Dashboard Statistik Penjualan</li>
                <li className="feature-item">📈 Monitoring Performa Toko</li>
                <li className="feature-item">📦 Manajemen Produk & Stok</li>
                <li className="feature-item">👥 Kelola Data Pelanggan</li>
                <li className="feature-item">💰 Laporan Keuangan</li>
                <li className="feature-item">⚙️ Pengaturan Sistem</li>
              </ul>
              <div className="security-note">
                <span className="security-icon">🔒</span>
                <p>Hanya untuk administrator yang berwenang</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;