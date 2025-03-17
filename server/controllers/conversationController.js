const Conversation = require('../models/Conversation');

const conversationController = {
  // 创建新对话
  async createConversation(req, res) {
    try {
      const { userId, title } = req.body;
      
      // 验证必需的字段
      if (!userId || !title) {
        return res.status(400).json({ error: 'userId and title are required' });
      }

      // 创建新对话
      const conversation = new Conversation({
        userId,
        title,
        messages: []
      });

      await conversation.save();
      res.status(201).json(conversation);
    } catch (error) {
      console.error('Create conversation error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // 获取用户的所有对话
  async getUserConversations(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

      const conversations = await Conversation.find({ userId })
        .sort({ updatedAt: -1 })
        .select('_id title messages updatedAt');

      res.json(conversations);
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // 获取单个对话
  async getConversation(req, res) {
    try {
      const { conversationId } = req.params;
      if (!conversationId) {
        return res.status(400).json({ error: 'conversationId is required' });
      }
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      res.json(conversation);
    } catch (error) {
      console.error('Get conversation error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // 添加消息到对话
  async addMessage(req, res) {
    try {
      const { conversationId } = req.params;
      const { role, content } = req.body;
      if (!conversationId || !role || !content) {
        return res.status(400).json({ error: 'conversationId, role, and content are required' });
      }
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      conversation.messages.push({ role, content });
      conversation.updatedAt = new Date();
      await conversation.save();
      res.json(conversation);
    } catch (error) {
      console.error('Add message error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // 删除对话
  async deleteConversation(req, res) {
    try {
      const { conversationId } = req.params;
      if (!conversationId) {
        return res.status(400).json({ error: 'conversationId is required' });
      }
      const conversation = await Conversation.findByIdAndDelete(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      res.json(conversation);
    } catch (error) {
      console.error('Delete conversation error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // 更新对话标题
  async updateTitle(req, res) {
    try {
      const { conversationId } = req.params;
      const { title } = req.body;
      if (!conversationId || !title) {
        return res.status(400).json({ error: 'conversationId and title are required' });
      }
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      conversation.title = title;
      conversation.updatedAt = new Date();
      await conversation.save();
      res.json(conversation);
    } catch (error) {
      console.error('Update title error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = conversationController; 