const WebSocket = require('ws');
const uuid = require('uuid').v4;
const fs = require('fs');

// WebSocket服务器地址
const url = 'wss://dashscope.aliyuncs.com/api-ws/v1/inference/';

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

        this.ws.on('message', (data, isBinary) => {
            if (isBinary) {
                const base64Audio = data.toString('base64');
                console.log('Received binary audio data, length:', base64Audio.length);
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
                        this.res.write('event: done\ndata: \n\n');
                        this.res.end();
                        break;
                    case 'task-failed':
                        console.error('TTS 任务失败:', message.header.error_message);
                        this.res.write(`event: error\ndata: ${message.header.error_message}\n\n`);
                        this.res.end();
                        break;
                }
            }
        });

        this.ws.on('close', () => {
            console.log('TTS WebSocket 连接已关闭');
        });

        this.ws.on('error', (error) => {
            console.error('TTS WebSocket 发生错误:', error);
            this.res.write(`event: error\ndata: ${error.message}\n\n`);
            this.res.end();
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

class TTSController {
    // 处理流式 TTS 请求
    async handleStreamTTS(req, res) {
        try {
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({
                    success: false,
                    error: 'Message is required'
                });
            }

            // 设置 SSE 头部
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('Access-Control-Allow-Origin', '*');

            // 创建 TTS 处理器实例
            const ttsHandler = new TTSHandler(res);

            // 发送文本进行处理
            ttsHandler.sendText(message);

        } catch (error) {
            console.error('Stream TTS error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }
}

module.exports = new TTSController(); 