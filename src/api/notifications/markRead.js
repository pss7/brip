import axios from 'axios';
import { BASE_URL } from '../apiConfig';

export async function markNotificationAsRead(notificationId) {
  const token = localStorage.getItem("token");

  if (!notificationId) {
    console.error('알림 ID가 유효하지 않습니다');
    return false;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/notification/read/${notificationId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error);
    return false;
  }
}
