import axios from 'axios';
import { BASE_URL } from '../apiConfig';

export async function getKnowhow() {
  const token = localStorage.getItem("token");

  try {
    // category를 제외한 요청 URL로 수정
    const response = await axios.get(`${BASE_URL}post/list`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Authorization 헤더에 토큰만 전달
      },
      params: {
        page: 0,
        size: 10,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching knowhow posts:", error);
    return false;
  }
}
