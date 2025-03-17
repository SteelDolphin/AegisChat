import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Select } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { userService } from '../../services/userService';
import { CONFIG } from '../../config';

const { Option } = Select;
const { ROLES } = CONFIG;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 处理创建/更新用户
  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser._id, values);
        message.success('用户信息更新成功');
      } else {
        await userService.createUser(values);
        message.success('用户创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(error.message);
    }
  };

  // 处理删除用户
  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId);
      message.success('用户删除成功');
      fetchUsers();
    } catch (error) {
      message.error(error.message);
    }
  };

  // 打开编辑模态框
  const showEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role
    });
    setModalVisible(true);
  };

  // 打开创建模态框
  const showCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username)
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: '管理员', value: ROLES.ADMIN },
        { text: '普通用户', value: ROLES.USER }
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => role === ROLES.ADMIN ? '管理员' : '普通用户'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={showCreateModal}
        >
          创建新用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: CONFIG.PAGE_SIZE,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条数据`
        }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '创建新用户'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择用户角色' }]}
          >
            <Select>
              <Option value={ROLES.USER}>普通用户</Option>
              <Option value={ROLES.ADMIN}>管理员</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? '更新' : '创建'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 