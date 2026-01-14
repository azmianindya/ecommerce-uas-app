import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import ProductCard from '../../components/ProductCard';
import productsData from '../../data/products.json';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    rewardPoints: 1250
  });

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/user/login');
      return;
    }

    // Load user orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = savedOrders.filter(order => 
      order.customer.email === user.email
    );
    
    setOrders(userOrders);
    
    // Sample wishlist (first 3 products)
    setWishlist(productsData.slice(0, 3));
    
    // Recent viewed products (last 4 products)
    setRecentProducts(productsData.slice(-4));
    
    // Calculate user stats
    const totalSpent = userOrders.reduce((sum, order) => sum + order.totals.total, 0);
    
    setUserStats({
      totalOrders: userOrders.length,
      totalSpent,
      wishlistCount: 3,
      rewardPoints: 1250,
      memberSince: 'Januari 2024',
      memberLevel: 'Silver'
    });
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddToCart = (product) => {
    alert(`✅ ${product.name} telah ditambahkan ke keranjang!`);
    // Implement actual add to cart logic here
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { text: 'Menunggu Pembayaran', color: 'warning', icon: '⏳' },
      'processing': { text: 'Diproses', color: 'info', icon: '🔄' },
      'shipped': { text: 'Dikirim', color: 'primary', icon: '🚚' },
      'delivered': { text: 'Selesai', color: 'success', icon: '✅' },
      'cancelled': { text: 'Dibatalkan', color: 'danger', icon: '❌' }
    };
    
    const config = statusConfig[status] || { text: status, color: 'secondary', icon: '📦' };
    
    return (
      <span className={`status-badge ${config.color}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <div className="user-dashboard">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="user-welcome">
            <h1 className="dashboard-title">Dashboard Pelanggan</h1>
            <p className="welcome-message">
              Selamat datang kembali, <strong>{user.name}</strong>! 👋
            </p>
            <p className="welcome-subtext">
              Email: {user.email} | Member sejak: {userStats.memberSince}
            </p>
          </div>
          <div className="user-actions">
            <Link to="/cart" className="btn btn-outline btn-cart">
              🛒 Lihat Keranjang
            </Link>
            <Link to="/products" className="btn btn-outline">
              🛍️ Lanjut Belanja
            </Link>
            <button onClick={handleLogout} className="btn btn-outline btn-logout">
              Logout
            </button>
          </div>
        </div>

        {/* User Stats */}
        <div className="user-stats">
          <div className="user-stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3 className="stat-title">Total Pesanan</h3>
              <p className="stat-value">{userStats.totalOrders}</p>
              <span className="stat-subtext">Pesanan aktif: {orders.filter(o => o.status !== 'delivered').length}</span>
            </div>
          </div>
          <div className="user-stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3 className="stat-title">Total Belanja</h3>
              <p className="stat-value">{formatPrice(userStats.totalSpent)}</p>
              <span className="stat-subtext">Selama menjadi member</span>
            </div>
          </div>
          <div className="user-stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-content">
              <h3 className="stat-title">Wishlist</h3>
              <p className="stat-value">{userStats.wishlistCount}</p>
              <span className="stat-subtext">Produk favorit</span>
            </div>
          </div>
          <div className="user-stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3 className="stat-title">Poin Reward</h3>
              <p className="stat-value">{userStats.rewardPoints}</p>
              <span className="stat-subtext">Tukar dengan hadiah</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Recent Orders */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Pesanan Terakhir</h2>
              {orders.length > 0 && (
                <Link to="/user/orders" className="btn btn-outline btn-sm">
                  Lihat Semua
                </Link>
              )}
            </div>
            
            <div className="orders-list">
              {orders.length > 0 ? (
                orders.slice(0, 3).map(order => (
                  <div key={order.id} className="order-item-user">
                    <div className="order-header">
                      <div className="order-id">
                        <strong>{order.id}</strong>
                      </div>
                      <div className="order-date">{formatDate(order.date)}</div>
                    </div>
                    <div className="order-details">
                      <div className="order-items-count">
                        📦 {order.items.length} item
                      </div>
                      <div className="order-total">
                        {formatPrice(order.totals.total)}
                      </div>
                      <div className="order-status">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    <div className="order-actions">
                      <Link to={`/user/orders/${order.id}`} className="btn btn-outline btn-sm">
                        📋 Detail Pesanan
                      </Link>
                      {order.status === 'pending' && (
                        <button className="btn btn-primary btn-sm">
                          💳 Bayar Sekarang
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button className="btn btn-outline btn-sm">
                          ⭐ Beri Ulasan
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <p className="empty-text">Belum ada riwayat pesanan</p>
                  <Link to="/products" className="btn btn-primary">
                    🛍️ Mulai Belanja Pertama
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Wishlist */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Wishlist Saya</h2>
              {wishlist.length > 0 && (
                <Link to="/user/wishlist" className="btn btn-outline btn-sm">
                  Lihat Semua
                </Link>
              )}
            </div>
            
            <div className="wishlist-items">
              {wishlist.length > 0 ? (
                wishlist.map(product => (
                  <div key={product.id} className="wishlist-item">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="wishlist-image" 
                    />
                    <div className="wishlist-info">
                      <h4 className="wishlist-name">{product.name}</h4>
                      <p className="wishlist-category">{product.category}</p>
                      <p className="wishlist-price">{formatPrice(product.price)}</p>
                      <div className="wishlist-stock">
                        <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {product.stock > 0 ? 'Tersedia' : 'Stok Habis'}
                        </span>
                      </div>
                    </div>
                    <div className="wishlist-actions">
                      <button 
                        className="btn-action btn-cart"
                        onClick={() => handleAddToCart(product)}
                        title="Tambahkan ke keranjang"
                      >
                        🛒
                      </button>
                      <button 
                        className="btn-action btn-remove"
                        title="Hapus dari wishlist"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">❤️</div>
                  <p className="empty-text">Wishlist Anda masih kosong</p>
                  <Link to="/products" className="btn btn-outline">
                    🔍 Temukan Produk Favorit
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Baru Dilihat</h2>
            </div>
            
            <div className="recent-products">
              {recentProducts.map(product => (
                <div key={product.id} className="recent-product">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="recent-image" 
                  />
                  <div className="recent-info">
                    <h4 className="recent-name">{product.name}</h4>
                    <p className="recent-category">{product.category}</p>
                    <p className="recent-price">{formatPrice(product.price)}</p>
                  </div>
                  <button 
                    className="btn-view"
                    onClick={() => navigate(`/product/${product.id}`)}
                    title="Lihat produk"
                  >
                    👁️
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* User Info & Quick Links */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Informasi Akun</h2>
              <Link to="/user/profile" className="btn btn-outline btn-sm">
                ✏️ Edit Profil
              </Link>
            </div>
            
            <div className="user-info-card">
              <div className="info-item">
                <span className="info-label">Nama Lengkap:</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">No. Telepon:</span>
                <span className="info-value">-</span>
              </div>
              <div className="info-item">
                <span className="info-label">Alamat:</span>
                <span className="info-value">Belum diatur</span>
              </div>
              <div className="info-item">
                <span className="info-label">Level Member:</span>
                <span className="info-value member-level">
                  🥈 {userStats.memberLevel}
                </span>
              </div>
            </div>

            <div className="quick-links">
              <h3 className="links-title">Akses Cepat</h3>
              <div className="links-grid">
                <Link to="/user/addresses" className="link-item">
                  <span className="link-icon">🏠</span>
                  <span className="link-text">Alamat Saya</span>
                </Link>
                <Link to="/user/payments" className="link-item">
                  <span className="link-icon">💳</span>
                  <span className="link-text">Metode Pembayaran</span>
                </Link>
                <Link to="/user/reviews" className="link-item">
                  <span className="link-icon">⭐</span>
                  <span className="link-text">Ulasan Saya</span>
                </Link>
                <Link to="/user/settings" className="link-item">
                  <span className="link-icon">⚙️</span>
                  <span className="link-text">Pengaturan Akun</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <div className="section-header">
            <h2 className="section-title">Rekomendasi Untuk Anda</h2>
            <Link to="/products" className="btn btn-outline btn-sm">
              Lihat Lebih Banyak
            </Link>
          </div>
          <div className="products-grid">
            {productsData.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="support-section">
          <h3 className="support-title">Butuh Bantuan?</h3>
          <div className="support-options">
            <div className="support-option">
              <span className="support-icon">📞</span>
              <div className="support-content">
                <h4>Hubungi Kami</h4>
                <p>(021) 1234-5678</p>
              </div>
            </div>
            <div className="support-option">
              <span className="support-icon">💬</span>
              <div className="support-content">
                <h4>Live Chat</h4>
                <p>Online 08:00 - 22:00</p>
              </div>
            </div>
            <div className="support-option">
              <span className="support-icon">📧</span>
              <div className="support-content">
                <h4>Email Support</h4>
                <p>support@nindyamart.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;