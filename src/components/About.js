import React from 'react';
import { Typography, Row, Col, Card, Timeline, Image, Space } from 'antd';
import {
  TeamOutlined,
  TrophyOutlined,
  HistoryOutlined,
  RocketOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const About = () => {
  const teamMembers = [
    {
      name: '技术团队',
      role: '开发团队',
      description: '拥有丰富的AI和全栈开发经验',
      icon: <TeamOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
    },
    {
      name: 'AI研究团队',
      role: 'AI模型团队',
      description: '专注于自然语言处理和对话系统研究',
      icon: <TrophyOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
    }
  ];

  const milestones = [
    {
      color: '#1890ff',
      children: '项目启动 - 2024年初',
    },
    {
      color: '#52c41a',
      children: '完成核心AI对话功能',
    },
    {
      color: '#722ed1',
      children: '实现多会话管理系统',
    },
    {
      color: '#faad14',
      children: '支持文件上传和富文本交互',
    },
    {
      color: '#eb2f96',
      children: '持续优化中...',
    }
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      {/* Header Section */}
      <Row justify="center" style={{ marginBottom: 48 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title>关于我们的项目</Title>
          <Paragraph style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto' }}>
            我们致力于打造最先进的AI对话系统，为用户提供智能、自然、高效的交互体验
          </Paragraph>
        </Col>
      </Row>

      {/* Vision Section */}
      <Row gutter={[24, 24]} justify="center" style={{ marginBottom: 48 }}>
        <Col xs={24} md={12}>
          <Card bordered={false}>
            <Title level={3}>
              <RocketOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              我们的愿景
            </Title>
            <Paragraph style={{ fontSize: '16px' }}>
              打造新一代智能对话平台，让AI助手成为每个人的得力助手。我们期望通过持续创新和优化，
              为用户提供更智能、更自然、更高效的对话体验。
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Image
            src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
            alt="AI Technology"
            style={{ width: '100%', borderRadius: '8px' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
          />
        </Col>
      </Row>

      {/* Team Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
            <TeamOutlined style={{ marginRight: 8 }} />
            我们的团队
          </Title>
        </Col>
        {teamMembers.map((member, index) => (
          <Col xs={24} sm={12} key={index}>
            <Card hoverable>
              <Space align="start" size="large">
                {member.icon}
                <div>
                  <Title level={4} style={{ marginTop: 0 }}>{member.name}</Title>
                  <Paragraph strong>{member.role}</Paragraph>
                  <Paragraph>{member.description}</Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Development History */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={3}>
              <HistoryOutlined style={{ marginRight: 8, color: '#722ed1' }} />
              发展历程
            </Title>
            <Timeline
              items={milestones}
              style={{ marginTop: 24 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default About;