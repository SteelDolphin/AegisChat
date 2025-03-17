const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  // 登录
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // 查找用户
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // 验证密码
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // 生成JWT令牌
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // 返回用户信息和令牌
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 注册
  async register(req, res) {
    try {
      const { username, password } = req.body;

      // 检查用户名是否已存在
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: '用户名已存在' });
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建新用户
      const user = new User({
        username,
        password: hashedPassword,
        role: 'user'
      });

      await user.save();

      // 生成JWT令牌
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // 返回用户信息和令牌
      res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 获取当前用户信息
  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: '用户不存在' });
      }
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: '服务器错误' });
    }
  }
};

module.exports = authController; 