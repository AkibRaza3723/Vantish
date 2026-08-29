import { apiFetch } from './client';

export const connectionsApi = {
  // Get list of accepted connections
  getMyConnections: async () => {
    return apiFetch('/connection/my-connections');
  },

  // Get list of pending incoming connection requests
  getPendingRequests: async () => {
    return apiFetch('/connection/pending');
  },

  // Send a connection request to a user
  sendRequest: async (receiverId) => {
    return apiFetch(`/connection/send/${receiverId}`, {
      method: 'POST',
    });
  },

  // Respond (Accept/Reject) to a connection request
  respondToRequest: async (connectionId, action) => {
    return apiFetch(`/connection/respond/${connectionId}`, {
      method: 'PATCH',
      body: { action }, // action must be ACCEPTED or REJECTED
    });
  },

  // Remove/Withdraw a connection request or relationship
  removeConnection: async (connectionId) => {
    return apiFetch(`/connection/${connectionId}`, {
      method: 'DELETE',
    });
  },
};
