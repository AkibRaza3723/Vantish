import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notificationsApi } from '../api/notifications';
import { getAvatarUrl } from '../lib/avatar';
import { useAuth } from './AuthContext';
import './Sidebar.css';

const RightSidebar = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchTopNotifications = async () => {
      try {
        const response = await notificationsApi.getNotifications(1, 3);
        if (response && response.notifications) {
          setNotifications(response.notifications);
        }
      } catch (err) {
        console.error('Failed to fetch top notifications:', err);
      }
    };

    if (user) {
      fetchTopNotifications();
    }
  }, [user]);

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

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  return (
    <div className="right-sidebar">
      <div className="card news-card">
        <div className="news-header">
          <h2 className="text-h3" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Bell size={15} /> Notifications
          </h2>
          <Link to="/notifications" style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
            See all
          </Link>
        </div>

        <div className="sidebar-notif-list">
          {notifications.length === 0 ? (
            <p className="text-secondary" style={{ fontSize: 12, padding: '8px 4px', margin: 0, textAlign: 'center' }}>
              No notifications.
            </p>
          ) : (
            notifications.map(notif => {
              const metadata = getNotificationMetadata(notif.type);
              return (
                <Link to="/notifications" key={notif.id} className={`sidebar-notif-item ${!notif.isRead ? 'unread' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {!notif.isRead && <div className="unread-dot" />}
                  <div className={`avatar sidebar-notif-avatar ${metadata.className}`} style={{ width: '32px', height: '32px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    {notif.actor ? (
                      <img src={notif.actor.avatarUrl || getAvatarUrl(notif.actor.username)} alt={notif.actor.username} className="avatar-img" />
                    ) : (
                      <span style={{ fontSize: 16 }}>🤖</span>
                    )}
                    <div className="notification-badge-emoji" style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      backgroundColor: 'var(--color-bg-card)',
                      borderRadius: '50%',
                      width: '12px',
                      height: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      fontSize: '7px'
                    }}>{metadata.emoji}</div>
                  </div>
                  <div className="sidebar-notif-content">
                    <p className="sidebar-notif-text" style={{ fontSize: '11.5px', margin: 0, lineHeight: 1.3 }}>{notif.message}</p>
                    <span className="sidebar-notif-time" style={{ fontSize: '10px' }}>{formatTimeAgo(notif.createdAt)}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
