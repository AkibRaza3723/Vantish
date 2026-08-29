import { apiFetch } from './client';

export const postsApi = {
  // Get paginated post feed
  getFeed: async (page = 1, limit = 10) => {
    return apiFetch(`/post/feed?page=${page}&limit=${limit}`);
  },

  // Get single post details
  getPostById: async (postId) => {
    return apiFetch(`/post/${postId}`);
  },

  // Get posts created by a specific user
  getPostsByUser: async (userId, page = 1, limit = 10) => {
    return apiFetch(`/post/user/${userId}?page=${page}&limit=${limit}`);
  },

  // Create a new post (handles text and image file upload via FormData)
  createPost: async (formData) => {
    return apiFetch('/post', {
      method: 'POST',
      body: formData, // FormData will automatically set the correct headers
    });
  },

  // Update a post
  updatePost: async (postId, postData) => {
    return apiFetch(`/post/${postId}`, {
      method: 'PUT',
      body: postData,
    });
  },

  // Delete a post
  deletePost: async (postId) => {
    return apiFetch(`/post/${postId}`, {
      method: 'DELETE',
    });
  },

  // Report a post
  reportPost: async (postId, reason) => {
    return apiFetch(`/post/${postId}/report`, {
      method: 'POST',
      body: { reason },
    });
  },
};
