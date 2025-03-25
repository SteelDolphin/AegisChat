import React, { useState, useRef } from 'react';
import { Input, Button, Space, message } from 'antd';
import { SendOutlined, PlayCircleOutlined } from '@ant-design/icons';

const TTSTest = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completeAudio, setCompleteAudio] = useState(null);
  const audioRef = useRef(null);
  const audioQueue = useRef([]);
  const isPlaying = useRef(false);
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // 播放音频队列中的下一段
  const playNextAudio = async () => {
    if (audioQueue.current.length === 0 || isPlaying.current) {
      return;
    }

    isPlaying.current = true;
    const audioData = audioQueue.current.shift();
    
    try {
      const audio = new Audio();
      audioRef.current = audio;

      // 设置音频源
      const audioUrl = `data:audio/mp3;base64,${audioData}`;
      audio.src = audioUrl;

      // 添加事件监听
      audio.addEventListener('loadeddata', () => {
        console.log('Audio chunk loaded');
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio chunk error:', e);
        isPlaying.current = false;
        audioRef.current = null;
        playNextAudio();
      });

      audio.onended = () => {
        isPlaying.current = false;
        audioRef.current = null;
        playNextAudio();
      };

      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
      isPlaying.current = false;
      audioRef.current = null;
      playNextAudio();
    }
  };

  // 播放完整音频
  const playCompleteAudio = async () => {
    if (!completeAudio) {
      message.warning('No complete audio available');
      return;
    }

    try {
      const audio = new Audio();
      audioRef.current = audio;

      const audioUrl = `data:audio/mp3;base64,${completeAudio}`;
      audio.src = audioUrl;

      audio.addEventListener('loadeddata', () => {
        console.log('Complete audio loaded');
      });

      audio.addEventListener('error', (e) => {
        console.error('Complete audio error:', e);
        message.error('Failed to load complete audio');
      });

      await audio.play();
    } catch (error) {
      console.error('Complete audio playback error:', error);
      message.error('Failed to play complete audio');
    }
  };

  // 清理超时和请求
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    // 清理之前的请求
    cleanup();

    // 设置新的超时和请求控制器
    timeoutRef.current = setTimeout(() => {
      console.log('Request timeout');
      message.error('Request timeout, please try again');
      cleanup();
    }, 30000); // 30秒超时

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setCompleteAudio(null);
    audioQueue.current = [];

    try {
      console.log('Sending TTS request');
      const response = await fetch('http://localhost:5000/api/tts/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
        signal: abortControllerRef.current.signal
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
            case 'audio':
              try {
                console.log('Received audio chunk');
                if (data) {
                  audioQueue.current.push(data);
                  playNextAudio();
                }
              } catch (error) {
                console.error('Failed to process audio chunk:', error);
              }
              break;

            case 'complete_audio':
              try {
                console.log('Received complete audio');
                setCompleteAudio(data);
              } catch (error) {
                console.error('Failed to process complete audio:', error);
              }
              break;

            case 'done':
              console.log('Stream completed');
              cleanup();
              break;

            case 'error':
              console.error('Server error:', data);
              message.error('Server error occurred');
              cleanup();
              break;
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      console.error('TTS error:', error);
      message.error('Failed to process TTS request');
      cleanup();
    }

    setInput('');
  };

  // 组件卸载时清理
  React.useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSubmit}
          disabled={isLoading}
          placeholder="Enter text for TTS..."
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

      <Button
        type="primary"
        icon={<PlayCircleOutlined />}
        onClick={playCompleteAudio}
        disabled={!completeAudio || isLoading}
        size="large"
      >
        Play Complete Audio
      </Button>
    </div>
  );
};

export default TTSTest; 