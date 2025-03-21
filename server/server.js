const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const { SERVER_CONFIG, CORS_CONFIG, API_ROUTES } = require('./config/constants');
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors({
  origin: function(origin, callback) {
    // 允许没有 origin 的请求（如移动应用或直接 API 调用）
    if (!origin) return callback(null, true);
    
    if (CORS_CONFIG.ORIGIN.indexOf(origin) !== -1) {
      callback(null, origin); // 返回匹配的特定源
    } else {
      callback(new Error('CORS 不允许的来源'));
    }
  },
  credentials: CORS_CONFIG.CREDENTIALS
}));
// app.use(cors());
app.use(express.json());

// 路由
app.use(API_ROUTES.AUTH, authRoutes);
app.use(API_ROUTES.CONVERSATIONS, conversationRoutes);
app.use(API_ROUTES.USERS, userRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

app.listen(SERVER_CONFIG.PORT, () => {
  console.log(`Server is running on port ${SERVER_CONFIG.PORT}`);
}); 