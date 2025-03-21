import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.error || error.message || '请求失败';
    console.error('API Error:', error.response?.data || error);
    return Promise.reject(new Error(errorMessage));
  }
);

export const conversationApi = {
  // Create a new conversation
  createConversation: async (userId, title) => {
    try {
      const response = await api.post('/conversations', { userId, title });
      return response.data;
    } catch (error) {
      throw new Error(`创建会话失败: ${error.message}`);
    }
  },

  // Get all conversations for a user
  getUserConversations: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/conversations`);
      return response.data;
    } catch (error) {
      throw new Error(`获取会话列表失败: ${error.message}`);
    }
  },

  // Get a single conversation
  getConversation: async (conversationId) => {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      throw new Error(`获取会话详情失败: ${error.message}`);
    }
  },

  // Add a message to a conversation
  addMessage: async (conversationId, role, content) => {
    try {
      const response = await api.post(`/conversations/${conversationId}/messages`, {
        role,
        content,
      });
      return response.data;
    } catch (error) {
      throw new Error(`添加消息失败: ${error.message}`);
    }
  },

  // Delete a conversation (soft delete)
  deleteConversation: async (conversationId) => {
    try {
      const response = await api.delete(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      throw new Error(`删除会话失败: ${error.message}`);
    }
  },

  // Update conversation title
  updateTitle: async (conversationId, title) => {
    try {
      const response = await api.put(`/conversations/${conversationId}/title`, {
        title,
      });
      return response.data;
    } catch (error) {
      throw new Error(`更新会话标题失败: ${error.message}`);
    }
  },
};

export default api; 