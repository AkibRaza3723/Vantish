import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RightSidebar from '../components/RightSidebar';
import { connectionsApi } from '../api/connections';
import { Check, X, Users, AlertCircle } from 'lucide-react';
import './Network.css';

const Network = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNetworkData = async () => {
    setLoading(true);
    setError('');
    try {
      const [pendingRes, connectionsRes] = await Promise.all([
        connectionsApi.getPendingRequests(),
        connectionsApi.getMyConnections()
      ]);
      setPendingRequests(pendingRes.requests || []);
      setConnections(connectionsRes.connections || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve connections data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      await connectionsApi.respondToRequest(requestId, 'ACCEPTED');
      // Remove from pending in UI and reload data
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      fetchNetworkData();
    } catch (err) {
      alert('Failed to accept connection: ' + err.message);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await connectionsApi.respondToRequest(requestId, 'REJECTED'); // or delete directly
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      // Rejections can also delete the connection request
      try {
        await connectionsApi.removeConnection(requestId);
        setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      } catch (e) {
        alert('Failed to ignore request: ' + err.message);
      }
    }
  };

  const handleDisconnect = async (connectionId) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) return;
    try {
      await connectionsApi.removeConnection(connectionId);
      setConnections(prev => prev.filter(c => c.connectionId !== connectionId));
    } catch (err) {
      alert('Failed to disconnect: ' + err.message);
    }
  };

  return (
    <div className="grid-layout">
      <div className="network-main-column">
        {error && (
          <div className="onboarding-error-alert" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Pending Requests Section */}
        <div className="card network-section-card" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)' }}>
          <div className="network-section-header">
            <h2 className="text-h2">Pending Invitations ({pendingRequests.length})</h2>
          </div>
          
          {loading ? (
            <div className="network-loader">Loading pending requests...</div>
          ) : pendingRequests.length > 0 ? (
            <div className="pending-requests-list">
              {pendingRequests.map((request) => (
                <div key={request.id} className="pending-request-item">
                  <Link to={`/profile/${request.sender?.id}`} className="avatar" style={{ width: 48, height: 48, flexShrink: 0 }}>
                    {request.sender?.image ? (
                      <img src={request.sender.image} alt={request.sender.name} className="avatar-img" />
                    ) : (
                      <span style={{ fontSize: 24 }}>👻</span>
                    )}
                  </Link>

                  <div className="request-user-info" style={{ flexGrow: 1 }}>
                    <Link to={`/profile/${request.sender?.id}`} className="request-user-name" style={{ textDecoration: 'none', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      {request.sender?.name || 'Anonymous User'}
                    </Link>
                    <span className="request-user-meta" style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      @{request.sender?.username} • at {request.sender?.organizations}
                    </span>
                  </div>

                  <div className="request-actions">
                    <button 
                      className="btn-action-circle reject"
                      onClick={() => handleRejectRequest(request.id)}
                      title="Ignore Invitation"
                    >
                      <X size={18} />
                    </button>
                    <button 
                      className="btn-action-circle accept"
                      onClick={() => handleAcceptRequest(request.id)}
                      title="Accept Invitation"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="network-empty-state">
              No pending connection requests.
            </div>
          )}
        </div>

        {/* Active Connections Section */}
        <div className="card network-section-card" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)', marginTop: '16px' }}>
          <div className="network-section-header">
            <h2 className="text-h2">My Connections ({connections.length})</h2>
          </div>

          {loading ? (
            <div className="network-loader">Loading connections list...</div>
          ) : connections.length > 0 ? (
            <div className="connections-grid">
              {connections.map((conn) => (
                <div key={conn.connectionId} className="connection-card-item">
                  <div className="connection-card-cover" style={{ backgroundColor: 'var(--color-primary-light)' }}></div>
                  <div className="connection-card-body">
                    <Link to={`/profile/${conn.user?.id}`} className="avatar connection-avatar" style={{ width: 64, height: 64, border: '3px solid var(--color-bg-card)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                      {conn.user?.image ? (
                        <img src={conn.user.image} alt={conn.user.name} className="avatar-img" />
                      ) : (
                        <span style={{ fontSize: 32 }}>👻</span>
                      )}
                    </Link>
                    
                    <Link to={`/profile/${conn.user?.id}`} className="connection-name" style={{ textDecoration: 'none', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      {conn.user?.name || 'Anonymous User'}
                    </Link>
                    
                    <span className="connection-username" style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', display: 'block', margin: '2px 0 6px 0' }}>
                      @{conn.user?.username}
                    </span>

                    <span className="connection-role" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block', height: '36px', overflow: 'hidden', padding: '0 8px' }}>
                      at {conn.user?.organizations || 'Unspecified Org'}
                    </span>

                    <div className="connection-card-footer" style={{ borderTop: '1px solid var(--color-border)', marginTop: '12px', paddingTop: '10px' }}>
                      <button 
                        className="btn-disconnect" 
                        onClick={() => handleDisconnect(conn.connectionId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="network-empty-state" style={{ padding: '40px 16px' }}>
              <Users size={36} style={{ color: 'var(--color-text-disabled)', marginBottom: '8px' }} />
              <p>No connections yet. Expand your network by searching profiles.</p>
            </div>
          )}
        </div>
      </div>
      
      <RightSidebar />
    </div>
  );
};

export default Network;
