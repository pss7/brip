import axios from 'axios';
import { BASE_URL } from '../apiConfig';

//공지사항 목록 API
export async function getNotice() {

  const token = localStorage.getItem("token");

  try {

    const response = await axios.get(`${BASE_URL}/board/notice/list?search=g&sort=latest`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

    // const response = await axios.get(`${BASE_URL}/board/notice/list?search=${searchTerm}&sort=${sortOrder}`);

    return response.data;
  } catch (error) {
    console.error('error :', error);
    return false;
  }
}

//공지사항 상세 API
export async function getDetailNotice(id) {

  const token = localStorage.getItem("token");

  try {

    const response = await axios.get(`${BASE_URL}/board/notice/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

    return response.data.data;

  } catch (error) {

    console.error('error :', error);
    return false;

  }
}