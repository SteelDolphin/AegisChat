const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hash');
    return next();
  }
  
  try {
    // 检查密码是否已经是哈希格式
    if (this.password.startsWith('$2a$')) {
      console.log('Password is already hashed, skipping hash');
      return next();
    }

    console.log('Password before hashing:', this.password);
    const salt = await bcrypt.genSalt(10);
    console.log('Generated salt:', salt);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password after hashing:', this.password);
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error);
  }
});

// 验证密码方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('=== Password Comparison Debug ===');
    console.log('Candidate password:', candidatePassword);
    console.log('Stored hashed password:', this.password);
    
    // 验证存储的密码格式
    if (!this.password.startsWith('$2a$')) {
      console.error('Invalid password hash format!');
      return false;
    }
    
    // 使用 bcrypt.compare 比较明文密码和哈希密码
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', result);
    
    return result;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema); 