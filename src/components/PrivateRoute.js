import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// PrivateRoute 컴포넌트: 인증된 사용자만 접근 가능
export default function PrivateRoute({ children }) {
  const { token } = useAuthStore();

  console.log("Current Token: ", token); // 디버깅용으로 현재 token 값 확인

  // 토큰이 없거나 만료되었을 경우 로그인 페이지로 리다이렉트
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // 토큰이 있을 경우 자식 컴포넌트를 렌더링
  return children;
}
