import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Radio, Card } from 'antd';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 获取用户之前尝试访问的页面，如果没有则默认为聊天页面
  const from = location.state?.from?.pathname || '/chat';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(username, password);
      if (success) {
        // 根据登录类型重定向到不同页面
        const redirectPath = loginType === 'admin' ? '/admin' : from;
        navigate(redirectPath, { replace: true });
      } else {
        setError('用户名或密码错误');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Card
        title={
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: 0 }}>系统登录</h2>
            <Radio.Group 
              value={loginType} 
              onChange={(e) => setLoginType(e.target.value)}
              style={{ marginTop: '1rem' }}
            >
              <Radio.Button value="user">普通用户</Radio.Button>
              <Radio.Button value="admin">管理员</Radio.Button>
            </Radio.Group>
          </div>
        }
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {error && (
          <div style={{
            color: 'red',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loginType === 'admin' ? '#ff4d4f' : '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = loginType === 'admin' ? '#ff7875' : '#40a9ff';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = loginType === 'admin' ? '#ff4d4f' : '#1890ff';
            }}
          >
            {loginType === 'admin' ? '管理员登录' : '用户登录'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default Login; 