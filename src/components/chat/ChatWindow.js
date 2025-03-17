import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, List, message, Select, Spin } from 'antd';
import { SendOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { aiService } from '../../services/aiService';
import { conversationService } from '../../services/conversationService';
import { useAuth } from '../../context/AuthContext';
import { useNavbar } from '../../context/NavbarContext';
import { useNavigate } from 'react-router-dom';

const ChatWindow = ( ) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { setIsNavbarVisible } = useNavbar();
  const listRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (user && user._id) {
          const data = await conversationService.getUserConversations(user._id);
          setConversations(data);
        }
      } catch (error) {
        console.error('获取会话列表失败:', error);
      }
    };

    fetchConversations();
  }, [user]);

  const loadConversation = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const conversation = await conversationService.getConversation(conversationId);
      setCurrentConversation(conversation);
      setMessages(conversation.messages.map(msg => ({
        id: msg._id,
        type: msg.role === 'user' ? 'user' : 'ai',
        content: msg.content,
        timestamp: msg.timestamp
      })));
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  const createNewConversation = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      setLoadingConversations(true);
      // 创建一个默认标题
      const defaultTitle = `新会话 ${new Date().toLocaleString()}`;
      // 使用 user._id 而不是 user.id
      const newConversation = await conversationService.createConversation(user._id, defaultTitle);
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);
      message.success('新会话创建成功');
    } catch (error) {
      console.error('创建对话失败:', error);
      message.error(error.message);
    } finally {
      setLoadingConversations(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      // 使用 conversationService 而不是 conversationApi
      await conversationService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv._id !== conversationId));
      if (currentConversation?._id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      message.success('会话已删除');
    } catch (error) {
      message.error(error.message);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = (e) => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    const currentScrollTop = e.target.scrollTop;
    
    // 向上滚动时隐藏导航栏
    if (currentScrollTop > lastScrollTop.current && currentScrollTop > 50) {
      setIsNavbarVisible(false);
    }
    // 向下滚动到顶部附近时显示导航栏
    else if (currentScrollTop < lastScrollTop.current && currentScrollTop < 50) {
      setIsNavbarVisible(true);
    }

    lastScrollTop.current = currentScrollTop;

    // 滚动停止后的处理
    scrollTimeout.current = setTimeout(() => {
      if (currentScrollTop < 50) {
        setIsNavbarVisible(true);
      }
    }, 150);
  };

  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || !currentConversation) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // 使用 conversationService 而不是 conversationApi
      await conversationService.addMessage(currentConversation._id, 'user', inputText);

      let aiResponse = '';
      await aiService.generateResponse(inputText, async (content) => {
        aiResponse += content;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage && lastMessage.type === 'ai') {
            lastMessage.content = aiResponse;
          } else {
            newMessages.push({
              id: Date.now(),
              type: 'ai',
              content: aiResponse,
              timestamp: new Date().toISOString()
            });
          }
          
          return newMessages;
        });
      });

      // 使用 conversationService 而不是 conversationApi
      await conversationService.addMessage(currentConversation._id, 'assistant', aiResponse);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ 
      height: 'calc(100vh - 48px)', // 视口高度减去导航栏高度
      display: 'flex', 
      flexDirection: 'column',
      margin: 0,
      padding: '16px',
      border: 'none',
      borderRadius: 0,
      position: 'relative',    // 改为相对定位
      overflow: 'hidden',
      transition: 'height 0.3s ease'
    }}>
      <div style={{
        marginBottom: 16, 
        display: 'flex', 
        gap: 8,
        flexShrink: 0
      }}>
        <Select
          style={{ width: 200 }}
          placeholder="选择会话"
          value={currentConversation?._id}
          onChange={loadConversation}
          loading={loadingConversations}
          disabled={loadingConversations}
        >
          {conversations.map(conv => (
            <Select.Option key={conv._id} value={conv._id}>
              {conv.title}
            </Select.Option>
          ))}
        </Select>
        <Button 
          icon={<PlusOutlined />}
          onClick={createNewConversation}
          loading={loadingConversations}
          disabled={loadingConversations}
        >
          新建会话
        </Button>
        {currentConversation && (
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => deleteConversation(currentConversation._id)}
            disabled={loadingConversations || loadingMessages}
          >
            删除会话
          </Button>
        )}
      </div>

      <List
        ref={listRef}
        style={{ 
          flex: 1,
          overflow: 'auto',
          marginBottom: 16,
          position: 'relative',
          backgroundColor: '#fff',
          borderRadius: '4px',
          padding: '8px',
          minHeight: 0,
          height: '100%',
          scrollBehavior: 'smooth'
        }}
        itemLayout="horizontal"
        dataSource={messages}
        loading={loadingMessages}
        locale={{
          emptyText: loadingMessages ? (
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <Spin />
              <div style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.45)' }}>
                加载消息中...
              </div>
            </div>
          ) : '暂无消息'
        }}
        renderItem={item => (
          <List.Item style={{ 
            justifyContent: item.type === 'user' ? 'flex-end' : 'flex-start',
            border: 'none',
            padding: '4px 0'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: item.type === 'user' ? '#1890ff' : '#f0f2f5',
              color: item.type === 'user' ? 'white' : 'rgba(0, 0, 0, 0.85)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: 4, fontWeight: 500 }}>
                {item.type === 'user' ? '你' : 'AI助手'}
              </div>
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-word',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                {item.content}
              </div>
            </div>
          </List.Item>
        )}
      />
      <div ref={messagesEndRef} />
      
      <div style={{ 
        display: 'flex', 
        gap: 8,
        flexShrink: 0
      }}>
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onPressEnter={handleSend}
          placeholder="输入消息..."
          disabled={loading || !currentConversation || loadingMessages}
          style={{
            borderRadius: '4px',
            padding: '8px 12px'
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          disabled={!currentConversation || loadingMessages}
        >
          发送
        </Button>
      </div>
    </Card>
  );
};

export default ChatWindow; 