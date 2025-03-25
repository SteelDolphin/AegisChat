import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return {
      isHealthy: true,
      message: response.data.message || '后端服务正常运行'
    };
  } catch (error) {
    return {
      isHealthy: false,
      message: error.response?.data?.message || '无法连接到后端服务'
    };
  }
}; 