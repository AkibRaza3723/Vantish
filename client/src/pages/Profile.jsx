import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import RightSidebar from '../components/RightSidebar';
import { SkeletonCard } from '../components/SkeletonLoader';
import { usersApi } from '../api/users';
import { postsApi } from '../api/posts';
import { connectionsApi } from '../api/connections';
import { useAuth } from '../components/AuthContext';
import { Edit2, UserPlus, UserCheck, UserX, Clock, Check, X } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, refreshUser: refreshAuthUser } = useAuth();
  
  const isOwnProfile = !userId || userId === currentUser?.id;
  const targetUserId = isOwnProfile ? currentUser?.id : userId;

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Connection states
  const [connectionStatus, setConnectionStatus] = useState('CONNECT'); // CONNECT, PENDING_INCOMING, PENDING_OUTGOING, CONNECTED
  const [connectionId, setConnectionId] = useState(null);
  const [connectionLoading, setConnectionLoading] = useState(false);

  // Edit Profile Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    organizations: '',
    organization_type: '',
    course: '',
    graduationYear: 2026,
    position: '',
    Experience: 0,
  });

  const fetchProfileData = async () => {
    setProfileLoading(true);
    setError('');
    try {
      let userData;
      if (isOwnProfile) {
        // Fetch full profile including private fields
        const meResponse = await usersApi.getMe();
        userData = meResponse.user;
      } else {
        // Fetch public profile
        const userResponse = await usersApi.getUserById(targetUserId);
        userData = userResponse.user;
      }
      setProfileUser(userData);

      // Pre-populate edit form
      setEditForm({
        name: userData.name || '',
        bio: userData.bio || '',
        organizations: userData.organizations || '',
        organization_type: userData.organization_type || '',
        course: userData.course || '',
        graduationYear: userData.GraduationYear || 2026,
        position: userData.position || '',
        Experience: userData.Experience || 0,
        role: userData.role || 'student'
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile user.');
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    setPostsLoading(true);
    try {
      const response = await postsApi.getPostsByUser(targetUserId);
      setUserPosts(response.posts || []);
    } catch (err) {
      console.error('Failed to load user posts:', err);
    } finally {
      setPostsLoading(false);
    }
  };

  const checkConnection = async () => {
    if (isOwnProfile) return;
    try {
      // 1. Check if connected
      const activeRes = await connectionsApi.getMyConnections();
      const activeConn = activeRes.connections?.find(c => c.user.id === targetUserId);
      if (activeConn) {
        setConnectionStatus('CONNECTED');
        setConnectionId(activeConn.connectionId);
        return;
      }

      // 2. Check if pending incoming
      const pendingRes = await connectionsApi.getPendingRequests();
      const incomingConn = pendingRes.requests?.find(r => r.sender.id === targetUserId);
      if (incomingConn) {
        setConnectionStatus('PENDING_INCOMING');
        setConnectionId(incomingConn.id);
        return;
      }

      // 3. Fallback: try sending a request (will trigger 409 if outgoing pending exists)
      // Since we don't want to spam notifications on load, we check if we have recorded
      // an outgoing request sent in this browser session, or default to CONNECT
      const sentOutgoing = sessionStorage.getItem(`sent-conn-${targetUserId}`);
      if (sentOutgoing) {
        setConnectionStatus('PENDING_OUTGOING');
        setConnectionId(sentOutgoing);
      } else {
        setConnectionStatus('CONNECT');
      }
    } catch (err) {
      console.error('Failed to resolve connection status:', err);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      fetchProfileData();
      fetchUserPosts();
      checkConnection();
    }
  }, [targetUserId, isOwnProfile]);

  // Connection Handlers
  const handleConnect = async () => {
    setConnectionLoading(true);
    try {
      const res = await connectionsApi.sendRequest(targetUserId);
      if (res && res.connection) {
        setConnectionStatus('PENDING_OUTGOING');
        setConnectionId(res.connection.id);
        sessionStorage.setItem(`sent-conn-${targetUserId}`, res.connection.id);
      }
    } catch (err) {
      // If request already exists (due to 409)
      if (err.message.includes('already exists')) {
        setConnectionStatus('PENDING_OUTGOING');
      } else {
        alert('Failed to connect: ' + err.message);
      }
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!connectionId) return;
    setConnectionLoading(true);
    try {
      await connectionsApi.respondToRequest(connectionId, 'ACCEPTED');
      setConnectionStatus('CONNECTED');
    } catch (err) {
      alert('Failed to accept: ' + err.message);
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!connectionId) return;
    if (!window.confirm('Are you sure you want to remove this connection?')) return;
    
    setConnectionLoading(true);
    try {
      await connectionsApi.removeConnection(connectionId);
      setConnectionStatus('CONNECT');
      setConnectionId(null);
      sessionStorage.removeItem(`sent-conn-${targetUserId}`);
    } catch (err) {
      alert('Failed to disconnect: ' + err.message);
    } finally {
      setConnectionLoading(false);
    }
  };

  // Edit profile form handlers
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'graduationYear' || name === 'Experience' ? Number(value) : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');

    try {
      const payload = {
        role: editForm.role,
        name: editForm.name,
        bio: editForm.bio || undefined,
        organizations: editForm.organizations,
        organization_type: editForm.organization_type,
        course: editForm.course,
      };

      if (editForm.role === 'student') {
        payload.graduationYear = Number(editForm.graduationYear);
      } else {
        payload.position = editForm.position;
        payload.Experience = Number(editForm.Experience);
      }

      await usersApi.updateProfile(payload);
      setIsEditModalOpen(false);
      
      // Refresh user profile details
      await fetchProfileData();
      await refreshAuthUser();
    } catch (err) {
      setEditError(err.message || 'Failed to update profile.');
    } finally {
      setEditLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="grid-layout">
        <div className="profile-main-column">
          <div className="card" style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Loading Profile...
          </div>
        </div>
        <RightSidebar />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="grid-layout">
        <div className="profile-main-column">
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Profile Not Found</h2>
            <p className="text-secondary" style={{ marginTop: '10px' }}>
              {error || 'This user does not exist or has been deleted.'}
            </p>
            <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/feed')}>
              Return to Feed
            </button>
          </div>
        </div>
        <RightSidebar />
      </div>
    );
  }

  return (
    <div className="grid-layout">
      <div className="profile-main-column">
        {/* Profile Card */}
        <div className="card profile-header-card" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)' }}>
          <div className="profile-cover" style={{ backgroundColor: 'var(--color-primary-light)' }}></div>
          <div className="profile-header-content">
            <div className="profile-avatar-container">
              <div className="avatar profile-main-avatar" style={{ backgroundColor: 'var(--color-bg-card)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                {profileUser.image ? (
                  <img src={profileUser.image} alt={profileUser.name} className="avatar-img" />
                ) : (
                  <span style={{ fontSize: 64 }}>👻</span>
                )}
              </div>
              
              {isOwnProfile && (
                <button className="btn-ghost edit-avatar-btn" onClick={() => setIsEditModalOpen(true)}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            
            <div className="profile-info-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 className="text-h1" style={{ margin: 0 }}>
                    {profileUser.username ? `@${profileUser.username}` : (profileUser.name || 'User')}
                  </h1>
                  {profileUser.name && profileUser.name !== profileUser.username && profileUser.name !== 'Anonymous User' && (
                    <p className="text-secondary" style={{ fontSize: '14px', marginTop: '2px' }}>
                      {profileUser.name}
                    </p>
                  )}
                </div>
                
                {/* Connection button actions */}
                {!isOwnProfile && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {connectionStatus === 'CONNECT' && (
                      <button className="btn-primary" onClick={handleConnect} disabled={connectionLoading}>
                        <UserPlus size={16} style={{ marginRight: '8px' }} />
                        {connectionLoading ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                    
                    {connectionStatus === 'PENDING_OUTGOING' && (
                      <button className="btn-secondary" style={{ border: '1px solid var(--color-border)' }} onClick={handleDisconnect} disabled={connectionLoading}>
                        <Clock size={16} style={{ marginRight: '8px', color: 'var(--color-accent-amber)' }} />
                        Pending Request
                      </button>
                    )}
                    
                    {connectionStatus === 'PENDING_INCOMING' && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-primary" onClick={handleAcceptRequest} disabled={connectionLoading}>
                          <Check size={16} style={{ marginRight: '6px' }} />
                          Accept
                        </button>
                        <button className="btn-secondary" style={{ border: '1px solid var(--color-border)' }} onClick={handleDisconnect} disabled={connectionLoading}>
                          Reject
                        </button>
                      </div>
                    )}
                    
                    {connectionStatus === 'CONNECTED' && (
                      <button className="btn-secondary" style={{ border: '1px solid var(--color-accent-coral)', color: 'var(--color-accent-coral)' }} onClick={handleDisconnect} disabled={connectionLoading}>
                        <UserX size={16} style={{ marginRight: '8px' }} />
                        Disconnect
                      </button>
                    )}
                  </div>
                )}

                {isOwnProfile && (
                  <button className="btn-secondary" style={{ border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }} onClick={() => setIsEditModalOpen(true)}>
                    <Edit2 size={16} style={{ marginRight: '8px' }} />
                    Edit Profile
                  </button>
                )}
              </div>
              
              <p className="text-body" style={{ fontSize: '15px', marginTop: '12px', fontWeight: 500 }}>
                {profileUser.role === 'student' ? 'Student' : profileUser.position || 'Professional'} at {profileUser.organizations || 'Unspecified'}
              </p>
              
              <p className="text-secondary" style={{ marginTop: '4px' }}>
                Major/Course: {profileUser.course} • Organization Type: {profileUser.organization_type}
              </p>
              
              {profileUser.role === 'student' ? (
                <p className="text-secondary" style={{ marginTop: '2px' }}>
                  Graduating: {profileUser.GraduationYear}
                </p>
              ) : (
                <p className="text-secondary" style={{ marginTop: '2px' }}>
                  Years of Experience: {profileUser.Experience} yrs
                </p>
              )}
            </div>
          </div>
        </div>

        {/* About Card */}
        {profileUser.bio && (
          <div className="card profile-section-card" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)', marginTop: '12px' }}>
            <h2 className="text-h2">About</h2>
            <p className="text-body" style={{ marginTop: '8px', lineHeight: 1.5 }}>
              {profileUser.bio}
            </p>
          </div>
        )}

        {/* Activity Card */}
        <div className="card profile-section-card" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)', marginTop: '12px' }}>
          <h2 className="text-h2" style={{ marginBottom: '16px' }}>Posts Created ({profileUser._count?.posts || userPosts.length})</h2>
          
          <div className="profile-posts">
            {postsLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : userPosts.length > 0 ? (
              userPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={{ ...post, author: profileUser }} // Inject full author object
                  onPostRemoved={(id) => setUserPosts(prev => prev.filter(p => p.id !== id))}
                />
              ))
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                No posts published yet.
              </div>
            )}
          </div>
        </div>
      </div>
      
      <RightSidebar />

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="vantish-modal-backdrop">
          <div className="vantish-modal card" style={{ backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)', maxHeight: '90vh', overflowY: 'auto' }}>
            <span className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>
              <X size={20} />
            </span>
            <h2>Edit Profile Details</h2>
            
            {editError && <div className="onboarding-error-alert">{editError}</div>}
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-name">Display Name</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  className="form-input"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-organizations">
                  {editForm.role === 'student' ? 'College/University' : 'Company/Employer'}
                </label>
                <input
                  type="text"
                  id="edit-organizations"
                  name="organizations"
                  className="form-input"
                  value={editForm.organizations}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-org-type">Organization Type</label>
                <select
                  id="edit-org-type"
                  name="organization_type"
                  className="form-input"
                  value={editForm.organization_type}
                  onChange={handleEditChange}
                  required
                >
                  <option value="College">College</option>
                  <option value="University">University</option>
                  <option value="Startup">Startup</option>
                  <option value="MNC">MNC</option>
                  <option value="Agency">Agency</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-course">Course / Department</label>
                <input
                  type="text"
                  id="edit-course"
                  name="course"
                  className="form-input"
                  value={editForm.course}
                  onChange={handleEditChange}
                  required
                />
              </div>

              {editForm.role === 'student' ? (
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-grad">Graduation Year</label>
                  <input
                    type="number"
                    id="edit-grad"
                    name="graduationYear"
                    className="form-input"
                    value={editForm.graduationYear}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-position">Position Title</label>
                    <input
                      type="text"
                      id="edit-position"
                      name="position"
                      className="form-input"
                      value={editForm.position}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-experience">Years of Experience</label>
                    <input
                      type="number"
                      id="edit-experience"
                      name="Experience"
                      className="form-input"
                      value={editForm.Experience}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="edit-bio">Bio</label>
                <textarea
                  id="edit-bio"
                  name="bio"
                  className="form-textarea"
                  rows="3"
                  maxLength="300"
                  value={editForm.bio}
                  onChange={handleEditChange}
                />
              </div>

              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)} disabled={editLoading}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
