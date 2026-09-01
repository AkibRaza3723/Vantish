import React, { useState, useEffect, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, AlertTriangle, Trash2, Send, X } from 'lucide-react';
import { votesApi } from '../api/votes';
import { commentsApi } from '../api/comments';
import { postsApi } from '../api/posts';
import { useAuth } from './AuthContext';
import { useToast } from './Toast';
import { getAvatarUrl } from '../lib/avatar';
import './PostCard.css';

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
};

// Moved outside — never recreated
const renderCategoryName = (cat) => cat ? cat.replace(/_/g, ' ') : '';

const PostCard = memo(({ post, onPostRemoved }) => {
  const { user: currentUser } = useAuth();
  const { toast, confirm } = useToast();
  
  // Voting States
  const [votedState, setVotedState] = useState(null); // 'RELATED', 'NOT_RELATED', or null
  const [relatedCount, setRelatedCount] = useState(post.related || 0);
  const [notRelatedCount, setNotRelatedCount] = useState(post.notRelated || 0);
  
  // Comments States
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentsCount, setCommentsCount] = useState(post._count?.comments || 0);

  useEffect(() => {
    setCommentsCount(post._count?.comments || 0);
  }, [post.id, post._count?.comments]);
  
  // Modals and Reporting
  const [showReportPostModal, setShowReportPostModal] = useState(false);
  const [showReportCommentModal, setShowReportCommentModal] = useState(false);
  const [reportingCommentId, setReportingCommentId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportError, setReportError] = useState('');
  const [reportedPosts, setReportedPosts] = useState({}); // Keep track of reported items locally

  // Fetch current user's vote on mount
  useEffect(() => {
    const fetchUserVote = async () => {
      try {
        const response = await votesApi.getMyVoteOnPost(post.id);
        if (response && response.voted) {
          setVotedState(response.voteType);
        }
      } catch (err) {
        console.error('Failed to fetch user vote:', err);
      }
    };
    fetchUserVote();
  }, [post.id]);

  // Load comments — stable ref so effects don't loop
  const loadComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const response = await commentsApi.getComments(post.id);
      setComments(response.comments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  }, [post.id]);

  // Load comments when panel is opened
  useEffect(() => {
    if (showComments) loadComments();
  }, [showComments, loadComments]);

  // Voting handler with optimistic updates
  const handleVote = async (type) => {
    const previousVotedState = votedState;
    const previousRelated = relatedCount;
    const previousNotRelated = notRelatedCount;

    // Optimistic calculation
    if (votedState === type) {
      // Toggle off the same vote
      setVotedState(null);
      if (type === 'RELATED') setRelatedCount(prev => Math.max(0, prev - 1));
      if (type === 'NOT_RELATED') setNotRelatedCount(prev => Math.max(0, prev - 1));
    } else {
      // Toggle on, or change vote
      setVotedState(type);
      if (type === 'RELATED') {
        setRelatedCount(prev => prev + 1);
        if (previousVotedState === 'NOT_RELATED') setNotRelatedCount(prev => Math.max(0, prev - 1));
      } else {
        setNotRelatedCount(prev => prev + 1);
        if (previousVotedState === 'RELATED') setRelatedCount(prev => Math.max(0, prev - 1));
      }
    }

    try {
      await votesApi.castOrToggleVote(post.id, type);
    } catch (err) {
      // Revert state on failure
      setVotedState(previousVotedState);
      setRelatedCount(previousRelated);
      setNotRelatedCount(previousNotRelated);
      toast.error('Failed to cast vote: ' + err.message);
    }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const tempText = newCommentText;
    setNewCommentText('');

    try {
      const response = await commentsApi.createComment(post.id, tempText);
      if (response && response.comment) {
        // Prepend new comment
        setComments(prev => [response.comment, ...prev]);
        setCommentsCount(prev => prev + 1);
      }
    } catch (err) {
      setNewCommentText(tempText);
      toast.error('Failed to post comment: ' + err.message);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    const ok = await confirm({
      title: 'Delete Comment',
      message: 'Are you sure you want to delete this comment? This cannot be undone.',
      variant: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
    if (!ok) return;

    try {
      await commentsApi.deleteComment(commentId);
      await loadComments();
      setCommentsCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Failed to delete comment: ' + err.message);
    }
  };

  // Report Post
  const handleReportPost = async () => {
    if (!reportReason.trim()) {
      setReportError('Please select or specify a reason');
      return;
    }
    setReportError('');

    try {
      const response = await postsApi.reportPost(post.id, reportReason);
      setShowReportPostModal(false);
      setReportReason('');
      setReportedPosts(prev => ({ ...prev, [post.id]: true }));
      
      if (response && response.autoDeleted) {
        toast.info('This post has been removed as it reached the report threshold.');
        if (onPostRemoved) onPostRemoved(post.id);
      } else {
        toast.success('Thank you. Your report has been submitted for moderation.');
      }
    } catch (err) {
      setReportError(err.message);
    }
  };

  // Report Comment
  const handleReportComment = async () => {
    if (!reportReason.trim()) {
      setReportError('Please select or specify a reason');
      return;
    }
    setReportError('');

    try {
      await commentsApi.reportComment(reportingCommentId, reportReason);
      setShowReportCommentModal(false);
      await loadComments();
      setCommentsCount(prev => Math.max(0, prev - 1));
      setReportReason('');
      setReportingCommentId(null);
      toast.success('Comment reported and hidden.');
    } catch (err) {
      setReportError(err.message);
    }
  };

  // Delete own post
  const handleDeletePost = async () => {
    const ok = await confirm({
      title: 'Delete Post',
      message: 'Are you sure you want to delete this post? This action cannot be undone.',
      variant: 'danger',
      confirmText: 'Delete Post',
      cancelText: 'Cancel',
    });
    if (!ok) return;
    try {
      await postsApi.deletePost(post.id);
      if (onPostRemoved) onPostRemoved(post.id);
    } catch (err) {
      toast.error('Failed to delete post: ' + err.message);
    }
  };

  const isAuthor = currentUser?.id === post.authorId;

  return (
    <div className="card post-card">
      {/* Post Header */}
      <div className="post-header">
        <Link to={`/profile/${post.authorId}`} className="avatar" style={{ width: 44, height: 44, flexShrink: 0 }}>
          <img src={post.author?.avatarUrl || getAvatarUrl(post.author?.username)} alt={post.author?.username || 'anonymous'} className="avatar-img" />
        </Link>
        
        <div className="post-meta" style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span className="text-h3" style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '15px' }}>
              Anonymous
            </span>
            {post.author?.organizations && (
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                from <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{post.author.organizations}</span>
              </span>
            )}
            <span className="text-secondary" style={{ fontSize: '11px' }}>
              • {formatRelativeTime(post.createdAt)}
            </span>
          </div>
          
          <div className="post-badges-row">
            <span className="category-badge">{renderCategoryName(post.category)}</span>
            <span className="stress-badge">Stress: {'🔥'.repeat(post.stressRating || 1)}</span>
          </div>
        </div>

        {isAuthor && (
          <button onClick={handleDeletePost} className="comment-btn-action delete" title="Delete Post" style={{ padding: '8px' }}>
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="post-body text-body">
        {post.content}
      </div>

      {/* Image if exists */}
      {post.imageUrl && (
        <div className="post-image-container">
          <img src={post.imageUrl} alt="Uploaded attachment" className="post-image" />
        </div>
      )}

      {/* Post Statistics */}
      <div className="post-stats">
        <span className="text-secondary" style={{ display: 'flex', gap: '12px' }}>
          <span>👍 {relatedCount} Related</span>
          <span>👎 {notRelatedCount} Not Related</span>
        </span>
        <span className="text-secondary" style={{ cursor: 'pointer' }} onClick={() => setShowComments(!showComments)}>
          {commentsCount} comments
        </span>
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button 
          className={`btn-action ${votedState === 'RELATED' ? 'voted-related' : ''}`}
          onClick={() => handleVote('RELATED')}
        >
          <ThumbsUp size={18} />
          <span>Related</span>
        </button>

        <button 
          className={`btn-action ${votedState === 'NOT_RELATED' ? 'voted-not-related' : ''}`}
          onClick={() => handleVote('NOT_RELATED')}
        >
          <ThumbsDown size={18} />
          <span>Not Related</span>
        </button>
        
        <button className="btn-action" onClick={() => setShowComments(!showComments)}>
          <MessageSquare size={18} />
          <span>Comment</span>
        </button>

        {!isAuthor && (
          <button 
            className="btn-action" 
            onClick={() => {
              setReportReason('');
              setReportError('');
              setShowReportPostModal(true);
            }}
            disabled={reportedPosts[post.id]}
          >
            <AlertTriangle size={18} />
            <span>{reportedPosts[post.id] ? 'Reported' : 'Report'}</span>
          </button>
        )}
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className="comments-section">
          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="comment-composer">
            <div className="avatar" style={{ width: 32, height: 32, flexShrink: 0 }}>
              <img src={currentUser?.avatarUrl || getAvatarUrl(currentUser?.username)} alt={currentUser?.username || 'anonymous'} className="avatar-img" />
            </div>
            
            <div className="comment-input-container">
              <input
                type="text"
                className="comment-input"
                placeholder="Say what you can't say publicly..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              />
              <button type="submit" className="comment-submit-btn">
                <Send size={16} />
              </button>
            </div>
          </form>

          {/* Comments List */}
          {commentsLoading ? (
            <div style={{ textAlign: 'center', padding: '12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Loading comments...
            </div>
          ) : comments.length > 0 ? (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <Link to={`/profile/${comment.authorId}`} className="avatar" style={{ width: 32, height: 32, flexShrink: 0 }}>
                    <img src={comment.author?.avatarUrl || getAvatarUrl(comment.author?.username)} alt={comment.author?.username || 'anonymous'} className="avatar-img" />
                  </Link>

                  <div className="comment-bubble">
                    <div className="comment-header">
                      <Link to={`/profile/${comment.authorId}`} className="comment-author-name" style={{ textDecoration: 'none' }}>
                        {comment.author?.username ? `@${comment.author.username}` : 'Anonymous'}
                      </Link>
                      <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
                    </div>
                    <div className="comment-body">
                      {comment.content}
                    </div>

                    <div className="comment-actions">
                      {currentUser?.id === comment.authorId ? (
                        <button 
                          onClick={() => handleDeleteComment(comment.id)} 
                          className="comment-btn-action delete"
                        >
                          Delete
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setReportingCommentId(comment.id);
                            setReportReason('');
                            setReportError('');
                            setShowReportCommentModal(true);
                          }} 
                          className="comment-btn-action"
                        >
                          Report
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              No comments yet. Be the first to speak out.
            </div>
          )}
        </div>
      )}

      {showReportPostModal && createPortal(
        <div className="vantish-modal-backdrop">
          <div className="vantish-modal card">
            <span className="modal-close-btn" onClick={() => setShowReportPostModal(false)}>
              <X size={18} />
            </span>
            <h2>Report Post</h2>
            <p className="text-secondary" style={{ marginBottom: '16px' }}>
              Why are you reporting this post? Posts with 5 or more flags are automatically deleted.
            </p>

            {reportError && <div className="onboarding-error-alert">{reportError}</div>}

            <div className="report-reasons-list">
              {[
                { key: 'harassment', label: 'Harassment or Bullying' },
                { key: 'doxxing', label: 'Sharing Private Personal Info (Doxxing)' },
                { key: 'threats', label: 'Violence or Direct Threats' },
                { key: 'false_accused', label: 'Malicious False Accusations' },
                { key: 'spam', label: 'Spam or Misleading Content' },
                { key: 'other', label: 'Other Guidelines Violation' },
              ].map((reason) => (
                <div 
                  key={reason.key} 
                  className={`report-reason-option ${reportReason === reason.label ? 'selected' : ''}`}
                  onClick={() => setReportReason(reason.label)}
                >
                  <input
                    type="radio"
                    name="report-post-reason"
                    checked={reportReason === reason.label}
                    readOnly
                  />
                  <label>{reason.label}</label>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowReportPostModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleReportPost} disabled={!reportReason}>
                Submit Report
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showReportCommentModal && createPortal(
        <div className="vantish-modal-backdrop">
          <div className="vantish-modal card">
            <span className="modal-close-btn" onClick={() => {
              setShowReportCommentModal(false);
              setReportingCommentId(null);
            }}>
              <X size={18} />
            </span>
            <h2>Report Comment</h2>
            <p className="text-secondary" style={{ marginBottom: '16px' }}>
              Why are you reporting this comment? Reported comments are hidden immediately for safety.
            </p>

            {reportError && <div className="onboarding-error-alert">{reportError}</div>}

            <div className="report-reasons-list">
              {[
                { key: 'harassment', label: 'Harassment or Bullying' },
                { key: 'doxxing', label: 'Sharing Private Personal Info' },
                { key: 'abuse', label: 'Hate speech or abuse' },
                { key: 'spam', label: 'Spam' },
              ].map((reason) => (
                <div 
                  key={reason.key} 
                  className={`report-reason-option ${reportReason === reason.label ? 'selected' : ''}`}
                  onClick={() => setReportReason(reason.label)}
                >
                  <input
                    type="radio"
                    name="report-comment-reason"
                    checked={reportReason === reason.label}
                    readOnly
                  />
                  <label>{reason.label}</label>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => {
                setShowReportCommentModal(false);
                setReportingCommentId(null);
              }}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleReportComment} disabled={!reportReason}>
                Submit Report
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
