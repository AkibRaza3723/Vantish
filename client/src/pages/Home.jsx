import React, { useState, useEffect, useCallback, useMemo } from 'react';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import { SkeletonCard } from '../components/SkeletonLoader';
import { postsApi } from '../api/posts';
import { Image, AlertOctagon } from 'lucide-react';
import './Home.css';

const CATEGORIES = [
  { value: 'ALL', label: 'All Posts' },
  { value: 'EXPECTATION_VS_REALITY', label: 'Expectation vs Reality' },
  { value: 'RED_FLAG', label: 'Red Flags' },
  { value: 'BURNOUT_LOG', label: 'Burnout Logs' },
  { value: 'COMPENSATION', label: 'Compensation' },
  { value: 'CULTURE', label: 'Culture' },
  { value: 'Confession', label: 'Confession' },
  { value: 'FailStory', label: 'Fail Story' },
  { value: 'General', label: 'General' }
];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFeedPosts = useCallback(async (currentPage, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError('');

    try {
      const response = await postsApi.getFeed(currentPage, 30);
      const newPosts = response.posts || [];
      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
      }
    } catch (err) {
      setError(err.message || 'Could not load feed posts. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedPosts(1, true);
  }, [fetchFeedPosts]);

  const handlePostCreated = useCallback(() => {
    setPage(1);
    fetchFeedPosts(1, true);
  }, [fetchFeedPosts]);

  const handlePostRemoved = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  // Filter posts client-side — memoized so it only recomputes when posts or category changes
  const filteredPosts = useMemo(
    () => selectedCategory === 'ALL' ? posts : posts.filter(post => post.category === selectedCategory),
    [posts, selectedCategory]
  );

  const loadMore = useCallback(() => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFeedPosts(nextPage, false);
    }
  }, [page, totalPages, loadingMore, fetchFeedPosts]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <div className="grid-layout">
      <LeftSidebar />

      <div className="feed-column">
        {/* Composer Start Card */}
        <div className="card create-post-card" style={{ padding: '16px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)' }}>
          <div className="create-post-input-container" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="avatar" style={{ width: 44, height: 44, flexShrink: 0 }}>
              <span style={{ fontSize: 22 }}>👻</span>
            </div>
            <button
              className="create-post-input"
              onClick={openModal}
              style={{
                flexGrow: 1,
                border: '1px solid var(--color-border)',
                borderRadius: '24px',
                padding: '12px 18px',
                textAlign: 'left',
                backgroundColor: 'var(--color-bg-app)',
                color: 'var(--color-text-secondary)',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Vent about your experience anonymously...
            </button>
          </div>

          <div className="create-post-actions" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
            <button className="btn-action" onClick={openModal}>
              <Image size={18} color="#38bdf8" />
              <span className="text-secondary" style={{ fontWeight: 600, fontSize: '12px' }}>Attach Media</span>
            </button>
            <button className="btn-action" onClick={openModal}>
              <AlertOctagon size={18} color="#fb7185" />
              <span className="text-secondary" style={{ fontWeight: 600, fontSize: '12px' }}>Log Burnout</span>
            </button>
          </div>
        </div>

        {/* Category Filters Carousel / Row */}
        <div className="category-filters-container" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0 12px 0', margin: '8px 0', scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '12.5px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                border: '1px solid var(--color-border)',
                backgroundColor: selectedCategory === cat.value ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: selectedCategory === cat.value ? '#ffffff' : 'var(--color-text-secondary)',
                transition: 'all 150ms ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="onboarding-error-alert" style={{ marginBottom: '16px' }}>
            {error}
            <button
              onClick={() => fetchFeedPosts(1, true)}
              style={{ display: 'block', marginTop: '8px', textDecoration: 'underline', color: 'inherit', fontWeight: 600 }}
            >
              Retry Loading Feed
            </button>
          </div>
        )}

        {/* Posts Area */}
        <div className="feed-posts">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredPosts.length > 0 ? (
            <>
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostRemoved={handlePostRemoved}
                />
              ))}

              {page < totalPages && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-card)',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    margin: '12px 0 24px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  {loadingMore ? 'Loading more posts...' : 'Show More Posts'}
                </button>
              )}
            </>
          ) : (
            <div className="card" style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🤫</span>
              <h3 className="text-h3" style={{ color: 'var(--color-text-primary)', marginBottom: '8px' }}>No posts found</h3>
              <p style={{ fontSize: '13px' }}>
                {selectedCategory !== 'ALL'
                  ? `Be the first to speak out in ${CATEGORIES.find(c => c.value === selectedCategory)?.label}.`
                  : 'Be the first person to speak out. Post anonymously above!'}
              </p>
            </div>
          )}
        </div>
      </div>

      <RightSidebar />

      {isModalOpen && (
        <CreatePostModal
          onClose={closeModal}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default Home;
