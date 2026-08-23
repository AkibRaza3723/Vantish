import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send } from 'lucide-react';
import './PostCard.css';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div className="card post-card">
      <div className="post-header">
        <div className="avatar" style={{ width: 48, height: 48 }}>
          <span style={{ fontSize: 24 }}>{post.avatarEmoji || '👤'}</span>
        </div>
        <div className="post-meta">
          <h3 className="text-h3" style={{ margin: 0 }}>{post.author}</h3>
          <span className="text-secondary">{post.role}</span>
          <span className="text-secondary">{post.time} • 🌐</span>
        </div>
      </div>
      
      <div className="post-body text-body">
        {post.content}
      </div>

      <div className="post-stats">
        <span className="text-secondary">
          <ThumbsUp size={12} style={{ marginRight: 4, color: 'var(--color-primary)' }} />
          {post.likes + (liked ? 1 : 0)}
        </span>
        <span className="text-secondary">{post.comments} comments • {post.shares} reposts</span>
      </div>

      <div className="post-actions">
        <div 
          className="action-button-container"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {showReactions && (
            <div className="reactions-popover">
              <span className="reaction-emoji" onClick={() => setLiked(true)}>👍</span>
              <span className="reaction-emoji" onClick={() => setLiked(true)}>👏</span>
              <span className="reaction-emoji" onClick={() => setLiked(true)}>😂</span>
              <span className="reaction-emoji" onClick={() => setLiked(true)}>🤯</span>
            </div>
          )}
          <button 
            className={`btn-action ${liked ? 'liked' : ''}`}
            onClick={() => setLiked(!liked)}
          >
            <ThumbsUp size={24} />
            <span>Like</span>
          </button>
        </div>
        
        <button className="btn-action">
          <MessageSquare size={24} />
          <span>Comment</span>
        </button>
        
        <button className="btn-action">
          <Repeat2 size={24} />
          <span>Repost</span>
        </button>
        
        <button className="btn-action">
          <Send size={24} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
