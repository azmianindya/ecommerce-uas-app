import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Header = ({ cartItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isUser } = useAuth();
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-link">
              <span className="logo-icon">🛒</span>
              <span className="logo-text">NindyaMart</span>
            </Link>
          </div>
          
          <button 
            className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              to="/products" 
              className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Produk
            </Link>
            
            {user && isUser() && (
              <Link 
                to="/user/dashboard" 
                className={`nav-link ${location.pathname.includes('/user') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard Saya
              </Link>
            )}
            
            {user && isAdmin() && (
              <Link 
                to="/admin/dashboard" 
                className={`nav-link ${location.pathname.includes('/admin') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard Admin
              </Link>
            )}
            
            <Link 
              to="/cart" 
              className={`nav-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="cart-icon">🛒</span>
              Keranjang
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
            
            {/* Auth Menu */}
            {user ? (
              <div className="user-menu">
                <span className="user-greeting">Halo, {user.name.split(' ')[0]}!</span>
                <button 
                  onClick={handleLogout}
                  className="btn-logout"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-menu">
                <Link 
                  to="/user/login" 
                  className={`nav-link auth-link ${location.pathname === '/user/login' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login Customer
                </Link>
                <Link 
                  to="/admin/login" 
                  className={`nav-link auth-link admin ${location.pathname === '/admin/login' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login Admin
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;