const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// 所有路由都需要验证token和管理员权限
router.use(authenticateToken);
router.use(isAdmin);

// 获取所有用户
router.get('/', userController.getAllUsers);

// 创建新用户
router.post('/', userController.createUser);

// 更新用户信息
router.put('/:id', userController.updateUser);

// 删除用户
router.delete('/:id', userController.deleteUser);

module.exports = router; 