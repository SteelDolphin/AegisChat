const mongoose = require('mongoose');

// 消息模式
const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  }
});

// 对话模式
const ConversationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  rootMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// 创建模型
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);

// 导出模型
module.exports = { Message, Conversation };