import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const isProductsPage = location.pathname === '/products';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">Productr</span>
          <span className="logo-icon">∞</span>
        </div>
        
        <div className="sidebar-search">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667zM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input type="text" placeholder="Search" className="search-input" />
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10l7-7 7 7M6 18v-6h8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Home</span>
          </Link>
          <Link to="/products" className={`nav-item ${isProductsPage ? 'active' : ''}`}>
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4h12v12H4V4zM4 8h12M8 4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Products</span>
          </Link>
        </nav>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-logo">
            <span className="logo-text">Productr</span>
            <span className="logo-icon">∞</span>
          </div>
          <div className="header-search">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667zM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input type="text" placeholder="Search Services, Products" className="header-search-input" />
          </div>
          <div className="header-user" ref={menuRef} onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="user-avatar">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#9F7AEA"/>
                <path d="M16 10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-3.31 0-6 1.34-6 3v1h12v-1c0-1.66-2.69-3-6-3z" fill="white"/>
              </svg>
            </div>
            <svg className="chevron-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {showUserMenu && (
              <div className="user-menu">
                <div className="user-menu-item">
                  <span>{user?.name || user?.email || 'User'}</span>
                </div>
                <div className="user-menu-item" onClick={handleLogout}>
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
