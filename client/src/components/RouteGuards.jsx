import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Protect routes that require login and completed onboarding
export const ProtectedRoute = ({ children }) => {
  const { session, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg-app)', color: 'var(--color-text-primary)' }}>
        <div className="shimmer-card" style={{ width: '100px', height: '100px', borderRadius: '50%' }}>Loading Vantish...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  // If session exists but custom profile lacks username/role, force onboarding
  if (!user || !user.username || !user.role) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Protect the onboarding screen
export const OnboardingRoute = ({ children }) => {
  const { session, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg-app)', color: 'var(--color-text-primary)' }}>
        <div>Loading Onboarding...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  // If onboarding is already completed, redirect to feed
  if (user && user.username && user.role) {
    return <Navigate to="/feed" replace />;
  }

  return children;
};

// Route wrapper for guest pages (Landing, Signin, Signup)
export const PublicRoute = ({ children }) => {
  const { session, user, loading } = useAuth();

  if (loading) {
    return null; // Silent load
  }

  if (session) {
    if (user && user.username && user.role) {
      return <Navigate to="/feed" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return children;
};
