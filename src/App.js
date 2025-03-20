import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import React from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  WechatOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import AITest from './components/test/AITest';
import AIConvTest from './components/test/AIConvTest';
import ConvMTest from './components/test/ConvMTest';
import SendTest from './components/test/SendTest';
import WindowTest from './components/test/WindowTest';
import WindowTestDB from './components/test/WindowTestDB';
import AdminPanel from './components/admin/AdminPanel';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './components/Home';
import About from './components/About';
import { NavbarProvider } from './context/NavbarContext';

const { Header, Content } = Layout;

function TestAI() {
  return <AITest />;
}

function TestAIConv() {
  return <AIConvTest />;
}

function TestSend() {
  return <SendTest />;
}

function TestConvM() {
  return <ConvMTest />;
}

function TestWin() {
  return <WindowTest />;
}

function TestWinDB() {
  const userId = 'test_user_1';
  return <WindowTestDB userId={userId} />;
}

function Chat() {
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  
  if (!userId) {
    console.error('No valid user ID found:', user);
    return <div>Error: Unable to load chat. Missing user ID.</div>;
  }

  return <WindowTestDB userId={userId} />;
}

function Admin() {
  return <AdminPanel />;
}

function Navigation() {
  const { isAuthenticated, logout, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 左侧菜单项
  const leftMenuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined />,
      label: '关于'
    }
  ];

  // 认证后的菜单项（除了退出登录）
  const authenticatedItems = [
    {
      key: '/chat',
      icon: <WechatOutlined />,
      label: '聊天'
    }
  ];

  // 管理员菜单项
  const adminItems = [
    {
      key: 'ai',
      icon: <RobotOutlined />,
      label: 'AI测试',
      children: [
        {
          key: '/test_ai',
          label: '基础AI测试'
        },
        {
          key: '/ai_conv_test',
          label: 'AI对话测试'
        },
        {
          key: '/conv_m_test',
          label: '会话管理测试'
        },
        {
          key: '/send_test',
          label: '消息发送测试'
        },
        {
          key: '/win_test',
          label: '窗口测试'
        },
        {
          key: '/win_test_db',
          label: '数据库窗口测试'
        }
      ]
    },
    {
      key: '/admin',
      icon: <SettingOutlined />,
      label: '管理员'
    }
  ];

  // 右侧菜单项（登录/退出登录）
  const rightMenuItems = [];

  if (isAuthenticated()) {
    // 添加认证后的菜单项到左侧
    leftMenuItems.push(...authenticatedItems);
    
    // 如果是管理员，添加管理员菜单
    if (isAdmin()) {
      leftMenuItems.push(...adminItems);
    }

    // 添加用户名和退出登录到右侧
    rightMenuItems.push(
      {
        key: 'username',
        label: (
          <span style={{ 
            color: '#fff',
            marginRight: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            height: '48px',
            lineHeight: '48px'
          }}>
            <span style={{ 
              backgroundColor: isAdmin() ? '#ff4d4f' : '#1890ff',
              padding: '0 8px',
              height: '20px',
              lineHeight: '20px',
              borderRadius: '10px',
              fontSize: '12px',
              marginRight: '8px',
              display: 'inline-flex',
              alignItems: 'center'
            }}>
              {isAdmin() ? '管理员' : '用户'}
            </span>
            {user?.username}
          </span>
        ),
        disabled: true
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        danger: true
      }
    );
  } else {
    // 添加登录到右侧
    rightMenuItems.push({
      key: '/login',
      icon: <LogoutOutlined />,
      label: '登录'
    });
  }

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/', { replace: true });
    } else {
      navigate(key);
    }
  };

  return (
    <Header style={{ 
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
    </Header>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavbarProvider>
          <Layout style={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Navigation />
            <Content style={{ 
              padding: '20px',
              marginTop: '48px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
              borderRadius: '4px'
            }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                
                <Route path="/chat" element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                } />
                
                <Route path="/admin" element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } />
                
                <Route path="/test_ai" element={
                  <AdminRoute>
                    <TestAI />
                  </AdminRoute>
                } />
                
                <Route path="/ai_conv_test" element={
                  <AdminRoute>
                    <TestAIConv />
                  </AdminRoute>
                } />
                
                <Route path="/conv_m_test" element={
                  <AdminRoute>
                    <TestConvM />
                  </AdminRoute>
                } />
                
                <Route path="/send_test" element={
                  <AdminRoute>
                    <TestSend />
                  </AdminRoute>
                } />
                
                <Route path="/win_test" element={
                  <AdminRoute>
                    <TestWin />
                  </AdminRoute>
                } />
                
                <Route path="/win_test_db" element={
                  <AdminRoute>
                    <TestWinDB />
                  </AdminRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Content>
          </Layout>
        </NavbarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
