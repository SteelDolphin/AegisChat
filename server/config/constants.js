// 数据库配置
const DB_CONFIG = {
  URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/react-chat',
  OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  }
};

// 服务器配置
const SERVER_CONFIG = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production',
  TOKEN_EXPIRES_IN: '24h'
};

// CORS 配置
const CORS_CONFIG = {
  ORIGIN: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:8080',
    'http://10.222.148.202:3000',
    'http://10.222.148.202:8080'
  ],
  CREDENTIALS: true
};

// API 路由前缀
const API_ROUTES = {
  AUTH: '/api/auth',
  CONVERSATIONS: '/api/conversations',
  USERS: '/api/users'
};

// 用户角色
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// 密码加密配置
const PASSWORD_CONFIG = {
  SALT_ROUNDS: 10
};

// 错误消息
const ERROR_MESSAGES = {
  AUTH: {
    NO_TOKEN: '未提供认证令牌',
    INVALID_TOKEN: '令牌无效',
    INVALID_CREDENTIALS: '用户名或密码错误',
    USERNAME_EXISTS: '用户名已存在',
    SERVER_ERROR: '服务器错误'
  },
  DB: {
    CONNECTION_ERROR: '数据库连接失败',
    DISCONNECTION_ERROR: '断开数据库连接失败'
  }
};

// 成功消息
const SUCCESS_MESSAGES = {
  DB: {
    CONNECTED: 'MongoDB 连接成功',
    DISCONNECTED: '已断开 MongoDB 连接'
  },
  AUTH: {
    ADMIN_CREATED: '管理员用户创建成功'
  }
};

module.exports = {
  DB_CONFIG,
  SERVER_CONFIG,
  USER_ROLES,
  PASSWORD_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CORS_CONFIG,
  API_ROUTES
}; 