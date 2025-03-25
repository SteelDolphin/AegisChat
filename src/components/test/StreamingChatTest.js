import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Space, message } from 'antd';
import { SendOutlined, SoundOutlined } from '@ant-design/icons';

const StreamingChatTest = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioQueue = useRef([]);
  const isPlaying = useRef(false);
  const audioRef = useRef(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playNextAudio = async () => {
    if (!audioEnabled || audioQueue.current.length === 0 || isPlaying.current) {
      console.log('Skipping audio playback:', { 
        audioEnabled, 
        queueLength: audioQueue.current.length, 
        isPlaying: isPlaying.current 
      });
      return;
    }

    isPlaying.current = true;
    const audioData = audioQueue.current.shift();
    
    try {
      console.log('Starting audio playback process');
      
      // 创建音频元素
      const audio = new Audio();
      audioRef.current = audio;

      // 设置音频源
      const audioUrl = `data:audio/mp3;base64,${audioData}`;
      console.log('Setting audio source, data length:', audioData.length);
      audio.src = audioUrl;

      // 添加加载事件监听
      audio.addEventListener('loadeddata', () => {
        console.log('Audio data loaded successfully');
      });

      audio.addEventListener('canplaythrough', () => {
        console.log('Audio can play through');
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        isPlaying.current = false;
        audioRef.current = null;
        playNextAudio();
      });
      
      // 设置回调
      audio.onended = () => {
        console.log('Audio chunk finished playing');
        isPlaying.current = false;
        audioRef.current = null;
        playNextAudio();
      };

      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        isPlaying.current = false;
        audioRef.current = null;
        playNextAudio();
      };

      // 开始播放
      try {
        await audio.play();
        console.log('Started playing audio chunk');
      } catch (playError) {
        console.error('Failed to start audio playback:', playError);
        // 尝试恢复播放
        if (audio.paused) {
          try {
            await audio.play();
            console.log('Resumed audio playback');
          } catch (resumeError) {
            console.error('Failed to resume audio playback:', resumeError);
          }
        }
      }

    } catch (error) {
      console.error('Audio playback error:', error);
      isPlaying.current = false;
      audioRef.current = null;
      playNextAudio();
    }
  };

  // 添加音频控制功能
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Failed to resume audio:', error);
        });
      }
      audioRef.current = null;
    }
    isPlaying.current = false;
    if (!audioEnabled && audioQueue.current.length > 0) {
      playNextAudio();
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    let currentResponse = '';

    try {
      console.log('Sending request to server');
      const response = await fetch('http://localhost:5000/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const events = decoder.decode(value).split('\n\n');
        for (const event of events) {
          if (!event.trim()) continue;

          const lines = event.split('\n');
          const eventType = lines[0].replace('event: ', '');
          const data = lines[1].replace('data: ', '');

          switch (eventType) {
            case 'text':
              console.log('Received text event:', data);
              currentResponse += data;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                  lastMessage.content = currentResponse;
                } else {
                  newMessages.push({ role: 'assistant', content: currentResponse });
                }
                return newMessages;
              });
              break;

            case 'audio':
              try {
                console.log('Received audio event');
                // 解析服务器发送的 base64 音频数据
                const audioData = data;
                console.log('Raw audio data received:', {
                  length: audioData.length,
                  preview: audioData.substring(0, 50) + '...'
                });
                
                if (audioData) {
                  // 直接使用 base64 数据
                  audioQueue.current.push(audioData);
                  console.log('Added audio to queue, current queue length:', audioQueue.current.length);
                  playNextAudio();
                } else {
                  console.error('Empty audio data received');
                }
              } catch (error) {
                console.error('Failed to process audio data:', error);
              }
              break;

            case 'done':
              console.log('Stream completed');
              setIsLoading(false);
              break;

            case 'error':
              console.error('Server error:', data);
              break;
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      message.error(error.name === 'AbortError' 
        ? 'Request timeout, please try again' 
        : 'Failed to send message');
      setIsLoading(false);
    }

    setInput('');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type={audioEnabled ? 'primary' : 'default'}
          icon={audioEnabled ? <SoundOutlined /> : <SoundOutlined />}
          onClick={toggleAudio}
        >
          {audioEnabled ? 'Mute' : 'Unmute'}
        </Button>
      </Space>

      <Card
        style={{
          height: '60vh',
          overflow: 'auto',
          marginBottom: 16,
          background: '#f5f5f5'
        }}
        bodyStyle={{ padding: '16px' }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: 16,
              textAlign: msg.role === 'user' ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                maxWidth: '70%',
                padding: '8px 12px',
                borderRadius: 8,
                backgroundColor: msg.role === 'user' ? '#1677ff' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#000',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </Card>

      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSubmit}
          disabled={isLoading}
          placeholder="Type your message..."
          size="large"
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={isLoading}
          loading={isLoading}
          icon={<SendOutlined />}
          size="large"
        >
          Send
        </Button>
      </Space.Compact>
    </div>
  );
};

export default StreamingChatTest; 