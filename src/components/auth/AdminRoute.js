import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    // 如果未登录，重定向到登录页面
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    // 如果不是管理员，重定向到首页
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 