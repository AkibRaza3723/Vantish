import { apiFetch } from './client';

export const usersApi = {
  // Check/Get current user's profile
  getMe: async () => {
    return apiFetch('/user/me');
  },

  // Complete profile onboarding
  completeProfile: async (profileData) => {
    return apiFetch('/user/complete-profile', {
      method: 'POST',
      body: profileData,
    });
  },

  // Update profile details
  updateProfile: async (profileData) => {
    return apiFetch('/user/me/profile', {
      method: 'PATCH',
      body: profileData,
    });
  },

  // Get another user's public profile details
  getUserById: async (userId) => {
    return apiFetch(`/user/${userId}`);
  },

  // Delete own account
  deleteAccount: async () => {
    return apiFetch('/user/me', {
      method: 'DELETE',
    });
  },

  // Search users by username or organization name
  searchUsers: async (query) => {
    return apiFetch(`/user/search?q=${encodeURIComponent(query)}`);
  },
};
