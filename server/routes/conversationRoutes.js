const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const { authenticateToken } = require('../middleware/auth');

// 所有路由都需要认证
router.use(authenticateToken);

// 获取用户会话列表
router.get('/user/:userId/conversations', conversationController.getUserConversations);

// 其他路由
router.post('/', conversationController.createConversation);
router.get('/:conversationId', conversationController.getConversation);
router.post('/:conversationId/messages', conversationController.addMessage);
router.delete('/:conversationId', conversationController.deleteConversation);
router.put('/:conversationId/title', conversationController.updateTitle);

module.exports = router; 