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

// 닉네임 업데이트 API
export async function updateNickname({ nickname }) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BASE_URL}/profile/update/nickname`,
      { nickname },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('updateNickname error:', error);
    return false;
  }
}

// 휴대폰번호 업데이트 API
export async function updatePhone({ phone }) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BASE_URL}/profile/update/phone`,
      { phone },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('updatePhone error:', error);
    return false;
  }
}

// 이메일 업데이트 API
export async function updateEmail({ email }) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BASE_URL}/profile/update/email`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('updateEmail error:', error);
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
