import React from 'react';
import { Info } from 'lucide-react';
import './Sidebar.css';

const RightSidebar = () => {
  return (
    <div className="right-sidebar">
      <div className="card news-card">
        <div className="news-header">
          <h2 className="text-h3">Linkout News</h2>
          <Info size={16} color="var(--color-text-secondary)" />
        </div>
        
        <ul className="news-list">
          <li className="news-item">
            <div className="news-bullet"></div>
            <div className="news-content">
              <h3 className="text-body font-semibold" style={{ margin: 0, fontSize: 14 }}>CEO caught using ChatGPT</h3>
              <span className="text-secondary">Top news • 10,934 readers</span>
            </div>
          </li>
          <li className="news-item">
            <div className="news-bullet"></div>
            <div className="news-content">
              <h3 className="text-body font-semibold" style={{ margin: 0, fontSize: 14 }}>Another layoff at Big Tech</h3>
              <span className="text-secondary">1d ago • 5,432 readers</span>
            </div>
          </li>
          <li className="news-item">
            <div className="news-bullet"></div>
            <div className="news-content">
              <h3 className="text-body font-semibold" style={{ margin: 0, fontSize: 14 }}>Return to office mandated</h3>
              <span className="text-secondary">2d ago • 8,912 readers</span>
            </div>
          </li>
          <li className="news-item">
            <div className="news-bullet"></div>
            <div className="news-content">
              <h3 className="text-body font-semibold" style={{ margin: 0, fontSize: 14 }}>Free coffee removed from pantry</h3>
              <span className="text-secondary">3d ago • 23,101 readers</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
