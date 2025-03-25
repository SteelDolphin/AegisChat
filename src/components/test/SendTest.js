import React, { useState, useRef, useEffect } from 'react';
import { Flex } from 'antd';
import { Bubble, Sender, useXAgent, useXChat } from '@ant-design/x';
import { aiService } from '../../services/aiService';
import { roles } from '../../config/chatRoles';

const SendTest = () => {
  const [content, setContent] = useState('');
  const [history, setHistory] = useState([]);
  const historyRef = useRef([]);

  
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  // Agent for request using aiService
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onError }) => {
      try {
        let response = '';
        
        // Add user message to history
        const userMessage = { role: 'user', content: message };
        const updatedHistory = [...historyRef.current, userMessage];
        setHistory(updatedHistory);
        
        // Use generateResponseWithHistory instead of generateResponse
        await aiService.generateResponseWithHistory(message, updatedHistory, (content) => {
          response += content;
        });
        
        // Add AI response to history
        const aiMessage = { role: 'assistant', content: response };
        setHistory(prev => [...prev, aiMessage]);
        
        onSuccess(response);
      } catch (error) {
        onError(error);
      }
    },
  });

  // Chat messages
  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: 'Waiting...',
    requestFallback: 'Mock failed return. Please try again later.',
  });

  // Debug history changes
  useEffect(() => {
    console.log('History updated:', history);
  }, [history]);

  return (
    <Flex vertical gap="middle">
      <Bubble.List
        roles={roles}
        style={{
          maxHeight: 300,
        }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          loading: status === 'loading',
          role: status === 'local' ? 'local' : 'ai',
          content: message,
        }))}
      />
      <Sender
        loading={agent.isRequesting()}
        value={content}
        onChange={setContent}
        onSubmit={(nextContent) => {
          onRequest(nextContent);
          setContent('');
        }}
      />
    </Flex>
  );
};

export default SendTest;