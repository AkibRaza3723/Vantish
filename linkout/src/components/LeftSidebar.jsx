import React from 'react';
import './Sidebar.css';

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
      <div className="card profile-summary-card">
        <div className="profile-bg-image" style={{ backgroundColor: 'var(--color-primary-light)', height: 56 }}></div>
        <div className="profile-info">
          <div className="avatar profile-avatar" style={{ width: 64, height: 64, margin: '-32px auto 12px', border: '2px solid white' }}>
            <span style={{ fontSize: 32 }}>👻</span>
          </div>
          <h2 className="text-h3" style={{ textAlign: 'center', marginBottom: 4 }}>Ghost User</h2>
          <p className="text-secondary" style={{ textAlign: 'center', padding: '0 12px' }}>
            Anonymous engineering student trying to survive DSA.
          </p>
        </div>
        
        <div className="profile-stats">
          <div className="stat-row">
            <span className="text-secondary font-semibold">Profile viewers</span>
            <span className="stat-value text-primary font-semibold">42</span>
          </div>
          <div className="stat-row">
            <span className="text-secondary font-semibold">Post impressions</span>
            <span className="stat-value text-primary font-semibold">1,337</span>
          </div>
        </div>
      </div>
      
      <div className="card groups-card">
        <div className="groups-section">
          <span className="text-secondary" style={{ fontSize: 12 }}>Recent</span>
          <ul className="group-list">
            <li className="text-secondary"># FAANG_Gossip</li>
            <li className="text-secondary"># LeetCode_Tears</li>
            <li className="text-secondary"># Startup_Failures</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
