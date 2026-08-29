import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from '../lib/authClient';
import { usersApi } from '../api/users';
import { authApi } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data: sessionData, isPending: sessionPending } = useSession();
  const [userProfile, setUserProfile] = useState(null);
  const [profilePending, setProfilePending] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setProfilePending(true);
    try {
      const data = await usersApi.getMe();
      setUserProfile(data.user);
      setError(null);
    } catch (err) {
      // If unauthorized, it means we don't have a profile yet (or session is inactive)
      setUserProfile(null);
      if (sessionData) {
        setError(err.message);
      }
    } finally {
      setProfilePending(false);
    }
  };

  useEffect(() => {
    if (sessionPending) return;

    if (sessionData) {
      fetchProfile();
    } else {
      setUserProfile(null);
      setProfilePending(false);
    }
  }, [sessionData, sessionPending]);

  const refreshUser = async () => {
    await fetchProfile();
  };

  const logout = async () => {
    try {
      await authApi.signOut();
      setUserProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value = {
    session: sessionData?.session,
    sessionUser: sessionData?.user, // Better Auth standard fields
    user: userProfile, // Custom backend fields (username, role, etc.)
    loading: sessionPending || profilePending,
    error,
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
