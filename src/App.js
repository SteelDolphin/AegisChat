import './styles/App.css';
import React from 'react';
import { Bubble } from '@ant-design/x';
import { Flex, Switch } from 'antd';
import { Button, Space, theme } from 'antd';
import { Typography } from 'antd';
import markdownit from 'markdown-it';
import { CopyOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
// const socket = io('http://localhost:8000');
import { Conversations } from '@ant-design/x';
// import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
// import { ThoughtChain, useXAgent } from '@ant-design/x';


const items = Array.from({
  length: 4,
}).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const md = markdownit({
  html: true,
  breaks: true,
});

const roles = {
  ai: {
    header: 'Ant Design X',
    placement: 'start',
    avatar: {
      icon: <UserOutlined />,
      style: {
        background: '#fde3cf',
      },
    },
    typing: {
      step: 5,
      interval: 20,
    },
    style: {
      maxWidth: 600,
    },
  },
  user: {
    placement: 'end',
    avatar: {
      icon: <UserOutlined />,
      style: {
        background: '#87d068',
      },
    },
  },
};

const mdtext = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const renderMarkdown = (content) => (
  <Typography>
    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
    <div
      dangerouslySetInnerHTML={{
        __html: md.render(content),
      }}
    />
  </Typography>
);

const fooAvatar = {
  color: '#f56a00',
  backgroundColor: '#fde3cf',
};
const barAvatar = {
  color: '#fff',
  backgroundColor: '#87d068',
};
const hideAvatar = {
  visibility: 'hidden',
};
const text = 'Ant Design X love you! ';

function App() {
  const { token } = theme.useToken();
  const [loading, setLoading] = React.useState(true);
  const [repeat, setRepeat] = React.useState(1);
  const [renderKey, setRenderKey] = React.useState(0);
  const [count, setCount] = React.useState(3);
  const listRef = React.useRef(null);


  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };
  
  React.useEffect(() => {
    const id = setTimeout(() => {
      setRenderKey((prev) => prev + 1);
    }, mdtext.length * 100 + 2000);
    return () => {
      clearTimeout(id);
    };
  }, [renderKey]);

  return (
    <Flex gap="middle" vertical>
      <Flex
        gap="small"
        style={{
          alignSelf: 'flex-end',
        }}
      >
        <Button
          onClick={() => {
            setCount((i) => i + 1);
          }}
        >
          Add Bubble
        </Button>

        <Button
          onClick={() => {
            listRef.current?.scrollTo({
              key: 0,
              block: 'nearest',
            });
          }}
        >
          Scroll To First
        </Button>
      </Flex>
    <Bubble
      placement="start"
      content="Good morning, how are you?"
      avatar={{
        icon: <UserOutlined />,
        style: fooAvatar,
      }}
      header="Ant Design X"
      footer={
        <Space size={token.paddingXXS}>
          <Button color="default" variant="text" size="small" icon={<SyncOutlined />} />
          <Button color="default" variant="text" size="small" icon={<CopyOutlined />} />
        </Space>
      }
    />
    <Bubble
      placement="start"
      content="What a beautiful day!"
      styles={{
        avatar: hideAvatar,
      }}
      avatar={{}}
    />
    <Bubble
      placement="end"
      content="Hi, good morning, I'm fine!"
      avatar={{
        icon: <UserOutlined />,
        style: barAvatar,
      }}
    />
    <Bubble
      placement="end"
      loading={loading}
      content={text.repeat(repeat)}
      typing={{
        step: 2,
        interval: 50,
      }}
      styles={{
        avatar: hideAvatar,
      }}
      avatar={{}}
    />
    <Bubble
      typing
      content={mdtext}
      messageRender={renderMarkdown}
      avatar={{
        icon: <UserOutlined />,
      }}
    />
    <Flex gap="large" wrap>
      Loading state:
      <Switch checked={loading} onChange={setLoading} />
    </Flex>
    <Button
        style={{
          alignSelf: 'flex-end',
        }}
        onClick={() => {
          setRepeat((ori) => (ori < 5 ? ori + 1 : 1));
        }}
      >
        Repeat {repeat} Times
      </Button>
      <Bubble.List
        ref={listRef}
        style={{
          maxHeight: 300,
        }}
        roles={roles}
        items={Array.from({
          length: count,
        }).map((_, i) => {
          const isAI = !!(i % 2);
          const content = isAI ? 'Mock AI content. '.repeat(20) : 'Mock user content.';
          return {
            key: i,
            role: isAI ? 'ai' : 'user',
            content,
          };
        })}
      />
    <Conversations items={items} defaultActiveKey="item1" style={style} />;
  </Flex>
  );
}
export default App;

