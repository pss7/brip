import Container from "../components/Container";
import Main from "../components/section/Main";
import "../assets/css/login.css";
import LoginImg from "../assets/images/login/Login_Img.svg"
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import style from "./SignInPage.module.css";
import Input from "../components/Input";
import { useState } from "react";
import { userData } from "../data/userData";

export default function SignInPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // 에러 메시지 관리
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  const validEmail = userData.email;
  const validPassword = userData.password;

  // 로그인 처리 함수
  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true); // 로딩 시작

    if (email === validEmail && password === validPassword) {

      localStorage.setItem("authToken", "dummyToken_12345");
      localStorage.setItem("user", JSON.stringify(userData));  // 사용자 정보 저장

      // 마지막으로 접근하려던 페이지로 리디렉션
      const redirectUrl = localStorage.getItem('redirectUrl') || '/'; // 기본 페이지는 /home
      navigate(redirectUrl);

    } else {
      // 인증 실패 시 에러 메시지 표시
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    setIsLoading(false); // 로딩 종료

  };

  return (
    <>
      <Main className="subWrap bg">

        <div className="signinBox signinSt">
          <Container>
            <div className="signinContent">

              <h3>
                로그인
              </h3>

              <div className="imgBox">
                <img src={LoginImg} alt="" />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="inputBox">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="이메일 입력"
                    hiddenText="이메일 입력"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="inputBox">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="비밀번호 입력"
                    hiddenText="비밀번호 입력"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="signinFindBox">
                  <div className="inputChkBox">
                    <input id="loginIdSave" type="checkbox" />
                    <label htmlFor="loginIdSave" className="loginIdSave">
                      아이디저장
                    </label>
                  </div>
                  <Link to="/passwordfind" className="pwFindLink">
                    비밀번호를 잊어버리셨나요?
                  </Link>
                </div>

                {
                  error && <p className="error-message">{error}</p>
                }

                {
                  isLoading ? "로그인 중" : (
                    <Button
                      text="로그인"
                      customClass={style.btnSt}
                    />
                  )
                }

              </form>

              <div className="snsListBox">
                <ul className="snsList">
                  <li>
                    <Link to="/" className="naverLogin">
                      <span className="blind">
                        네이버 로그인
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="kakaoLogin">
                      <span className="blind">
                        카카오 로그인
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="googleLogin">
                      <span className="blind">
                        구글 로그인
                      </span>
                    </Link>
                  </li>
                </ul>

                <div className="easySignInBox">
                  3초 간편로그인
                </div>

              </div>

              <div className="signupLinkBox">
                <span>
                  아직 계정이 없으신가요?
                </span>
                <Link to="/signup">
                  회원가입
                </Link>
              </div>

            </div>
          </Container>
        </div >
      </Main >
    </>
  )

}