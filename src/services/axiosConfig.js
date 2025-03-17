import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // 确保使用正确的 Bearer token 格式
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 清除无效的令牌
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 重定向到登录页面
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 