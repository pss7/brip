import { create } from "zustand";

// 로그인 상태 관리
export const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  email: "",
  nickname: localStorage.getItem("nickname") || null,
  cuid: "",

  // 로그인 상태 설정 함수
  setAuthData: (data) => {
    set({
      token: data.token,
      email: data.email,
      nickname: data.nickname,
      cuid: data.cuid,
    });

    // localStorage에 토큰 저장
    localStorage.setItem("token", data.token);
    localStorage.setItem("nickname", data.nickname);
  },

  // 로그아웃 함수 (UI 상태 즉시 반영)
  logout: () => {
    set({ token: null, email: "", nickname: "", cuid: "" });

    // localStorage에서 토큰 제거
    localStorage.removeItem("token");
  },

}));
