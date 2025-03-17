import React, { createContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

// 开发模式下的模拟用户数据
const DEV_MODE = process.env.REACT_APP_DEV_MODE === 'true';
const mockUser = {
  id: 1,
  username: 'dev_user',
  role: 'admin'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DEV_MODE ? mockUser : null);
  const [loading, setLoading] = useState(!DEV_MODE);

  useEffect(() => {
    const initAuth = async () => {
      // 如果是开发模式，直接返回，不进行认证
      if (DEV_MODE) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    if (!DEV_MODE) {
      localStorage.removeItem('token');
    }
    setUser(null);
    message.success('已退出登录');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 