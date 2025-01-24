import React, { createContext, useState, useEffect } from 'react';

// 1. Context 생성
export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData)); // 로컬스토리지에서 데이터가 있으면 user 상태에 저장
    }
  }, []);

  // 4. 로그인 함수
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));  // 로컬스토리지에 user 데이터 저장
    setUser(userData);  // user 상태 업데이트
  };

  // 5. 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('user');  // 로컬스토리지에서 user 데이터 제거
    setUser(null);  // user 상태 초기화
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};


