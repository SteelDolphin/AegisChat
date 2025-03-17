import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, List, message, Select, Spin } from 'antd';
import { SendOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { aiService } from '../../services/aiService';
import { conversationApi } from '../../services/api';

const ChatWindow = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const data = await conversationApi.getUserConversations(userId);
      setConversations(data);
      
      // If there are conversations but none is selected, select the first one
      if (data.length > 0 && !currentConversation) {
        await loadConversation(data[0]._id);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const conversation = await conversationApi.getConversation(conversationId);
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
    try {
      setLoadingConversations(true);
      const title = `新会话 ${new Date().toLocaleString()}`;
      const conversation = await conversationApi.createConversation(userId, title);
      setConversations(prev => [conversation, ...prev]);
      setCurrentConversation(conversation);
      setMessages([]);
      message.success('新会话创建成功');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoadingConversations(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await conversationApi.deleteConversation(conversationId);
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
      // Save user message to database
      await conversationApi.addMessage(currentConversation._id, 'user', inputText);

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

      // Save AI response to database
      await conversationApi.addMessage(currentConversation._id, 'assistant', aiResponse);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
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

      <div style={{ flex: 1, overflow: 'auto', marginBottom: 16, position: 'relative' }}>
        {loadingMessages ? (
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
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={item => (
              <List.Item style={{ 
                justifyContent: item.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: item.type === 'user' ? '#1890ff' : '#f0f2f5',
                  color: item.type === 'user' ? 'white' : 'rgba(0, 0, 0, 0.85)',
                }}>
                  <div style={{ marginBottom: 4 }}>
                    {item.type === 'user' ? '你' : 'AI助手'}
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {item.content}
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={{ display: 'flex', gap: 8 }}>
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onPressEnter={handleSend}
          placeholder="输入消息..."
          disabled={loading || !currentConversation || loadingMessages}
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