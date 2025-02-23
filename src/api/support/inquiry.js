import axios from 'axios';
import { BASE_URL } from '../apiConfig';

//문의사항 목록 API
export async function getInquiry() {

  const token = localStorage.getItem("token");

  try {

    const response = await axios.get(`${BASE_URL}/board/inquiry/list`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

    return response.data.data;
  } catch (error) {
    console.error('error:', error);
    return false;
  }
}

//문의사항 상세 API
export async function getInquiryDetail(id) {

  const token = localStorage.getItem("token");

  try {

    const response = await axios.get(`${BASE_URL}/board/inquiry/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

    return response.data.data;
  } catch (error) {
    console.error('error:', error);
    return false;
  }
}

// 문의사항 등록 API
export async function createInquiry(formData) {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${BASE_URL}/board/inquiry/create`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`, 
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('error:', error);
    return false;
  }
}
