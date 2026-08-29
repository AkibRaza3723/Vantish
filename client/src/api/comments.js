import { apiFetch } from './client';

export const commentsApi = {
  // Add a comment to a post
  createComment: async (postId, content) => {
    return apiFetch('/comment', {
      method: 'POST',
      body: { postId, content },
    });
  },

  // Edit an existing comment
  updateComment: async (commentId, content) => {
    return apiFetch(`/comment/${commentId}`, {
      method: 'PATCH',
      body: { content },
    });
  },

  // Get comments for a post
  getComments: async (postId) => {
    return apiFetch(`/comment/${postId}`);
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    return apiFetch(`/comment/${commentId}`, {
      method: 'DELETE',
    });
  },

  // Report a comment (auto-hides on backend)
  reportComment: async (commentId, reason) => {
    return apiFetch(`/comment/${commentId}/report`, {
      method: 'POST',
      body: { reason },
    });
  },
};
