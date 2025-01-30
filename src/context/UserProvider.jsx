import React, { createContext, useState, useEffect } from 'react';

// 1. Context 생성
export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // 로딩 상태 추가

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));  // 로컬스토리지에서 데이터가 있으면 user 상태에 저장
    }
    setLoading(false);  // 로딩이 끝났음을 알려줌
  }, []);  // 최초 렌더링 시에만 실행되도록

  // 로그인 함수
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));  // 로컬스토리지에 user 데이터 저장
    setUser(userData);  // user 상태 업데이트
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('user');  // 로컬스토리지에서 user 데이터 제거
    setUser(null);  // user 상태 초기화
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
