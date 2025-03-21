import React, { useState, useRef } from 'react';
import { Input, Button, Card, message, Space, theme, Tabs } from 'antd';
import { aiService } from '../../services/aiService';
import { Bubble } from '@ant-design/x';
import { CopyOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import WebGLTest from './WebGLTest';

// const AI_MODEL = process.env.REACT_APP_AI_MODEL;

const { TextArea } = Input;

const AITest = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const responseRef = useRef('');
  const { token } = theme.useToken();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      message.warning('Please enter a prompt');
      return;
    }

    setResponse('');
    responseRef.current = '';

    try {
      await aiService.generateResponse(prompt, (content) => {
        responseRef.current += content;
        setResponse(responseRef.current);
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: '0 20px' }}>
      <Tabs
        items={[
          {
            key: '1',
            label: 'AI 测试',
            children: (
              <Card title="AI API Test">
                <TextArea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt here..."
                  style={{ marginBottom: 16 }}
                />
                <Button 
                  type="primary" 
                  onClick={handleSubmit}
                  loading={loading}
                  style={{ marginBottom: 16 }}
                >
                  Generate Response
                </Button>
                
                <Card 
                  type="inner" 
                  title="AI Response"
                  style={{ display: loading || response ? 'block' : 'none' }}
                >
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    wordWrap: 'break-word',
                    minHeight: '100px',
                    backgroundColor: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '4px'
                  }}>
                    {response || (loading ? '思考中...' : '')}
                  </pre>
                  <Bubble
                    header="AI"
                    content={response}
                    typing={{ step: 2, interval: 10 }}
                    avatar={{ icon: <UserOutlined /> }}
                    loading={loading}
                    footer={
                      <Space size={token.paddingXXS}>
                        <Button color="default" variant="text" size="small" icon={<SyncOutlined />} />
                        <Button color="default" variant="text" size="small" icon={<CopyOutlined />} />
                      </Space>
                    }
                  />
                </Card>
              </Card>
            ),
          },
          {
            key: '2',
            label: '3D 测试',
            children: (
              <Card title="WebGL 3D 测试">
                <WebGLTest />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AITest; 