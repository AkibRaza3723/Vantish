import React from 'react';
import PostCard from '../components/PostCard';
import RightSidebar from '../components/RightSidebar';
import { Edit2 } from 'lucide-react';
import './Profile.css';

const USER_POSTS = [
  {
    id: 1,
    author: 'Ghost User',
    role: 'Anonymous engineering student trying to survive DSA.',
    time: '2w',
    content: 'Just deployed to production on a Friday. See you all in the afterlife.',
    likes: 89,
    comments: 12,
    shares: 2,
    avatarEmoji: '👻'
  }
];

const Profile = () => {
  return (
    <div className="grid-layout">
      {/* Left side takes up the left sidebar + feed column on profile page (225 + 24 + 552 = 801px) */}
      <div className="profile-main-column">
        <div className="card profile-header-card">
          <div className="profile-cover"></div>
          <div className="profile-header-content">
            <div className="profile-avatar-container">
              <div className="avatar profile-main-avatar">
                <span style={{ fontSize: 64 }}>👻</span>
              </div>
              <button className="btn-ghost edit-avatar-btn">
                <Edit2 size={16} />
              </button>
            </div>
            
            <div className="profile-info-header">
              <h1 className="text-h1" style={{ margin: 0 }}>Ghost User</h1>
              <p className="text-body" style={{ fontSize: 16 }}>Anonymous engineering student trying to survive DSA.</p>
              <p className="text-secondary" style={{ marginTop: 8 }}>
                Bay Area, California • <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Contact info</span>
              </p>
              <p className="text-secondary" style={{ marginTop: 8, fontWeight: 600 }}>
                <span style={{ color: 'var(--color-primary)' }}>500+ connections</span>
              </p>
              
              <div className="profile-actions">
                <button className="btn-primary" style={{ padding: '6px 24px' }}>Open to</button>
                <button className="btn-secondary" style={{ border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                  Add profile section
                </button>
                <button className="btn-secondary" style={{ border: '1px solid var(--color-border)' }}>
                  More
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card profile-section-card">
          <h2 className="text-h2">About</h2>
          <p className="text-body" style={{ marginTop: 8 }}>
            Just a ghost wandering the halls of a CS building. I post memes, complain about leetcode, and occasionally share something useful. Do not ask for referrals, I am literally a ghost.
          </p>
        </div>

        <div className="card profile-section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="text-h2">Activity</h2>
            <button className="btn-secondary" style={{ padding: '6px 16px', borderRadius: 24, border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
              Create a post
            </button>
          </div>
          <p className="text-secondary font-semibold" style={{ margin: '4px 0 16px' }}>500 followers</p>
          
          <div className="activity-tabs">
            <button className="activity-tab active">Posts</button>
            <button className="activity-tab">Comments</button>
            <button className="activity-tab">Images</button>
          </div>
          
          <div className="profile-posts">
            {USER_POSTS.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          <div className="show-all-footer">
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Show all posts →
            </button>
          </div>
        </div>
      </div>
      
      <RightSidebar />
    </div>
  );
};

export default Profile;
