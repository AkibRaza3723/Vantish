import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { Home, Users, Bell, User, Search, PlusSquare, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { usersApi } from '../api/users';
import { notificationsApi } from '../api/notifications';
import { getAvatarUrl } from '../lib/avatar';
import './Navbar.css';

const Navbar = ({ onPostClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationsApi.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchUnreadCount]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await usersApi.searchUsers(searchQuery);
        setSearchResults(response.results || []);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (userId) => {
    setSearchQuery('');
    setShowDropdown(false);
    navigate(`/profile/${userId}`);
  };

  const navList = (
    <ul className="nav-list">
      <li className="nav-item">
        <NavLink to="/feed" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Home className="nav-icon" size={20} />
          <span className="nav-text">Feed</span>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/network" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Users className="nav-icon" size={20} />
          <span className="nav-text">Network</span>
        </NavLink>
      </li>
      <li className="nav-item mobile-only-nav">
        <button className="nav-link" onClick={onPostClick}>
          <PlusSquare className="nav-icon" size={20} />
          <span className="nav-text">Post</span>
        </button>
      </li>
      <li className="nav-item">
        <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <Bell className="nav-icon" size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <span className="nav-text">Notifications</span>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <User className="nav-icon" size={20} />
          <span className="nav-text">Profile</span>
        </NavLink>
      </li>
    </ul>
  );

  return (
    <>
      <header className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <Link to="/feed" className="navbar-logo" style={{ textDecoration: 'none' }}>
              <img src="/logo.png" alt="Vantish" style={{ height: 30, width: 'auto', objectFit: 'contain' }} />
              <span className="navbar-logo-text" style={{
                fontFamily: "'Source Sans 3', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '20px',
                fontWeight: 900,
                color: 'var(--color-primary)',
                letterSpacing: '-0.4px',
                lineHeight: 1,
                marginRight: '5 rem',
              }}>Vantish</span>
            </Link>
            
            <div className="search-wrapper" ref={searchRef}>
              <div className="search-container">
                <Search className="search-icon" size={16} />
                <input 
                  type="text" 
                  placeholder="Search users or organizations" 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
              </div>
              
              {showDropdown && searchQuery.trim() && (
                <div className="search-dropdown card">
                  {searchLoading ? (
                    <div className="search-no-results">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <ul className="search-results-list">
                      {searchResults.map((userResult) => (
                        <li key={userResult.id}>
                          <div 
                            className="search-result-item" 
                            onClick={() => handleResultClick(userResult.id)}
                          >
                            <div className="avatar" style={{ width: 32, height: 32, flexShrink: 0 }}>
                              <img src={userResult.avatarUrl || getAvatarUrl(userResult.username)} alt={userResult.username} className="avatar-img" />
                            </div>
                            <div className="search-result-info">
                              <span className="search-result-name">
                                {`@${userResult.username}`}
                              </span>
                              <span className="search-result-meta">
                                {userResult.role === 'student' ? 'Student' : userResult.position || 'Professional'} at {userResult.organizations}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="search-no-results">No users found.</div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <nav className="navbar-nav desktop-nav">
            {navList}
          </nav>
          
          <div className="navbar-right-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="logout-nav-btn" onClick={logout} title="Log Out">
              <LogOut size={15} style={{ verticalAlign: 'middle' }} />
              <span className="logout-text" style={{ marginLeft: '4px' }}>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="navbar-nav mobile-nav">
        {navList}
      </nav>
    </>
  );
};

export default Navbar;
