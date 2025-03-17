// import axios from 'axios';

const API_KEY = process.env.REACT_APP_AI_MODE_API_KEY;
const API_URL = process.env.REACT_APP_AI_MODE_API_URL;

export const aiService = {
  async generateResponse(prompt, onProgress) {
    try {
      const response = await fetch(`${API_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data.trim() === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                onProgress(content);
              }
            } catch (e) {
              console.error('Error parsing SSE message:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  },

  async generateResponseWithHistory(prompt, history, onProgress) {
    try {
      const messages = [
        ...history.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: "user",
          content: prompt
        }
      ];

      const response = await fetch(`${API_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data.trim() === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                onProgress(content);
              }
            } catch (e) {
              console.error('Error parsing SSE message:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}; 