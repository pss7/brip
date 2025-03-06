import axios from 'axios';
import { BASE_URL } from './apiConfig';

//프로필 API
export async function getProfile() {
  const token = localStorage.getItem("token");
  try {

    const response = await axios.get(`${BASE_URL}/user/profile`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

    return response.data;
  } catch (error) {
    console.error('error :', error);
    return false;
  }
}

//닉네임 중복 체크 API
export async function getnicknameCheck(nickname) {

  try {
    const response = await axios.post(`${BASE_URL}/user/check-nickname`, { nickname })
    return response;

  } catch (error) {
    console.error('error :', error);
    return false;
  }

}

// 프로필 업데이트 API
export async function updateProfile({ name, nickname, phone, birthDate }) {

  try {
    const response = await axios.post(
      `${BASE_URL}/user/profile/update`,
      { name, nickname, phone, birthDate },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('error:', error);
    return false;
  }

}

// 프로필 이미지 업로드 API
export async function updateProfileImage(file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("profileImage", file);
  try {
    const response = await axios.post(
      `${BASE_URL}/user/profile/image`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("updateProfileImage error:", error);
    return false;
  }
}

//이력서 수정 API
export async function updateResume(formData) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${BASE_URL}/resume/update/`, // FormData 객체를 URL에 포함시키지 않습니다.
      formData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          // axios가 FormData인 경우 자동으로 올바른 Content-Type 헤더를 설정합니다.
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("updateResume error:", error);
    return false;
  }
}