import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { UserOutlined, DashboardOutlined, SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import UserManagement from './UserManagement';

const { Content, Sider } = Layout;
const { Title } = Typography;

const AdminPanel = () => {
  const [selectedKey, setSelectedKey] = useState('users');

  const renderContent = () => {
    switch (selectedKey) {
      case 'users':
        return <UserManagement />;
      case 'dashboard':
        return <div>仪表盘（开发中）</div>;
      case 'settings':
        return <div>系统设置（开发中）</div>;
      default:
        return <UserManagement />;
    }
  };

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Sider width={200} theme="light">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ height: '100%', borderRight: 0 }}
          onClick={({ key }) => setSelectedKey(key)}
        >
          <Menu.Item key="users" icon={<UserOutlined />}>
            用户管理
          </Menu.Item>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            仪表盘
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            系统设置
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            background: '#fff',
            borderRadius: '4px',
            minHeight: 280,
          }}
        >
          <Title level={4} style={{ marginBottom: 24 }}>
            {selectedKey === 'users' && '用户管理'}
            {selectedKey === 'dashboard' && '仪表盘'}
            {selectedKey === 'settings' && '系统设置'}
          </Title>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPanel; 