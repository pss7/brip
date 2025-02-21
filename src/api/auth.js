import axios from 'axios';
import { BASE_URL } from './apiConfig';

// 로그인 API
export async function login(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('error:', error);
    return false;
  }
}

// 닉네임 체크 API
export async function checkNickname(nickname) {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/check-nickname`,
      { nickname },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response;
  } catch (error) {
    console.error('error:', error);
    return false;
  }
}

// 회원가입 API
export async function signUp({ name, nickname, email, password }) {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/register`,
      { name, nickname, email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    localStorage.setItem('token', response.token);
    return response;
  } catch (error) {
    console.error('error:', error);
    return false;
  }
}

