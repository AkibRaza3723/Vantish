import React, { useState, useRef } from 'react';
import { X, Image, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { postsApi } from '../api/posts';
import './CreatePostModal.css';

const CATEGORIES = [
  { value: 'EXPECTATION_VS_REALITY', label: 'Expectation vs Reality' },
  { value: 'RED_FLAG', label: 'Red Flag' },
  { value: 'BURNOUT_LOG', label: 'Burnout Log' },
  { value: 'COMPENSATION', label: 'Compensation & Salary' },
  { value: 'CULTURE', label: 'Workplace Culture' }
];

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('CULTURE');
  const [stressRating, setStressRating] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('category', category);
      formData.append('stressRating', stressRating);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await postsApi.createPost(formData);
      if (onPostCreated) {
        onPostCreated();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to publish post. Please check fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container card" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="avatar" style={{ width: 44, height: 44, flexShrink: 0 }}>
              {user?.image ? (
                <img src={user.image} alt={user?.name} className="avatar-img" />
              ) : (
                <span style={{ fontSize: 22 }}>👻</span>
              )}
            </div>
            <div>
              <h3 className="text-h3" style={{ margin: 0 }}>Create anonymous post</h3>
              <span className="text-secondary" style={{ fontSize: '11px' }}>
                Posting to @{user?.username} • {user?.organizations}
              </span>
            </div>
          </div>
          <button className="btn-ghost" onClick={onClose} disabled={loading} style={{ color: 'var(--color-text-secondary)' }}>
            <X size={20} />
          </button>
        </div>
        
        {/* Form Body */}
        <form onSubmit={handlePostSubmit}>
          <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '55vh' }}>
            {error && (
              <div className="onboarding-error-alert" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Select Category */}
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label htmlFor="post-category" className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Category</label>
              <select
                id="post-category"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ padding: '8px' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stress Rating Fires */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Stress Level</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setStressRating(level)}
                    style={{
                      fontSize: '24px',
                      opacity: level <= stressRating ? 1 : 0.25,
                      filter: level <= stressRating ? 'grayscale(0%)' : 'grayscale(100%)',
                      transition: 'all 150ms ease',
                      transform: level <= stressRating ? 'scale(1.1)' : 'scale(1)'
                    }}
                    title={`Stress level ${level} of 5`}
                  >
                    🔥
                  </button>
                ))}
                <span className="text-secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
                  {stressRating === 1 && 'Chilled Out'}
                  {stressRating === 2 && 'Mildly Annoyed'}
                  {stressRating === 3 && 'Stressed'}
                  {stressRating === 4 && 'Burned Out'}
                  {stressRating === 5 && 'Exploding! 🤯'}
                </span>
              </div>
            </div>

            {/* Main Textarea */}
            <textarea
              className="post-textarea text-body"
              placeholder="What experiences or workplace frustrations do you want to share?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
              required
              style={{
                width: '100%',
                minHeight: '120px',
                backgroundColor: 'transparent',
                color: 'var(--color-text-primary)',
                border: 'none',
                resize: 'none',
                outline: 'none',
                fontSize: '14px',
              }}
            />

            {/* Image Preview */}
            {imagePreviewUrl && (
              <div style={{ position: 'relative', marginTop: '12px', border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden' }}>
                <img src={imagePreviewUrl} alt="Upload preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          
          {/* Footer Actions */}
          <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="modal-actions">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <button 
                type="button" 
                className="btn-ghost" 
                title="Add a photo"
                onClick={() => fileInputRef.current?.click()}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}
              >
                <Image size={22} />
              </button>
            </div>
            
            <button 
              type="submit"
              className="btn-primary" 
              disabled={loading || !content.trim()}
              style={{ 
                opacity: (content.trim() && !loading) ? 1 : 0.5,
                padding: '8px 24px',
                fontSize: '13px'
              }}
            >
              {loading ? 'Posting...' : 'Post Anonymously'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
