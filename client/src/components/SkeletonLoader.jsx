import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="card post-card" style={{ padding: '16px', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div className="skeleton-avatar shimmer" style={{ width: '44px', height: '44px' }} />
        <div style={{ flexGrow: 1 }}>
          <div className="skeleton-title shimmer" style={{ width: '40%', height: '14px', marginBottom: '8px' }} />
          <div className="skeleton-line shimmer" style={{ width: '20%', height: '10px', margin: 0 }} />
        </div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <div className="skeleton-line shimmer" style={{ width: '90%', height: '12px' }} />
        <div className="skeleton-line shimmer" style={{ width: '95%', height: '12px' }} />
        <div className="skeleton-line shimmer" style={{ width: '60%', height: '12px' }} />
      </div>
      <div className="shimmer" style={{ width: '100%', height: '150px', borderRadius: '4px', backgroundColor: 'var(--color-border)', marginBottom: '16px' }} />
      <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
        <div className="skeleton-line shimmer" style={{ width: '20%', height: '12px', margin: 0 }} />
        <div className="skeleton-line shimmer" style={{ width: '20%', height: '12px', margin: 0 }} />
        <div className="skeleton-line shimmer" style={{ width: '20%', height: '12px', margin: 0 }} />
      </div>
    </div>
  );
};
