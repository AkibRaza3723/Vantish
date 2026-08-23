import React from 'react';
import './Network.css';

const MOCK_REQUESTS = [
  { id: 1, name: 'Anonymous 🐼', role: 'SDE-2 at Amazon', time: '2h ago', avatarEmoji: '🐼' },
  { id: 2, name: 'Secret Designer 🎨', role: 'UX at Figma', time: '5h ago', avatarEmoji: '🎨' },
];

const MOCK_SUGGESTIONS = [
  { id: 3, name: 'Ghost Dev 👻', role: 'Frontend at Meta', connections: '12 shared connections', avatarEmoji: '👻' },
  { id: 4, name: 'Tired PM 📉', role: 'PM at Google', connections: '4 shared connections', avatarEmoji: '📉' },
  { id: 5, name: 'Angry QA 🐞', role: 'QA at Startup', connections: '1 shared connection', avatarEmoji: '🐞' },
  { id: 6, name: 'Sleepy SRE 💤', role: 'SRE at Netflix', connections: '24 shared connections', avatarEmoji: '💤' },
];

const Network = () => {
  return (
    <div className="network-container">
      <div className="network-sidebar">
        <div className="card network-manage-card">
          <h2 className="text-h3" style={{ padding: '12px 16px', margin: 0 }}>Manage my network</h2>
          <ul className="network-list">
            <li className="network-list-item">
              <span className="text-secondary">Connections</span>
              <span className="text-secondary">1,204</span>
            </li>
            <li className="network-list-item">
              <span className="text-secondary">Contacts</span>
              <span className="text-secondary">42</span>
            </li>
            <li className="network-list-item">
              <span className="text-secondary">Following & followers</span>
              <span className="text-secondary">3,192</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="network-main">
        {MOCK_REQUESTS.length > 0 && (
          <div className="card network-section">
            <div className="section-header">
              <h2 className="text-h3" style={{ margin: 0 }}>Invitations</h2>
              <span className="text-secondary">Manage</span>
            </div>
            <div className="request-list">
              {MOCK_REQUESTS.map(req => (
                <div key={req.id} className="request-item">
                  <div className="request-info">
                    <div className="avatar" style={{ width: 72, height: 72 }}>
                      <span style={{ fontSize: 36 }}>{req.avatarEmoji}</span>
                    </div>
                    <div className="request-details">
                      <h3 className="text-h3" style={{ margin: 0 }}>{req.name}</h3>
                      <p className="text-secondary">{req.role}</p>
                      <p className="text-secondary" style={{ fontSize: 12 }}>{req.time}</p>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button className="btn-secondary">Ignore</button>
                    <button className="btn-primary" style={{ padding: '6px 24px' }}>Accept</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card network-section">
          <div className="section-header">
            <h2 className="text-h3" style={{ margin: 0 }}>People you may know</h2>
            <span className="text-secondary">See all</span>
          </div>
          <div className="suggestion-grid">
            {MOCK_SUGGESTIONS.map(person => (
              <div key={person.id} className="suggestion-card">
                <div className="suggestion-cover" style={{ backgroundColor: 'var(--color-primary-light)' }}></div>
                <div className="avatar suggestion-avatar" style={{ width: 104, height: 104, margin: '-52px auto 12px', border: '2px solid white' }}>
                  <span style={{ fontSize: 48 }}>{person.avatarEmoji}</span>
                </div>
                <div className="suggestion-info">
                  <h3 className="text-h3 text-center" style={{ margin: 0 }}>{person.name}</h3>
                  <p className="text-secondary text-center" style={{ height: 36, overflow: 'hidden' }}>{person.role}</p>
                  <p className="text-secondary text-center" style={{ fontSize: 12, margin: '8px 0' }}>{person.connections}</p>
                </div>
                <div className="suggestion-action">
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;
