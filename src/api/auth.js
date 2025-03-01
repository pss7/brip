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
    // localStorage.setItem('token', response.token);
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

// 인증코드 확인 API
export async function verifyResetCode(email, code) {
  try {
    const response = await axios.post(`${BASE_URL}/user/verify-code`, { email, code });
    return response;
  } catch (error) {
    console.error("error:", error);
    return false;
  }
}

// 비밀번호 재설정 API
export async function resetPassword(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/user/reset-password`, {
      email,
      password
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("error:", error);
    return false;
  }
}

// 카카오 로그인 URL 생성 함수
export function getKakaoAuthUrl() {
  const KAKAO_CLIENT_ID = 'b8f42e7ca7621dd36afb2846a53293bf';
  const REDIRECT_URI = 'https://light-dolls-repair.loca.lt/api/user/kakao-login'; // 백엔드에서 토큰 교환 및 로그인 처리할 URI
  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
}

// 카카오 로그인 API
export async function kakaoLogin(code) {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/kakao-login`,
      { code },
      { headers: { 'Content-Type': 'application/json' } }
    );
    // 성공 시 반환받은 토큰 저장 (백엔드의 응답 구조에 따라 수정)
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('kakaoLogin error:', error);
    return false;
  }
}

// 구글 로그인 관련 함수
export function getGoogleAuthUrl() {
  const clientId = '591838263861-khs699q1690jec198bd2aost4rnlljl4.apps.googleusercontent.com';
  const redirectUri = 'http://127.0.0.1:8080/api/user/google-login';
  const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  // 필요한 스코프 설정 (이메일, 프로필 등)
  const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid';

  const params = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'select_account consent'
  };

  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  return `${googleAuthUrl}?${queryString}`;
}

export async function googleLogin(code) {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/google-login`,
      { code },
      { headers: { 'Content-Type': 'application/json' } }
    );
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('googleLogin error:', error);
    return false;
  }
}

// 네이버 로그인 URL 생성 함수
export function getNaverAuthUrl() {
  const NAVER_CLIENT_ID = 'UZgFqw43EZdedZq0USWx';
  const REDIRECT_URI = 'http://127.0.0.1:8080/api/user/naver-login';

  // 로컬스토리지에 state 값이 없으면 새로 생성해서 저장 (CSRF 방지 용도)
  let state = localStorage.getItem('naverOAuthState');
  if (!state) {
    state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('naverOAuthState', state);
  }

  // URL 인코딩 적용
  return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
}











