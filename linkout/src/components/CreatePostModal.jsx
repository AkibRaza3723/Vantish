import React, { useState } from 'react';
import { X, Image, Video, Calendar, MoreHorizontal } from 'lucide-react';
import './CreatePostModal.css';

const CreatePostModal = ({ onClose }) => {
  const [content, setContent] = useState('');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="avatar" style={{ width: 48, height: 48 }}>
              <span style={{ fontSize: 24 }}>👻</span>
            </div>
            <div>
              <h3 className="text-h2" style={{ margin: 0 }}>Create an anonymous post</h3>
              <span className="text-secondary">Posting as "Ghost User"</span>
            </div>
          </div>
          <button className="btn-ghost" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <textarea
            className="post-textarea text-body"
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="modal-footer">
          <div className="modal-actions">
            <button className="btn-ghost" title="Add a photo">
              <Image size={24} color="var(--color-text-secondary)" />
            </button>
            <button className="btn-ghost" title="Add a video">
              <Video size={24} color="var(--color-text-secondary)" />
            </button>
            <button className="btn-ghost" title="Create an event">
              <Calendar size={24} color="var(--color-text-secondary)" />
            </button>
            <button className="btn-ghost" title="More options">
              <MoreHorizontal size={24} color="var(--color-text-secondary)" />
            </button>
          </div>
          <button 
            className="btn-primary" 
            disabled={!content.trim()}
            style={{ opacity: content.trim() ? 1 : 0.5 }}
            onClick={onClose}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
