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
=======
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
>>>>>>> b346fdf872ae23e7015f8e75e6f7669ffcb0e687
  }

  return children;
};

export default PrivateRoute; 