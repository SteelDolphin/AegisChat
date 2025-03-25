import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from 'antd';
import { useAuth } from '../../context/AuthContext';
import {
  baseMenuItems,
  authenticatedMenuItems,
  adminMenuItems,
  getUserMenuItems
} from '../../config/menuConfig';

function Navigation() {
  const { isAuthenticated, logout, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 构建左侧菜单项
  const leftMenuItems = [...baseMenuItems];
  if (isAuthenticated()) {
    leftMenuItems.push(...authenticatedMenuItems);
    if (isAdmin()) {
      leftMenuItems.push(...adminMenuItems);
    }
  }

  // 构建右侧菜单项
  const rightMenuItems = getUserMenuItems(user, isAdmin());

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/', { replace: true });
    } else {
      navigate(key);
    }
  };

  return (
    <div style={{ 
      padding: 0, 
      height: '48px',
      lineHeight: '48px',
      position: 'fixed',
      width: '100%',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      {/* 左侧菜单 */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={leftMenuItems}
        onClick={handleMenuClick}
        style={{ 
          height: '48px',
          lineHeight: '48px',
          flex: 1
        }}
      />
      
      {/* 右侧菜单 */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={rightMenuItems}
        onClick={handleMenuClick}
        style={{ 
          height: '48px',
          lineHeight: '48px',
          minWidth: '200px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      />
    </div>
  );
}

export default Navigation; 