import React from 'react';
import { Bell, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const TOP_NOTIFICATIONS = [
  { id: 1, text: 'Anonymous 🦊 reacted to your post: "Just had my 1-on-1..."', time: '1h', read: false, emoji: '👍', avatarEmoji: '🦊' },
  { id: 2, text: 'Secret Founder 🦄 and 3 others commented on a post you shared.', time: '3h', read: false, emoji: '💬', avatarEmoji: '🦄' },
  { id: 3, text: 'Trending: "CEO caught using ChatGPT" is popular today.', time: '5h', read: true, emoji: '🔥', avatarEmoji: '📰' },
];

const RightSidebar = () => {
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
          {TOP_NOTIFICATIONS.map(notif => (
            <div key={notif.id} className={`sidebar-notif-item ${!notif.read ? 'unread' : ''}`}>
              {!notif.read && <div className="unread-dot" />}
              <div className="sidebar-notif-avatar">
                <span style={{ fontSize: 22 }}>{notif.avatarEmoji}</span>
                <div className="notification-badge-emoji">{notif.emoji}</div>
              </div>
              <div className="sidebar-notif-content">
                <p className="sidebar-notif-text">{notif.text}</p>
                <span className="sidebar-notif-time">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
