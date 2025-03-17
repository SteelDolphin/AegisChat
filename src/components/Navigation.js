import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavbar } from '../context/NavbarContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { isNavbarVisible } = useNavbar();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '48px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 1000,
      transform: `translateY(${isNavbarVisible ? '0' : '-100%'})`,
      transition: 'transform 0.3s ease'
    }}>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{ height: '48px', borderBottom: 'none' }}
      >
        <Menu.Item key="/" onClick={() => navigate('/')}>
          首页
        </Menu.Item>
        <Menu.Item key="/chat" onClick={() => navigate('/chat')}>
          聊天
        </Menu.Item>
        <Menu.Item key="/about" onClick={() => navigate('/about')}>
          关于
        </Menu.Item>
        {isAuthenticated() ? (
          <Menu.Item key="/logout" onClick={logout} style={{ marginLeft: 'auto' }}>
            退出
          </Menu.Item>
        ) : (
          <Menu.Item key="/login" onClick={() => navigate('/login')} style={{ marginLeft: 'auto' }}>
            登录
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
};

export default Navigation; 