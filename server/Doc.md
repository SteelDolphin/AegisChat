# React Chat 后端文档

## 系统架构

React Chat 后端使用 Node.js + Express + MongoDB 构建，采用 RESTful API 架构。系统主要包含以下组件：

- Express 服务器
- MongoDB 数据库
- JWT 认证
- 路由控制器
- 中间件

## 技术栈

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcryptjs (密码加密)
- cors (跨域资源共享)
- dotenv (环境变量管理)

## 配置说明

### 环境变量

创建 `.env` 文件并配置以下变量：

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/react-chat
JWT_SECRET=your-super-secret-key-change-this-in-production
```

### 数据库配置

默认数据库配置：
- URI: mongodb://localhost:27017/react-chat
- 连接选项：
  - useNewUrlParser: true
  - useUnifiedTopology: true
  - serverSelectionTimeoutMS: 5000
  - socketTimeoutMS: 45000

## API 端点

### 认证相关 API

#### 登录
- **POST** `/api/auth/login`
- 请求体：
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- 响应：JWT token

#### 注册
- **POST** `/api/auth/register`
- 请求体：
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

#### 获取当前用户信息
- **GET** `/api/auth/me`
- 需要认证
- 响应：用户信息

### 对话相关 API

#### 创建新对话
- **POST** `/api/conversations`
- 需要认证
- 请求体：
  ```json
  {
    "userId": "string",
    "title": "string"
  }
  ```

#### 获取用户对话列表
- **GET** `/api/users/:userId/conversations`
- 需要认证
- 响应：对话列表

#### 获取单个对话
- **GET** `/api/conversations/:conversationId`
- 需要认证
- 响应：对话详情

#### 添加消息
- **POST** `/api/conversations/:conversationId/messages`
- 需要认证
- 请求体：
  ```json
  {
    "role": "user|assistant",
    "content": "string"
  }
  ```

#### 删除对话
- **DELETE** `/api/conversations/:conversationId`
- 需要认证

#### 更新对话标题
- **PUT** `/api/conversations/:conversationId/title`
- 需要认证
- 请求体：
  ```json
  {
    "title": "string"
  }
  ```

### 用户管理 API

#### 获取用户列表
- **GET** `/api/users`
- 需要管理员权限

#### 获取单个用户
- **GET** `/api/users/:userId`
- 需要管理员权限

#### 更新用户信息
- **PUT** `/api/users/:userId`
- 需要管理员权限

#### 删除用户
- **DELETE** `/api/users/:userId`
- 需要管理员权限

## 数据模型

### 对话模型 (Conversation)
```javascript
{
  userId: String,
  title: String,
  messages: [{
    role: String,    // 'user' 或 'assistant'
    content: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 错误处理

系统使用统一的错误处理中间件，主要错误类型：

- 400: 请求参数错误
- 401: 未认证
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误

## 安全特性

1. JWT 认证
2. 密码加密存储
3. CORS 配置
4. 请求参数验证
5. 错误处理中间件

## 开发指南

### 安装依赖
```bash
npm install
```

### 开发模式运行
```bash
npm run dev
```

### 生产模式运行
```bash
npm start
```

### 创建管理员用户
```bash
npm run create-admin
```

## 注意事项

1. 生产环境部署前请修改 JWT_SECRET
2. 确保 MongoDB 服务已启动
3. 所有 API 请求都需要在 header 中携带 token：
   ```
   Authorization: Bearer <your-token>
   ```
4. 管理员相关操作需要管理员权限

