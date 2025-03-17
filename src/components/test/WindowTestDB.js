// React and core dependencies
import React, { useState, useEffect, useCallback, useRef } from 'react';

// Ant Design components
import { Flex, Button, Badge, message } from 'antd';
import { Bubble, Sender, useXAgent, useXChat, Conversations, Attachments } from '@ant-design/x';

// Icons
import { PlusOutlined, PaperClipOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

// Services and configs
import { aiService } from '../../services/aiService';
import { conversationService } from '../../services/conversationService';
import { roles } from '../../config/chatRoles';

// 将 loadConversations 函数移到组件外部
const loadConversations = async (
    userId,
    currentConversation,
    loadConversation,
    setConversationsItems,
    setActiveKey,
    message
) => {
    try {
        console.log('Loading conversations for userId:', userId);
        if (!userId) {
            console.log('No userId provided');
            return;
        }

        const data = await conversationService.getUserConversations(userId);
        console.log('Conversations loaded:', data);

        if (!Array.isArray(data)) {
            console.error('Invalid response format:', data);
            message.error('Invalid response format from server');
            return;
        }

        const formattedConversations = data.map((conv, index) => ({
            key: index,
            _id: conv._id,
            label: conv.title || 'Untitled Conversation'
        }));

        setConversationsItems(formattedConversations);

        if (formattedConversations.length > 0 && !currentConversation) {
            setActiveKey(formattedConversations[0].key);
            await loadConversation(formattedConversations[0]._id);
        }
    } catch (error) {
        console.error('Load conversations error:', error);
        message.error(error.response?.data?.message || error.message || 'Failed to load conversations');
    }
};

const WindowTestDB = ({ userId }) => {
    // ==================== State ====================
    const [content, setContent] = useState('');
    const [history, setHistory] = useState([]);
    const [headerOpen, setHeaderOpen] = useState(false);
    const [conversationsItems, setConversationsItems] = useState([]);
    const [activeKey, setActiveKey] = useState(null);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const historyRef = useRef([]);
    const currentConversationRef = useRef(null);

    useEffect(() => {
        currentConversationRef.current = currentConversation;
    }, [currentConversation]);

    // 更新 historyRef
    useEffect(() => {
        historyRef.current = history;
    }, [history]);

    // ==================== Agent ====================
    const [agent] = useXAgent({
        request: async ({ message }, { onUpdate, onSuccess, onError }) => {
            try {
                let aiResponse = '';
                // 生成 AI 响应
                await aiService.generateResponseWithHistory(message, historyRef.current, (content) => {
                    aiResponse += content;
                    onUpdate(aiResponse);   // 更新数据
                });

                await conversationService.addMessage(currentConversationRef.current._id, 'assistant', aiResponse);
                // 添加到历史记录
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

    const loadConversation = useCallback(async (conversationId) => {
        try {
            const conversation = await conversationService.getConversation(conversationId);

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
                history: true,
            }));
            setMessages(updateMessages);
        } catch (error) {
            message.error('Failed to load conversation messages');
        } finally {
            console.log('loadConversation finally');
        }
    }, [setCurrentConversation, setHistory, setMessages]); // 依赖项

    // Load conversations when component mounts
    useEffect(() => {
        if (!userId) {
            message.error('Please login first');
            return;
        }

        loadConversations(
            userId,
            currentConversation,
            loadConversation,
            setConversationsItems,
            setActiveKey,
            message
        );
    }, [userId, currentConversation, loadConversation]);

    const addMessage = (role, content) => {
        const message = {
            role: role,
            content: content,
        }
        setHistory(prev => [...prev, message]);
    }

    // Reset messages when changing conversation
    useEffect(() => {
        if (activeKey !== undefined) {
            setMessages([]);
            setHistory([]);
        }
    }, [activeKey, setMessages]);

    // ==================== Event Handlers ====================
    const onSubmit = async (nextContent) => {
        if (!nextContent || !currentConversation) return;
        try {
            // 保存用户消息到数据库
            await conversationService.addMessage(currentConversation._id, 'user', nextContent);
            addMessage('user', nextContent);
            // 发送到 AI 服务
            onRequest(nextContent);
            // 清空输入框
            setContent('');
        } catch (error) {
            message.error('Failed to save message: ' + error.message);
        }
    };

    // 
    const onAddConversation = async () => {
        if (!userId) {
            message.error('Please login to create new conversations');
            return;
        }
        try {
            const title = `新会话 ${new Date().toLocaleString()}`;
            const key = `${conversationsItems.length + 1}`; // 改

            const newConversation = await conversationService.createConversation(userId, title);

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
                label: '修改会话名',
                key: 'edit',
                icon: <EditOutlined />,
            },
            {
                label: '删除会话',
                key: 'delete',
                icon: <DeleteOutlined />,
                danger: true,
            },
        ],
        onClick: async (menuInfo) => {
            const conversationItem = conversationsItems.find(item => item.key === conversation.key);
            if (!conversationItem) return;

            switch (menuInfo.key) {
                case 'edit':
                    try {
                        const newTitle = prompt('请输入新的会话名称:', conversationItem.label);
                        if (newTitle && newTitle.trim()) {
                            await conversationService.updateTitle(conversationItem._id, newTitle.trim());
                            setConversationsItems(prev => prev.map(conv => 
                                conv._id === conversationItem._id 
                                    ? { ...conv, label: newTitle.trim() }
                                    : conv
                            ));
                            message.success('会话名称已更新');
                        }
                    } catch (error) {
                        message.error('更新会话名称失败: ' + error.message);
                    }
                    break;
                case 'delete':
                    try {
                        await conversationService.deleteConversation(conversationItem._id);
                        setConversationsItems(prev => prev.filter(conv => conv._id !== conversationItem._id));
                        message.success('会话已删除');
                    } catch (error) {
                        message.error('删除会话失败: ' + error.message);
                    }
                    break;
                default:
                    console.log('Fun: export conversation', conversation);
                    break;
            }
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
                        items={messages.map(({ id, message, status, history }) => ({
                            key: id,
                            loading: message === 'Waiting...',
                            role: status === 'local' ? 'local' : (history ? 'historicalAi' : 'ai'),
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