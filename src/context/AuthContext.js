<<<<<<< HEAD
import React, { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
=======
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
>>>>>>> b346fdf872ae23e7015f8e75e6f7669ffcb0e687
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
<<<<<<< HEAD
=======
        localStorage.removeItem('token');
>>>>>>> b346fdf872ae23e7015f8e75e6f7669ffcb0e687
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

<<<<<<< HEAD
  const login = async (username, password) => {
    setLoading(true);
    try {
      const userData = await authService.login(username, password);
      console.log('Received user data in context:', userData);
      
      if (!userData) {
        throw new Error('未收到用户数据');
      }

      // 确保用户数据中包含必要的字段
      if (!userData.username) {
        throw new Error('用户数据缺少用户名');
      }

      // 检查用户ID（支持两种可能的字段名）
      const userId = userData.id || userData._id;
      if (!userId) {
        throw new Error('用户数据缺少ID');
      }

      // 设置用户状态
      setUser(userData);
      message.success('登录成功');
      return true;
    } catch (error) {
      console.error('Login error in context:', error);
      message.error(error.message || '登录失败');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password) => {
    setLoading(true);
    try {
      const userData = await authService.register(username, password);
      setUser(userData);
      message.success('注册成功');
      return true;
    } catch (error) {
      message.error(error.message || '注册失败');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // 先清除本地存储
    localStorage.clear();  // 清除所有本地存储，包括 token
    // 清除用户状态
    setUser(null);
    // 调用服务清理
    authService.logout();
    message.success('已退出登录');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>加载中...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated, 
      isAdmin, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
=======
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
>>>>>>> b346fdf872ae23e7015f8e75e6f7669ffcb0e687
}; 