import React, { useState } from 'react';
import { Flex, Switch, theme } from 'antd';
import { Conversations } from '@ant-design/x';

const demoItems = Array.from({
  length: 4,
}).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
  group: index === 3 ? 'Group2' : 'Group1',
}));

const myItems = [
  {
    key: 'item1',
    label: 'Conversation Item 1',
    disabled: false,
    group: 'Group1',
  },
  {
    key: 'item2',
    label: 'Conversation Item 2',
    disabled: false,
    group: 'Group1',
  },
  {
    key: 'item3',
    label: 'Conversation Item 3',
    disabled: false,
    group: 'Group2',
  },
  {
    key: 'item4',
    label: 'Conversation Item 4',
    disabled: false,
    group: 'Group2',
  },
];

const ConvMTest = () => {
  const [useItemsAsFunction, setUseItemsAsFunction] = useState(false);
  const { token } = theme.useToken();

  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  return (
    <Flex vertical gap="small">
      <Flex gap="large" align="center">
        改变对话列表:
        <Switch
          checked={useItemsAsFunction}
          onChange={(checked) => setUseItemsAsFunction(checked)}
          checkedChildren="myItems"
          unCheckedChildren="demoItems"
        />
      </Flex>
      <Flex gap="large" align="center">
        <Conversations 
          items={useItemsAsFunction ? myItems : demoItems} 
          defaultActiveKey="item1" 
          style={style} 
          groupable 
        />
      </Flex>
    </Flex>
  );
};

export default ConvMTest;