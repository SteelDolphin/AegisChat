const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    console.log('正在连接到 MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/react-chat', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 超时时间设置为 5 秒
      socketTimeoutMS: 45000, // Socket 超时
    });
    console.log('MongoDB 连接成功');

    // 检查是否已存在管理员用户
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('管理员用户已存在');
      process.exit(0);
    }

    // 创建管理员用户
    const adminUser = new User({
      username: 'admin',
      password: 'admin123', // 这个密码会被自动加密
      role: 'admin'
    });

    await adminUser.save();
    console.log('管理员用户创建成功');
    console.log('用户名: admin');
    console.log('密码: admin123');
  } catch (error) {
    console.error('创建管理员用户失败:', error);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('无法连接到 MongoDB，请确保：');
      console.error('1. MongoDB 服务已启动');
      console.error('2. MongoDB 正在监听默认端口 27017');
      console.error('3. 没有防火墙阻止连接');
    }
  } finally {
    try {
      await mongoose.disconnect();
      console.log('已断开 MongoDB 连接');
    } catch (error) {
      console.error('断开连接时出错:', error);
    }
    process.exit(1);
  }
};

createAdminUser(); 