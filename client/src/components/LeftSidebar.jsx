import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Sidebar.css';

const LeftSidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="left-sidebar">
      <div className="card profile-summary-card">
        <div className="profile-bg-image" style={{ backgroundColor: 'var(--color-primary-light)', height: 56 }}></div>
        <div className="profile-info" style={{ padding: '0 16px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <Link to="/profile" className="avatar profile-avatar" style={{ width: 64, height: 64, margin: '-32px auto 12px', border: '3px solid var(--color-bg-card)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            {user.image ? (
              <img src={user.image} alt={user.name} className="avatar-img" />
            ) : (
              <span style={{ fontSize: 32 }}>👻</span>
            )}
          </Link>
          
          <h2 className="text-h3" style={{ textAlign: 'center', marginBottom: 2 }}>
            <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--color-text-primary)' }}>
              {user.username ? `@${user.username}` : (user.name || 'User')}
            </Link>
          </h2>
          {user.name && user.name !== user.username && user.name !== 'Anonymous User' && (
            <p className="text-secondary" style={{ textAlign: 'center', marginBottom: 10, fontSize: '12px' }}>
              {user.name}
            </p>
          )}
          
          <p className="text-secondary" style={{ textAlign: 'center', padding: '0 8px', fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: 500 }}>
            {user.role === 'student' ? 'Student' : user.position || 'Professional'}
          </p>
          <p className="text-secondary" style={{ textAlign: 'center', padding: '0 8px', fontSize: '11px' }}>
            at {user.organizations || 'Unspecified Org'}
          </p>
        </div>
        
        {user.bio && (
          <div style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)', textAlign: 'center', fontStyle: 'italic' }}>
            "{user.bio}"
          </div>
        )}

        <div className="profile-stats">
          <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', fontSize: '12px' }}>
            <span className="text-secondary">Posts created</span>
            <span className="stat-value font-semibold" style={{ color: 'var(--color-primary)' }}>
              {user._count?.posts || 0}
            </span>
          </div>
        </div>
      </div>
      
      <div className="card groups-card">
        <div className="groups-section" style={{ padding: '16px' }}>
          <span className="text-secondary" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: '8px' }}>Active Community Tags</span>
          <ul className="group-list" style={{ listStyle: 'none', padding: 0 }}>
            <li className="text-secondary" style={{ fontSize: '12.5px', marginBottom: '6px', cursor: 'pointer' }}># expectations_vs_reality</li>
            <li className="text-secondary" style={{ fontSize: '12.5px', marginBottom: '6px', cursor: 'pointer' }}># burnout_logs</li>
            <li className="text-secondary" style={{ fontSize: '12.5px', marginBottom: '6px', cursor: 'pointer' }}># red_flags</li>
            <li className="text-secondary" style={{ fontSize: '12.5px', cursor: 'pointer' }}># compensation_gossip</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
