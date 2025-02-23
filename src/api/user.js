import axios from 'axios';
import { BASE_URL } from './apiConfig';

//마이페이지 API
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

//인증코드드 API
export async function sendVerificationCode(email) {
  try {
    const response = await axios.post(`${BASE_URL}/user/verify-code`, { email });
    return response; 
  } catch (error) {
    console.error('error', error);
    return false;
  }
}



