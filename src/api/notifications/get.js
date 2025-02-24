import axios from 'axios';
import { BASE_URL } from '../apiConfig';

export async function getNotifications() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URL}/notification/list`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
    return response.data;
  } catch (error) {
    console.error('알림 목록 조회 실패:', error);
    return false;
  }
}
