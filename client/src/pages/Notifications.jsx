import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckSquare } from 'lucide-react';
import { notificationsApi } from '../api/notifications';
import { getAvatarUrl } from '../lib/avatar';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = async (targetPage = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await notificationsApi.getNotifications(targetPage, 20);
      if (response && response.notifications) {
        if (targetPage === 1) {
          setNotifications(response.notifications);
        } else {
          setNotifications(prev => [...prev, ...response.notifications]);
        }
        setTotalPages(response.pagination?.totalPages || 1);
        setPage(targetPage);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      alert('Error: ' + err.message);
    }
  };

  const handleNotificationClick = async (notif) => {
    // 1. Mark as read on backend if unread
    if (!notif.isRead) {
      try {
        await notificationsApi.markAsRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }

    // 2. Navigate based on notification type
    if (notif.type === 'CONNECTION_REQUEST') {
      navigate('/network');
    } else if (notif.type === 'CONNECTION_ACCEPTED') {
      navigate(`/profile/${notif.actor?.id}`);
    } else if (['POST_RELATED', 'POST_NOT_RELATED', 'POST_COMMENTED', 'CONNECTION_POST', 'POST_REPORTED'].includes(notif.type)) {
      navigate('/feed');
    } else {
      navigate('/feed');
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getNotificationMetadata = (type) => {
    switch (type) {
      case 'CONNECTION_REQUEST':
        return { emoji: '👤', className: 'notif-connection' };
      case 'CONNECTION_ACCEPTED':
        return { emoji: '🤝', className: 'notif-accepted' };
      case 'POST_RELATED':
        return { emoji: '👍', className: 'notif-related' };
      case 'POST_NOT_RELATED':
        return { emoji: '👎', className: 'notif-not-related' };
      case 'POST_COMMENTED':
        return { emoji: '💬', className: 'notif-comment' };
      case 'POST_REPORTED':
      case 'COMMENT_REPORTED':
        return { emoji: '⚠️', className: 'notif-reported' };
      case 'CONNECTION_POST':
        return { emoji: '🔗', className: 'notif-post' };
      default:
        return { emoji: '🔔', className: 'notif-default' };
    }
  };

  // Filter notifications on frontend
  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => [
        'POST_RELATED',
        'POST_NOT_RELATED',
        'POST_COMMENTED',
        'POST_REPORTED',
        'COMMENT_REPORTED'
      ].includes(n.type));

  const loadMore = () => {
    if (page < totalPages) {
      fetchNotifications(page + 1);
    }
  };

  return (
    <div className="grid-layout">
      {/* Filters Sidebar */}
      <div className="left-sidebar">
        <div className="card filters-card">
          <h2 className="text-h3" style={{ padding: '12px 16px', margin: 0 }}>Manage your Notifications</h2>
          <div className="filter-list">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'my-posts' ? 'active' : ''}`}
              onClick={() => setFilter('my-posts')}
            >
              My posts
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="feed-column">
        <div className="card notifications-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 className="text-h3" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} /> Notifications
            </h2>
            {notifications.some(n => !n.isRead) && (
              <button 
                onClick={handleMarkAllRead} 
                className="btn-ghost" 
                style={{ fontSize: '12.5px', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <CheckSquare size={16} /> Mark all as read
              </button>
            )}
          </div>

          {error && (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-danger, #ef4444)' }}>
              {error}
            </div>
          )}

          {filteredNotifications.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              {loading ? 'Loading notifications...' : 'No notifications yet.'}
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map(notif => {
                const metadata = getNotificationMetadata(notif.type);
                return (
                  <div 
                    key={notif.id} 
                    className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notif)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="notification-content-wrapper">
                      {!notif.isRead && <div className="unread-dot"></div>}
                      <div className={`avatar notification-avatar ${metadata.className}`} style={{ width: '48px', height: '48px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        {notif.actor ? (
                          <img 
                            src={notif.actor.avatarUrl || getAvatarUrl(notif.actor.username)} 
                            alt={notif.actor.username} 
                            className="avatar-img" 
                          />
                        ) : (
                          <span style={{ fontSize: 24 }}>🤖</span>
                        )}
                        <div className="notification-badge-emoji" style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          backgroundColor: 'var(--color-bg-card)',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          fontSize: '11px'
                        }}>
                          {metadata.emoji}
                        </div>
                      </div>
                      <div className="notification-text" style={{ flexGrow: 1 }}>
                        <p className="text-body" style={{ margin: 0, fontSize: '13.5px', color: 'var(--color-text-primary)' }}>
                          {notif.message}
                        </p>
                        <span className="text-secondary" style={{ fontSize: '11.5px', display: 'block', marginTop: '4px' }}>
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {page < totalPages && (
            <button 
              onClick={loadMore} 
              className="btn-ghost" 
              style={{ width: '100%', padding: '12px', borderTop: '1px solid var(--color-border)', cursor: 'pointer', fontWeight: 600, color: 'var(--color-primary)' }}
            >
              {loading ? 'Loading more...' : 'Load older notifications'}
            </button>
          )}
        </div>
      </div>
      
      {/* Right Sidebar Ad */}
      <div className="right-sidebar">
        <div className="card ad-card">
          <p className="text-secondary text-center" style={{ fontSize: 12, padding: 8 }}>Ad</p>
          <div style={{ padding: 16, textAlign: 'center' }}>
            <h3 className="text-body font-semibold">Tired of LeetCode?</h3>
            <p className="text-secondary" style={{ marginTop: 8 }}>Try passing the interview with just good vibes.</p>
            <button className="btn-primary" style={{ marginTop: 16 }}>Learn more</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
