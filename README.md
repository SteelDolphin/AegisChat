# React Chat Application

一个基于 React 和 Node.js 的现代化聊天应用，支持用户管理、实时聊天和 AI 测试功能。

## 功能特性

### 用户系统
- 用户注册和登录
- 角色管理（管理员/普通用户）
- JWT 身份验证
- 用户状态持久化

### 聊天功能
- 实时聊天窗口
- 消息历史记录
- 数据库存储消息
- 用户在线状态

### AI 测试模块（仅管理员）
- 基础 AI 测试
- AI 对话测试
- 会话管理测试
- 消息发送测试
- 窗口测试
- 数据库窗口测试

### 界面特性
- 响应式设计
- 现代化 UI（基于 Ant Design）
- 导航栏用户状态显示
- 权限控制路由

## 技术栈

### 前端
- React 18
- React Router v6
- Ant Design
- Context API 状态管理
- Axios 网络请求

### 后端
- Node.js
- Express
- MongoDB
- JWT 认证
- bcrypt 密码加密

## 项目结构

```
src/
├── components/
│   ├── admin/        # 管理员相关组件
│   ├── auth/         # 认证相关组件
│   ├── test/         # AI测试相关组件
│   ├── Home.js       # 首页组件
│   └── About.js      # 关于页面组件
├── context/
│   ├── AuthContext.js    # 认证上下文
│   └── NavbarContext.js  # 导航栏上下文
├── services/
│   └── authService.js    # 认证服务
└── App.js               # 应用主组件
```

## 安装和运行

### 前端
```bash
# 安装依赖
npm install

# 开发环境运行
npm start

# 生产环境构建
npm run build
```

### 后端
```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 启动服务器
npm start
```

## 环境变量配置

创建 `.env` 文件：

```env
REACT_APP_API_URL=http://localhost:5000/api
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-uri
```

## 用户角色和权限

### 普通用户
- 访问首页和关于页面
- 使用聊天功能
- 查看和编辑个人信息

### 管理员
- 所有普通用户权限
- 访问 AI 测试功能
- 访问管理员面板
- 管理用户和系统设置

## 开发指南

### 添加新功能
1. 在 `components` 目录下创建新组件
2. 在 `App.js` 中添加路由
3. 在 `Navigation` 组件中添加菜单项
4. 配置适当的权限控制

### 权限控制
- 使用 `PrivateRoute` 组件保护需要登录的路由
- 使用 `AdminRoute` 组件保护管理员专用路由
- 在 `Navigation` 组件中根据用户角色显示菜单项

## 部署

### 前端部署
1. 执行 `npm run build` 生成生产环境代码
2. 将 `build` 目录部署到 Web 服务器

### 后端部署
1. 配置生产环境变量
2. 使用 PM2 或类似工具运行 Node.js 服务
3. 配置反向代理（如 Nginx）

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件
