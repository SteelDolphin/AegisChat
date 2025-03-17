import { UserOutlined } from '@ant-design/icons';

export const roles = {
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
    historicalAi: {
        placement: 'start',
        avatar: {
            icon: <UserOutlined />,
            style: {
                background: '#fde3cf',
            },
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