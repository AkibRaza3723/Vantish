import { apiFetch } from './client';

export const notificationsApi = {
  // Get paginated notifications
  getNotifications: async (page = 1, limit = 20) => {
    return apiFetch(`/notification?page=${page}&limit=${limit}`);
  },

  // Get count of unread notifications
  getUnreadCount: async () => {
    return apiFetch('/notification/unread-count');
  },

  // Mark a single notification as read
  markAsRead: async (id) => {
    return apiFetch(`/notification/${id}/read`, {
      method: 'PATCH',
    });
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return apiFetch('/notification/read-all', {
      method: 'PATCH',
    });
  },
};
