import { authClient } from '../lib/authClient';
import { apiFetch } from './client';

export const authApi = {
  // Signs in using email and password
  signInEmail: async (email, password) => {
    return authClient.signIn.email({ email, password });
  },

  // Signs up using email, password, and name
  signUpEmail: async (email, password, name) => {
    return authClient.signUp.email({ email, password, name });
  },

  // Social sign in (Google or GitHub)
  signInSocial: async (provider) => {
    return authClient.signIn.social({
      provider,
      callbackURL: '/feed',
    });
  },

  // Logs out
  signOut: async () => {
    return authClient.signOut({
      callbackURL: '/',
    });
  },

  // Checks the active session on the backend
  getCurrentSession: async () => {
    // Better Auth utility to fetch session client-side
    return authClient.getSession();
  },
};
