import React, { useState, useEffect, useCallback, memo } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notificationsApi } from '../api/notifications';
import { getAvatarUrl } from '../lib/avatar';
import { useAuth } from './AuthContext';
import './Sidebar.css';

// ── Pure helpers — defined outside so they're never recreated ──────────────────

const NOTIF_METADATA = {
  CONNECTION_REQUEST:  { emoji: '👤', className: 'notif-connection' },
  CONNECTION_ACCEPTED: { emoji: '🤝', className: 'notif-accepted' },
  POST_RELATED:        { emoji: '👍', className: 'notif-related' },
  POST_NOT_RELATED:    { emoji: '👎', className: 'notif-not-related' },
  POST_COMMENTED:      { emoji: '💬', className: 'notif-comment' },
  POST_REPORTED:       { emoji: '⚠️', className: 'notif-reported' },
  COMMENT_REPORTED:    { emoji: '⚠️', className: 'notif-reported' },
  CONNECTION_POST:     { emoji: '🔗', className: 'notif-post' },
};
const DEFAULT_META = { emoji: '🔔', className: 'notif-default' };
const getNotificationMetadata = (type) => NOTIF_METADATA[type] ?? DEFAULT_META;

const formatTimeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
};

// ── NotifItem — memoized so each notification only re-renders if it changes ───

const NotifItem = memo(({ notif }) => {
  const metadata = getNotificationMetadata(notif.type);
  return (
    <Link
      to="/notifications"
      className={`sidebar-notif-item ${!notif.isRead ? 'unread' : ''}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      {!notif.isRead && <div className="unread-dot" />}
      <div
        className={`avatar sidebar-notif-avatar ${metadata.className}`}
        style={{ width: '32px', height: '32px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
      >
        {notif.actor ? (
          <img src={notif.actor.avatarUrl || getAvatarUrl(notif.actor.username)} alt={notif.actor.username} className="avatar-img" />
        ) : (
          <span style={{ fontSize: 16 }}>🤖</span>
        )}
        <div
          className="notification-badge-emoji"
          style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: 'var(--color-bg-card)', borderRadius: '50%', width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontSize: '7px' }}
        >
          {metadata.emoji}
        </div>
      </div>
      <div className="sidebar-notif-content">
        <p className="sidebar-notif-text" style={{ fontSize: '11.5px', margin: 0, lineHeight: 1.3 }}>{notif.message}</p>
        <span className="sidebar-notif-time" style={{ fontSize: '10px' }}>{formatTimeAgo(notif.createdAt)}</span>
      </div>
    </Link>
  );
});
NotifItem.displayName = 'NotifItem';

// ── Main component — memoized ──────────────────────────────────────────────────

const RightSidebar = memo(() => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const fetchTopNotifications = useCallback(async () => {
    try {
      const response = await notificationsApi.getNotifications(1, 3);
      if (response?.notifications) {
        setNotifications(response.notifications);
      }
    } catch (err) {
      console.error('Failed to fetch top notifications:', err);
    }
  }, []);

  useEffect(() => {
    if (user) fetchTopNotifications();
  }, [user, fetchTopNotifications]);

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
            notifications.map(notif => <NotifItem key={notif.id} notif={notif} />)
          )}
        </div>
      </div>
    </div>
  );
});

RightSidebar.displayName = 'RightSidebar';

export default RightSidebar;
