import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const gameAPI = {
  saveScore: async (scoreData) => {
    try {
      const response = await api.post('/score', scoreData);
      return response.data;
    } catch (error) {
      console.error('점수를 저장하는 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  getLeaderboard: async () => {
    try {
      const response = await api.get('/leaderboard');
      return response.data;
    } catch (error) {
      console.error('리더보드를 가져오는 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('통계를 가져오는 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('서버 상태 확인 중 오류가 발생했습니다:', error);
      throw error;
    }
  }
};

export default api;