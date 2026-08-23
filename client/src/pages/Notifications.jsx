import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import './Notifications.css';

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Anonymous 🦊 reacted to your post: "Just had my 1-on-1..."', time: '1h', read: false, emoji: '👍', avatarEmoji: '🦊' },
  { id: 2, text: 'Secret Founder 🦄 and 3 others commented on a post you shared.', time: '3h', read: false, emoji: '💬', avatarEmoji: '🦄' },
  { id: 3, text: 'Trending: "CEO caught using ChatGPT" is popular today.', time: '5h', read: true, emoji: '🔥', avatarEmoji: '📰' },
  { id: 4, text: 'Tired CS Student 🦉 viewed your profile.', time: '1d', read: true, emoji: '👀', avatarEmoji: '🦉' },
  { id: 5, text: 'Angry QA 🐞 posted for the first time in a while.', time: '2d', read: true, emoji: '📢', avatarEmoji: '🐞' },
];

const Notifications = () => {
  const [filter, setFilter] = useState('all');

  return (
    <div className="grid-layout">
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
            <button 
              className={`filter-btn ${filter === 'mentions' ? 'active' : ''}`}
              onClick={() => setFilter('mentions')}
            >
              Mentions
            </button>
          </div>
        </div>
      </div>

      <div className="feed-column">
        <div className="card notifications-card">
          {MOCK_NOTIFICATIONS.map(notif => (
            <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
              <div className="notification-content-wrapper">
                {!notif.read && <div className="unread-dot"></div>}
                <div className="avatar notification-avatar">
                  <span style={{ fontSize: 24 }}>{notif.avatarEmoji}</span>
                  <div className="notification-badge-emoji">{notif.emoji}</div>
                </div>
                <div className="notification-text">
                  <p className="text-body" style={{ margin: 0 }}>
                    {notif.text}
                  </p>
                </div>
              </div>
              <div className="notification-meta">
                <span className="text-secondary">{notif.time}</span>
                <button className="btn-ghost" style={{ width: 32, height: 32 }}>
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
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
