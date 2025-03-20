const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  // 登录
  async login(req, res) {
    try {
      const { username, password } = req.body;
      console.log('=== Login Attempt Debug ===');
      console.log('Username:', username);
      console.log('Password:', password);

      // 查找用户
      const user = await User.findOne({ username });
      if (!user) {
        console.log('User not found:', username);
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      console.log('User found:', {
        id: user._id,
        username: user.username,
        role: user.role,
        hashedPassword: user.password
      });

      console.log('Attempting password comparison...');
      // 验证密码
      const isValidPassword = await user.comparePassword(password);
      console.log('Password comparison result:', isValidPassword);

      if (!isValidPassword) {
        console.log('Invalid password for user:', username);
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // 生成JWT令牌
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      console.log('Login successful for user:', username);
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
      console.log('=== Registration Attempt Debug ===');
      console.log('Username:', username);
      console.log('Password:', password);

      // 检查用户名是否已存在
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log('Username already exists:', username);
        return res.status(400).json({ message: '用户名已存在' });
      }

      // 创建新用户（密码加密由模型中间件处理）
      const user = new User({
        username,
        password,
        role: 'user'
      });

      console.log('Saving new user...');
      await user.save();
      console.log('User saved successfully:', {
        id: user._id,
        username: user.username,
        role: user.role,
        hashedPassword: user.password
      });

      // 生成JWT令牌
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      console.log('Registration successful for user:', username);
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