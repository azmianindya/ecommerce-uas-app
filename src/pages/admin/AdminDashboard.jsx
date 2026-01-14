import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import productsData from '../../data/products.json';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(productsData);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalUsers: 0,
    monthlyGrowth: 12.5
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);

    // Calculate stats
    const totalSales = savedOrders.reduce((sum, order) => sum + order.totals.total, 0);
    const pendingOrders = savedOrders.filter(order => order.status === 'pending').length;
    const completedOrders = savedOrders.filter(order => order.status === 'delivered').length;

    setStats({
      totalSales,
      totalProducts: productsData.length,
      pendingOrders,
      totalUsers: 24, // Sample data
      completedOrders,
      monthlyGrowth: 12.5
    });
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      setProducts(prev => prev.filter(product => product.id !== productId));
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Dashboard Admin NindyaMart</h1>
            <div className="user-info">
              <span className="user-name">Halo, {user.name}! 👋</span>
              <span className="user-role">Role: Administrator</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3 className="stat-title">Total Penjualan</h3>
              <p className="stat-value">{formatPrice(stats.totalSales)}</p>
              <span className="stat-change positive">+{stats.monthlyGrowth}% bulan ini</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3 className="stat-title">Total Produk</h3>
              <p className="stat-value">{stats.totalProducts}</p>
              <span className="stat-change positive">Aktif: {products.length}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3 className="stat-title">Pesanan Tertunda</h3>
              <p className="stat-value">{stats.pendingOrders}</p>
              <span className="stat-change warning">Perlu tindakan</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3 className="stat-title">Total Pelanggan</h3>
              <p className="stat-value">{stats.totalUsers}</p>
              <span className="stat-change positive">+8 pelanggan baru</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 className="actions-title">Aksi Cepat</h3>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/products')}>
              <span className="action-icon">➕</span>
              <span className="action-text">Tambah Produk</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/admin/dashboard#orders')}>
              <span className="action-icon">📋</span>
              <span className="action-text">Lihat Semua Pesanan</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📊</span>
              <span className="action-text">Generate Laporan</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">👥</span>
              <span className="action-text">Kelola Pelanggan</span>
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Orders */}
          <div className="dashboard-section" id="orders">
            <div className="section-header">
              <h2 className="section-title">Pesanan Terbaru</h2>
              <span className="section-badge">{orders.length} pesanan</span>
            </div>
            
            {orders.length > 0 ? (
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Tanggal</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td className="order-id-cell">
                          <strong>{order.id}</strong>
                        </td>
                        <td>
                          <div className="customer-info">
                            <div className="customer-name">{order.customer.fullName}</div>
                            <div className="customer-email">{order.customer.email}</div>
                          </div>
                        </td>
                        <td>{formatDate(order.date)}</td>
                        <td className="order-total-cell">
                          {formatPrice(order.totals.total)}
                        </td>
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status === 'pending' ? 'Pending' : 
                             order.status === 'delivered' ? 'Selesai' : order.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-action btn-view"
                              title="Lihat detail"
                            >
                              👁️
                            </button>
                            <button 
                              className="btn-action btn-edit"
                              title="Edit status"
                            >
                              ✏️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p className="empty-text">Belum ada pesanan</p>
              </div>
            )}
          </div>

          {/* Product Management */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Manajemen Produk</h2>
              <Link to="/products" className="btn btn-primary btn-sm">
                + Tambah Produk Baru
              </Link>
            </div>
            
            <div className="products-list">
              {products.slice(0, 4).map(product => (
                <div key={product.id} className="product-item-admin">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image-admin" 
                  />
                  <div className="product-info-admin">
                    <h4 className="product-name-admin">{product.name}</h4>
                    <p className="product-category-admin">
                      <span className="category-badge">{product.category}</span>
                    </p>
                    <p className="product-price-admin">{formatPrice(product.price)}</p>
                    <div className="product-meta-admin">
                      <span className="product-sku">SKU: TS{product.id.toString().padStart(3, '0')}</span>
                      <span className={`product-stock ${product.stock < 10 ? 'low' : 'good'}`}>
                        Stok: {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="product-actions-admin">
                    <button 
                      className="btn-action btn-edit"
                      title="Edit produk"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-action btn-delete"
                      title="Hapus produk"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="section-footer">
              <Link to="/products" className="btn btn-outline">
                Lihat Semua Produk ({products.length})
              </Link>
            </div>
          </div>

          {/* System Info */}
          <div className="dashboard-section system-info">
            <div className="section-header">
              <h2 className="section-title">Informasi Sistem</h2>
            </div>
            <div className="system-grid">
              <div className="system-item">
                <span className="system-label">Versi Aplikasi:</span>
                <span className="system-value">v1.0.0</span>
              </div>
              <div className="system-item">
                <span className="system-label">Terakhir Update:</span>
                <span className="system-value">1 Januari 2024</span>
              </div>
              <div className="system-item">
                <span className="system-label">Total Transaksi:</span>
                <span className="system-value">{orders.length}</span>
              </div>
              <div className="system-item">
                <span className="system-label">Status Server:</span>
                <span className="system-value online">● Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;