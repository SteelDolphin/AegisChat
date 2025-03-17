import { UserOutlined, PlusOutlined, PaperClipOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { Bubble, Sender, useXAgent, useXChat, Conversations, Attachments } from '@ant-design/x';
import { DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { Flex, Button, Badge, message } from 'antd';
import React, { useEffect } from 'react';
import { aiService } from '../services/aiService';
import { conversationApi } from '../services/api';

const roles = {
    ai: {
        placement: 'start',
        avatar: {
            icon: <UserOutlined />,
            style: {
                background: '#fde3cf',
            },
        },
        typing: {
            step: 2,
            interval: 10,
        },
        style: {
            maxWidth: 600,
        },
    },
    local: {
        placement: 'end',
        avatar: {
            icon: <UserOutlined />,
            style: {
                background: '#87d068',
            },
        },
    },
};

const WindowTestDB = ({ userId }) => {
    // ==================== State ====================
    const [content, setContent] = React.useState('');
    const [history, setHistory] = React.useState([]);
    const [headerOpen, setHeaderOpen] = React.useState(false);
    const [conversationsItems, setConversationsItems] = React.useState([]);
    const [activeKey, setActiveKey] = React.useState(null);
    const [currentConversation, setCurrentConversation] = React.useState(null);
    const [attachedFiles, setAttachedFiles] = React.useState([]);
    const historyRef = React.useRef([]);
    const currentConversationRef = React.useRef(null);

    useEffect(() => {
        currentConversationRef.current = currentConversation;
    }, [currentConversation]);

    // 更新 historyRef
    useEffect(() => {
        historyRef.current = history;
    }, [history]);

    // Load conversations when component mounts
    useEffect(() => { loadConversations(); }, [userId]);

    const loadConversations = async () => {
        try {
            const data = await conversationApi.getUserConversations(userId);
            console.log('A60:data', data);
            const formattedConversations = data.map((conv, index) => ({
                key: index,
                _id: conv._id,
                label: conv.title || 'Untitled Conversation'
            }));

            setConversationsItems(formattedConversations);

            // If there are conversations but none is selected, select the first one
            if (formattedConversations.length > 0 && !currentConversation) {
                setActiveKey(formattedConversations[0].key);
                await loadConversation(formattedConversations[0]._id);
            }
        } catch (error) {
            message.error('Failed to load conversations');
        } finally {
            console.log('loadConversations finally');
        }
    };

    const addMessage = (role, content) => {
        const message = {
            role: role,
            content: content,
        }
        setHistory(prev => [...prev, message]);
    }

    // 加载对话
    const loadConversation = async (conversationId) => {
        try {
            const conversation = await conversationApi.getConversation(conversationId);

            console.log('conversation', conversation);
            setCurrentConversation(conversation);

            // Convert conversation messages to the format expected by Bubble.List
            const updatedHistory = conversation.messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            setHistory(updatedHistory);

            const updateMessages = updatedHistory.map((msg, index) => ({
                key: index,
                message: msg.content,
                status: msg.role === 'user' ? 'local' : 'ai',
            }));
            console.log('A110:updateMessages', updateMessages);
            setMessages(updateMessages);
                    // 禁用 typing 效果
            roles.ai.typing = false;

        } catch (error) {
            message.error('Failed to load conversation messages');
        } finally {
            console.log('loadConversation finally');
        }
    };

    // ==================== Agent ====================
    const [agent] = useXAgent({
        request: async ({ message }, { onSuccess, onUpdate, onError }) => {
            roles.ai.typing = {step: 2, interval: 10};
            try {
                let aiResponse = '';
                console.log('messages', message); 
                // AI 生成响应
                await aiService.generateResponseWithHistory(message, historyRef.current, (content) => {
                    aiResponse += content;
                    onUpdate(aiResponse);
                });
                console.log('aiResponse', aiResponse);

                await conversationApi.addMessage(currentConversationRef.current._id, 'assistant', aiResponse);

                addMessage('assistant', aiResponse);

                onSuccess(aiResponse);
            } catch (error) {
                console.error('Error during AI response generation:', error);
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
    }, [activeKey]);

    // ==================== Event Handlers ====================
    const onSubmit = async (nextContent) => {
        if (!nextContent || !currentConversation) return;

        try {
            // 保存用户消息到数据库
            await conversationApi.addMessage(currentConversation._id, 'user', nextContent);

            addMessage('user', nextContent);

            // 发送到 AI 服务
            onRequest(nextContent);
            // 清空输入框
            setContent('');

        } catch (error) {
            message.error('Failed to save message: ' + error.message);
        }
    };

    const onAddConversation = async () => {
        if (!userId) {
            message.error('Please login to create new conversations');
            return;
        }

        try {
            const title = `新会话 ${new Date().toLocaleString()}`;
            const key = `${conversationsItems.length + 1}`;

            const newConversation = await conversationApi.createConversation(userId, title);

            setConversationsItems(prev => [...prev, {
                key: key,
                _id: newConversation._id,
                label: newConversation.title,
            }]);

            setActiveKey(key);
            loadConversation(newConversation._id);
        } catch (error) {
            message.error('Failed to create new conversation: ' + (error.response?.data?.error || error.message));
        }
    };

    const onConversationClick = (key) => {
        console.log('Fun: onConversationClick Ver: key', key);
        if (key === activeKey) {
            console.log('Conversation is already active, no need to reload.');
            return; // 如果当前会话已经是激活的，则不重新加载
        }
        const conversation = conversationsItems[key];
        if (conversation) {
            loadConversation(conversation._id);
            setCurrentConversation(conversation);
            setActiveKey(key);
        }
    };

    const handleFileChange = (info) => setAttachedFiles(info.fileList);

    const menuConfig = (conversation) => ({
        items: [
            {
                label: 'Operation 1',
                key: 'operation1',
                icon: <EditOutlined />,
            },
            {
                label: 'Operation 2',
                key: 'operation2',
                icon: <StopOutlined />,
                disabled: true,
            },
            {
                label: 'Operation 3',
                key: 'operation3',
                icon: <DeleteOutlined />,
                danger: true,
            },
        ],
        onClick: (menuInfo) => {
            message.info(`Click ${conversation.key} - ${menuInfo.key}`);

            conversationApi.deleteConversation(conversationsItems.find(item => item.key === conversation.key)._id);
            setConversationsItems(prev => prev.filter(conv => conv._id !== conversation._id));
        },
    });
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
                    menu={menuConfig}
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
                        items={messages.map(({ id, message, status }, index) => ({
                            key: index,
                            loading: message === 'Waiting...',
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

export default WindowTestDB;