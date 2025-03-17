import React from 'react';
import { Typography, Row, Col, Card, Space, Button } from 'antd';
import {
  RobotOutlined,
  MessageOutlined,
  SafetyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <RobotOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: '智能AI对话',
      description: '基于先进的AI模型，提供智能、自然的对话体验'
    },
    {
      icon: <MessageOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      title: '多会话管理',
      description: '支持多个对话同时进行，方便的会话管理功能'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      title: '安全可靠',
      description: '完善的用户认证和数据加密，确保您的数据安全'
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '32px', color: '#faad14' }} />,
      title: '高效响应',
      description: '快速的响应速度，流畅的用户体验'
    }
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      {/* Hero Section */}
      <Row justify="center" align="middle" style={{ minHeight: '60vh', textAlign: 'center' }}>
        <Col span={24}>
          <Space direction="vertical" size="large">
            <Title level={1} style={{ marginBottom: 0 }}>
              欢迎使用 AI 聊天系统
            </Title>
            <Paragraph style={{ fontSize: '18px', color: '#666' }}>
              智能对话，让沟通更简单
            </Paragraph>
            {!isAuthenticated() && (
              <Button type="primary" size="large" onClick={() => navigate('/login')}>
                立即开始
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {/* Features Section */}
      <Row gutter={[24, 24]} style={{ padding: '40px 0' }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              hoverable
              style={{ height: '100%', textAlign: 'center' }}
              bodyStyle={{ padding: '24px' }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {feature.icon}
                <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ color: '#666' }}>
                  {feature.description}
                </Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Introduction Section */}
      <Row justify="center" style={{ padding: '40px 0' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={2}>关于我们的系统</Title>
          <Paragraph style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto' }}>
            我们的AI聊天系统采用最新的人工智能技术，为用户提供智能、自然的对话体验。
            系统支持多会话管理，让您可以同时进行多个不同主题的对话。
            无论是日常交流、学习辅导还是专业咨询，我们都能为您提供优质的服务。
          </Paragraph>
        </Col>
      </Row>

      {/* Call to Action */}
      <Row justify="center" style={{ padding: '40px 0' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          {isAuthenticated() ? (
            <Button type="primary" size="large" onClick={() => navigate('/chat')}>
              开始聊天
            </Button>
          ) : (
            <Space size="middle">
              <Button type="primary" size="large" onClick={() => navigate('/login')}>
                登录
              </Button>
              <Button size="large" onClick={() => navigate('/about')}>
                了解更多
              </Button>
            </Space>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Home; 