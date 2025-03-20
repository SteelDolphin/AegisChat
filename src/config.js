// API 基础URL配置
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// 其他全局配置
export const CONFIG = {
  // 每页显示的数据条数
  PAGE_SIZE: 10,
  
  // 默认请求超时时间（毫秒）
  REQUEST_TIMEOUT: 5000,
  
  // 用户角色
  ROLES: {
    ADMIN: 'admin',
    USER: 'user'
  }
}; 