import api from './axiosConfig';

export const conversationService = {
  // Create a new conversation
  async createConversation(userId, title) {
    try {
      const response = await api.post('/conversations', {
        userId,
        title: title || `新会话 ${new Date().toLocaleString()}`
      });
      return response.data;
    } catch (error) {
      console.error('Create conversation error:', error);
      throw new Error('创建会话失败: ' + (error.response?.data?.error || error.message));
    }
  },

  // Get all conversations for a user (excluding deleted ones)
  async getUserConversations(userId) {
    try {
      if (!userId) {
        throw new Error('userId is required');
      }
      // 确保路径与后端路由匹配
      const response = await api.get(`/conversations/user/${userId}/conversations`);
      return response.data;
    } catch (error) {
      console.error('Get conversations error:', error);
      throw new Error('获取会话列表失败: ' + (error.response?.data?.message || error.message));
    }
  },

  // Get a single conversation by ID
  async getConversation(conversationId) {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      throw new Error('获取会话详情失败: ' + error.message);
    }
  },

  // Add a message to a conversation
  async addMessage(conversationId, role, content) {
    try {
      const response = await api.post(`/conversations/${conversationId}/messages`, {
        role,
        content
      });
      return response.data;
    } catch (error) {
      throw new Error('发送消息失败: ' + error.message);
    }
  },

  // Soft delete a conversation
  async deleteConversation(conversationId) {
    try {
      const response = await api.delete(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      throw new Error('删除会话失败: ' + error.message);
    }
  },

  // Update conversation title
  async updateTitle(conversationId, title) {
    try {
      const response = await api.put(`/conversations/${conversationId}/title`, {
        title
      });
      return response.data;
    } catch (error) {
      throw new Error('更新标题失败: ' + error.message);
    }
  }
}; 