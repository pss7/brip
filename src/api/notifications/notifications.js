import axios from 'axios';
import { BASE_URL } from '../apiConfig';

//알림 목록 API
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

//알림 읽음 API
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

// 전체 알림 읽음 API
export async function markAllNotificationsAsRead() {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${BASE_URL}/notification/read-all`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('전체 알림 읽음 처리 실패:', error);
    return false;
  }
}

//알림 상세 API
export async function getNotificationDetail(notificationId) {
  const token = localStorage.getItem("token");
  if (!notificationId) {
    console.error('알림 ID가 유효하지 않습니다');
    return false;
  }
  try {
    const response = await axios.get(
      `${BASE_URL}/notification/detail/${notificationId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('알림 상세 조회 실패:', error);
    return false;
  }
}
