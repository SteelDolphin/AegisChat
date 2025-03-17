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
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

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
}; 