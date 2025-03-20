import axios from 'axios';
import { API_BASE_URL } from '../config';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 5000
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求配置错误:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API请求错误:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    return Promise.reject(error);
  }
);

export const userService = {
  // 获取所有用户
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('未授权访问，请重新登录');
      }
      if (error.response?.status === 403) {
        throw new Error('没有权限访问此资源');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请检查网络连接');
      }
      if (!error.response) {
        throw new Error('无法连接到服务器，请检查服务器是否运行');
      }
      throw new Error(error.response?.data?.message || '获取用户列表失败');
    }
  },

  // 创建新用户
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('未授权访问，请重新登录');
      }
      if (error.response?.status === 403) {
        throw new Error('没有权限访问此资源');
      }
      throw new Error(error.response?.data?.message || '创建用户失败');
    }
  },

  // 更新用户信息
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('未授权访问，请重新登录');
      }
      if (error.response?.status === 403) {
        throw new Error('没有权限访问此资源');
      }
      throw new Error(error.response?.data?.message || '更新用户信息失败');
    }
  },

  // 删除用户
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('未授权访问，请重新登录');
      }
      if (error.response?.status === 403) {
        throw new Error('没有权限访问此资源');
      }
      throw new Error(error.response?.data?.message || '删除用户失败');
    }
  }
}; 