import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import './App.css';
import Home from './components/Home/Home';
import AboutPage from './pages/AboutPage';
import AuthModal from './components/Auth/AuthModal';
import { useAuth } from './components/Auth/AuthContext';

// Navbar Component
function Navbar() {
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  const { user, logout } = useAuth();


  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setShowUserDropdown(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-account')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About
            </Link>
            <span className="nav-disabled">Products</span>
            <span className="nav-disabled">Contact</span>
          </div>

          <div className="nav-right">

            {/* User Account */}
            <div 
              className="user-account"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <button className="account-btn">
                <FaUser className="profile-icon" />
                <span>{user ? user.firstName : 'Account'}</span>
              </button>
              
              {showUserDropdown && (
                <div className="account-dropdown">
                  {user ? (
                    <>
                      <div className="user-info">
                        <p className="user-name">{user.firstName} {user.lastName}</p>
                        <p className="user-email">{user.email}</p>
                      </div>
                      <div className="dropdown-divider"></div>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}>
                        Sign Out
                      </a>
                    </>
                  ) : (
                    <>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleAuthClick('signin');
                      }}>
                        Sign In
                      </a>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleAuthClick('signup');
                      }}>
                        Sign Up
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<div style={{paddingTop: '100px', textAlign: 'center', color: 'var(--text-color)'}}>Products Page (Coming Soon)</div>} />
            <Route path="/contact" element={<div style={{paddingTop: '100px', textAlign: 'center', color: 'var(--text-color)'}}>Contact Page (Coming Soon)</div>} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;