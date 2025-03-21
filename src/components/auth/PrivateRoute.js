<<<<<<< HEAD
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated() || !user) {
    // 保存用户尝试访问的URL，登录后可以重定向回来
    return <Navigate to="/login" state={{ from: location }} replace />;
>>>>>>>>> Temporary merge branch 2
  }

  return children;
};

export default PrivateRoute; 