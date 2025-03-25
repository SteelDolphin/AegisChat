const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const { SERVER_CONFIG, CORS_CONFIG, API_ROUTES } = require('./config/constants');
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors({
  origin: CORS_CONFIG.ORIGIN,
  credentials: CORS_CONFIG.CREDENTIALS
}));
// app.use(cors());
app.use(express.json());

// 在后端添加健康检查路由
app.use(API_ROUTES.HEALTH, healthRoutes);
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