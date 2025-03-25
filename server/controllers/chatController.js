const { Message, Conversation } = require('../models/Chat');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const WebSocket = require('ws');
const uuid = require('uuid').v4;
const fs = require('fs');

const openai = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

// WebSocket服务器地址
const url = 'wss://dashscope.aliyuncs.com/api-ws/v1/inference/';


// 输出文件路径
const outputFilePath = 'output.mp3';

// 清空输出文件
fs.writeFileSync(outputFilePath, '');

// ====================================================================================

// 处理 LLM 流式响应并逐句发送给 TTS
async function handleLLMStream(message, res, ttsHandler) {
    try {
        const completion = await openai.chat.completions.create({
            model: "qwen-plus",
            messages: [
                { "role": "system", "content": "You are a helpful assistant." },
                { "role": "user", "content": message }
            ],
            stream: true
        });

        let fullContent = "";
        let sentenceBuffer = "";

        for await (const chunk of completion) {
            if (Array.isArray(chunk.choices) && chunk.choices.length > 0) {
                const content = chunk.choices[0].delta.content;
                if (content) {
                    fullContent += content;
                    res.write(`event: text\ndata: ${content}\n\n`);
                    sentenceBuffer += content;

                    // 句子分割逻辑，检测完整的句子（以句号、问号、感叹号结尾）
                    const sentences = sentenceBuffer.split(/([。！？\n])/);
                    while (sentences.length > 1) {
                        const sentence = sentences.shift() + (sentences.shift() || "");
                        ttsHandler.sendText(sentence);
                    }
                    sentenceBuffer = sentences.join("");
                }
            }
        }

        // 处理最后剩余的部分
        if (sentenceBuffer.trim()) {
            ttsHandler.sendText(sentenceBuffer);
        }

        return fullContent;
    } catch (error) {
        console.error('LLM Stream error:', error);
        throw error;
    }
}


// TTS 处理类，支持流式发送文本
class TTSHandler {
    constructor(res) {
        this.res = res;
        this.ws = null;
        this.taskId = uuid();
        this.queue = [];
        this.taskStarted = false;
        this.initWebSocket();
    }

    initWebSocket() {
        console.log('Initializing TTS WebSocket connection');
        this.ws = new WebSocket(url, {
            headers: {
                Authorization: `bearer ${process.env.DASHSCOPE_API_KEY}`,
                'X-DashScope-DataInspection': 'enable'
            }
        });

        this.ws.on('open', () => {
            console.log('TTS WebSocket 连接成功');
            this.sendRunTask();
        });
        
        console.log('Creating file stream for output file:', outputFilePath);
        
        this.fileStream = fs.createWriteStream(outputFilePath, { flags: 'a' });

        this.ws.on('message', (data, isBinary) => {
            if (isBinary) {
                const base64Audio = data.toString('base64');
                console.log('Received binary audio data, length:', base64Audio.length);
                this.fileStream.write(data);
                this.res.write(`event: audio\ndata: ${base64Audio}\n\n`);
            } else {
                const message = JSON.parse(data);
                if (message.header.task_id !== this.taskId) return;

                switch (message.header.event) {
                    case 'task-started':
                        this.taskStarted = true;
                        console.log('TTS 任务已开始');
                        this.processQueue();
                        break;
                    case 'task-finished':
                        console.log('TTS 任务完成');
                        // this.finishTask();
                        this.fileStream.end(() => {
                            console.log('文件流已关闭');
                          });
                        break;
                    case 'task-failed':
                        console.error('TTS 任务失败:', message.header.error_message);
                        this.ws.close();
                        break;
                }
            }
        });

        this.ws.on('close', () => {
            console.log('TTS WebSocket 连接已关闭');
        });

        this.ws.on('error', (error) => {
            console.error('TTS WebSocket 发生错误:', error);
        });
    }

    sendRunTask() {
        const runTaskMessage = JSON.stringify({
            header: {
                action: 'run-task',
                task_id: this.taskId,
                streaming: 'duplex'
            },
            payload: {
                task_group: 'audio',
                task: 'tts',
                function: 'SpeechSynthesizer',
                model: 'cosyvoice-v1',
                parameters: {
                    text_type: 'PlainText',
                    voice: 'longxiaochun',
                    format: 'mp3',
                    sample_rate: 22050,
                    volume: 50,
                    rate: 0.5,
                    pitch: 1
                },
                input: {}
            }
        });
        this.ws.send(runTaskMessage);
        console.log('已发送 run-task 消息');
    }

    sendText(text) {
        if (!text.trim()) {
            console.log('Skipping empty text');
            return;
        }
        console.log('Adding text to queue:', text);
        this.queue.push(text);
        this.processQueue();
    }

    processQueue() {
        if (this.taskStarted && this.queue.length > 0) {
            const text = this.queue.shift();
            console.log('Processing text from queue:', text);
            const continueTaskMessage = JSON.stringify({
                header: {
                    action: 'continue-task',
                    task_id: this.taskId,
                    streaming: 'duplex'
                },
                payload: {
                    input: { text }
                }
            });
            this.ws.send(continueTaskMessage);
            console.log(`已发送 continue-task，文本：${text}`);
        }

        if (this.taskStarted && this.queue.length === 0) {
            console.log('Queue empty, finishing task');
            setTimeout(() => this.finishTask(), 1000);
        }
    }

    finishTask() {
        const finishTaskMessage = JSON.stringify({
            header: {
                action: 'finish-task',
                task_id: this.taskId,
                streaming: 'duplex'
            },
            payload: {
                input: {}
            }
        });
        this.ws.send(finishTaskMessage);
        console.log('已发送 finish-task');
        this.ws.close();
    }
}


// 处理聊天流
const streamChat = async (req, res) => {
    const { message } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        // 创建 TTS 处理器
        const ttsHandler = new TTSHandler(res);

        // 处理 LLM 响应
        const fullContent = await handleLLMStream(message, res, ttsHandler);

        console.log("fullContent", fullContent);

        // 发送完成信号
        res.write('event: done\ndata: complete\n\n');
    } catch (error) {
        console.error('Streaming chat error:', error);
        res.write(`event: error\ndata: ${error.message}\n\n`);
    } finally {
        res.end();
    }
};

module.exports = {
    streamChat
};