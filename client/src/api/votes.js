import { apiFetch } from './client';

export const votesApi = {
  // Cast, change, or remove a vote (RELATED or NOT_RELATED)
  castOrToggleVote: async (postId, voteType) => {
    return apiFetch(`/post/${postId}/vote`, {
      method: 'POST',
      body: { voteType },
    });
  },

  // Get all votes for a post
  getVotesForPost: async (postId) => {
    return apiFetch(`/post/${postId}/votes`);
  },

  // Get current user's vote on a post
  getMyVoteOnPost: async (postId) => {
    return apiFetch(`/post/${postId}/votes/me`);
  },
};
