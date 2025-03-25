import React, { useState, useEffect, useRef } from 'react';
import { Flex, Button, Badge } from 'antd';
import { Bubble, Sender, useXAgent, useXChat, Conversations, Attachments } from '@ant-design/x';
import { PlusOutlined, PaperClipOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { aiService } from '../../services/aiService';
import { roles } from '../../config/chatRoles';

// 默认对话列表
const defaultConversationsItems = [
  {
    key: '1',
    label: 'New Conversation',
  }
];

const WindowTest = () => {
  // ==================== State ====================
  const [content, setContent] = useState('');
  const [history, setHistory] = useState([]);
  const [headerOpen, setHeaderOpen] = useState(false);
  const [conversationsItems, setConversationsItems] = useState(defaultConversationsItems);
  const [activeKey, setActiveKey] = useState(defaultConversationsItems[0].key);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const historyRef = useRef([]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  // ==================== Agent ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onError }) => {
      try {
        let response = '';
        const userMessage = { role: 'user', content: message };
        const updatedHistory = [...historyRef.current, userMessage];
        setHistory(updatedHistory);
        console.log('updatedHistory', updatedHistory);
        
        await aiService.generateResponseWithHistory(message, updatedHistory, (content) => {
          response += content;
        });
        
        const aiMessage = { role: 'assistant', content: response };
        setHistory(prev => [...prev, aiMessage]);
        
        onSuccess(response);
      } catch (error) {
        onError(error);
      }
    },
  });

  // ==================== Chat ====================
  const { onRequest, messages, setMessages } = useXChat({
    agent,
    requestPlaceholder: 'Waiting...',
    requestFallback: 'Mock failed return. Please try again later.',
  });

  // Reset messages when changing conversation
  useEffect(() => {
    if (activeKey !== undefined) {
      setMessages([]);
      setHistory([]);
    }
  }, [activeKey, setMessages]);

  // ==================== Event Handlers ====================
  const onSubmit = (nextContent) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };

  const onAddConversation = () => {
    setConversationsItems([
      ...conversationsItems,
      {
        key: `${conversationsItems.length + 1}`,
        label: `New Conversation ${conversationsItems.length + 1}`,
      },
    ]);
    setActiveKey(`${conversationsItems.length + 1}`);
  };

  const onConversationClick = (key) => {
    setActiveKey(key);
  };

  const handleFileChange = (info) => setAttachedFiles(info.fileList);

  // ==================== UI Components ====================
  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
    </Badge>
  );

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === 'drop'
            ? {
                title: '拖拽文件到这里',
              }
            : {
                icon: <CloudUploadOutlined />,
                title: '上传文件',
                description: '点击或拖拽文件到此区域上传',
              }
        }
      />
    </Sender.Header>
  );

  return (
    <Flex style={{ height: '100vh' }}>
      <div style={{ width: 250, borderRight: '1px solid #f0f0f0', padding: '16px' }}>
        <Button
          onClick={onAddConversation}
          type="primary"
          icon={<PlusOutlined />}
          style={{ width: '100%', marginBottom: 16 }}
        >
          新建对话
        </Button>
        <Conversations
          items={conversationsItems}
          activeKey={activeKey}
          onActiveChange={onConversationClick}
        />
      </div>
      <Flex vertical style={{ flex: 1, padding: '16px' }}>
        <div style={{ flex: 1, overflow: 'auto', marginBottom: 16 }}>
          <Bubble.List
            roles={roles}
            style={{
              height: '100%',
            }}
            items={messages.map(({ id, message,status }) => ({
              key: id,
              loading: status === 'loading',
              role: status === 'local' ? 'local' : 'ai',
              content: message,
            }))}
          />
        </div>
        <Sender
          loading={agent.isRequesting()}
          value={content}
          onChange={setContent}
          onSubmit={onSubmit}
          header={senderHeader}
          prefix={attachmentsNode}
        />
      </Flex>
    </Flex>
  );
};

export default WindowTest;