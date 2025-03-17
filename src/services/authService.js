import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authService = {
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '登录失败');
      }

      const data = await response.json();
      console.log('Login response data:', data);

      if (!data) {
        throw new Error('服务器返回空数据');
      }

      if (!data.token) {
        throw new Error('服务器返回数据缺少token');
      }

      if (!data.user) {
        throw new Error('服务器返回数据缺少用户信息');
      }

      if (!data.user.id && !data.user._id) {
        console.error('Warning: User data missing ID:', data.user);
      }

      localStorage.setItem('token', data.token);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '注册失败');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data.user;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('获取用户信息失败');
      }

      return await response.json();
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // 尝试调用后端的登出接口
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(() => {
          // 即使后端调用失败，也继续清理前端状态
          console.log('Backend logout failed, continuing with frontend cleanup');
        });
      }
    } finally {
      // 清理本地存储
      localStorage.removeItem('token');
      // 清理 axios 默认 header
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  // 设置全局请求拦截器，为请求添加token
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器处理token过期
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}; 