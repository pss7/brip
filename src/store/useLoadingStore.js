import { create } from "zustand";

export const useLoadingStore = create((set) => ({

  // 기본적으로 로딩 상태는 true
  isLoading: true,

  // 로딩 상태 변경 함수
  setLoading: (status) => set({ isLoading: status }),

}));


