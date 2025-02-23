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

// 인증코드 전송 API
export async function sendVerificationCode(email) {
  try {
    const response = await axios.post(`${BASE_URL}/user/send-verification`, { email });
    return response;
  } catch (error) {
    console.error('error:', error);
    return false;
  }
}

// 인증코드 확인
export async function verifyResetCode(email, code) {
  try {
    const response = await axios.post(`${BASE_URL}/user/verify-code`, { email, code });
    return response;
  } catch (error) {
    console.error("error:", error);
    return false;
  }
}

// 비밀번호 재설정
export async function resetPassword(email, code, newPassword) {
  try {
    const response = await axios.post(`${BASE_URL}/user/reset-password`, { email, code, newPassword });
    return response;
  } catch (error) {
    console.error("erroe:", error);
    return false;
  }
}
