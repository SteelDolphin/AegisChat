import {
    HomeOutlined,
    InfoCircleOutlined,
    RobotOutlined,
    WechatOutlined,
    SettingOutlined,
    LogoutOutlined
  } from '@ant-design/icons';
  
  // 基础菜单项
  const baseMenuItems = [
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
  
  // 认证后的菜单项
  const authenticatedMenuItems = [
    {
      key: '/chat',
      icon: <WechatOutlined />,
      label: '聊天'
    }
  ];
  
  // 管理员菜单项
  const adminMenuItems = [
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
        },
        {
          key: '/streaming_chat_test',
          label: '流式聊天测试'
        },
        {
          key: '/tts_test',
          label: 'TTS测试'
        }
      ]
    },
    {
      key: '/admin',
      icon: <SettingOutlined />,
      label: '管理员'
    }
  ];
  
  // 获取用户菜单项
  const getUserMenuItems = (user, isAdmin) => {
    const items = [];
    
    if (user) {
      items.push(
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
                backgroundColor: isAdmin ? '#ff4d4f' : '#1890ff',
                padding: '0 8px',
                height: '20px',
                lineHeight: '20px',
                borderRadius: '10px',
                fontSize: '12px',
                marginRight: '8px',
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                {isAdmin ? '管理员' : '用户'}
              </span>
              {user.username}
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
      items.push({
        key: '/login',
        icon: <LogoutOutlined />,
        label: '登录'
      });
    }
    
    return items;
  };
  
  export {
    baseMenuItems,
    authenticatedMenuItems,
    adminMenuItems,
    getUserMenuItems
  };