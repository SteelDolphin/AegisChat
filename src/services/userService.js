import axios from 'axios';
import { API_BASE_URL } from '../config';

export const userService = {
  // 获取所有用户
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取用户列表失败');
    }
  },

  // 创建新用户
  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, userData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '创建用户失败');
    }
  },

  // 更新用户信息
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新用户信息失败');
    }
  },

  // 删除用户
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '删除用户失败');
    }
  }
}; 