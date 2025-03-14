import axios from 'axios';
import { BASE_URL } from '../../apiConfig';

//이력서 목록 조회 API
export async function getResume() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URL}/resume/list`,
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

//이력서 등록 API
export async function createResume(formData) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${BASE_URL}/resume/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("error:", error);
  }
}

// 이력서 삭제 API
export async function deleteResume(resumeId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${BASE_URL}/resume/delete/${resumeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('error:', error);
    return false;
  }
}

// 이력서 수정 API
export async function updateResume(resumeId, formData) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${BASE_URL}/resume/update/${resumeId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error:", error);
    return false;
  }
}

//이력서 상세 조회 API
export async function getResumeDetail(resumeId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URL}/resume/detail/${resumeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data; // ✅ 서버에서 `data` 안에 정보를 감싸서 반환하는 경우
  } catch (error) {
    console.error("이력서 상세 조회 오류:", error);
    return null;
  }
}