const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 获取所有用户
exports.getAllUsers = async (req, res) => {
  try {
    // 排除密码字段，并按创建时间降序排序
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ message: '获取用户列表失败' });
  }
};

// 创建新用户
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: '邮箱已被注册' });
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user' // 默认为普通用户
    });

    await newUser.save();
    
    // 返回用户信息时排除密码
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({ message: '创建用户失败' });
  }
};

// 更新用户信息
exports.updateUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const userId = req.params.id;

    // 检查用户是否存在
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 检查用户名是否已被其他用户使用
    if (username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: '用户名已存在' });
      }
    }

    // 检查邮箱是否已被其他用户使用
    if (email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: '邮箱已被注册' });
      }
    }

    // 更新用户信息
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, role },
      { new: true, select: '-password' }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({ message: '更新用户失败' });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 检查用户是否存在
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 防止删除最后一个管理员
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: '无法删除最后一个管理员账户' });
      }
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ message: '删除用户失败' });
  }
}; 