import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import "../../styles/login.css";
import LoginImg from "../../assets/images/login/Login_Img.svg";
import Button from "../../components/Button";
import style from "./SignInPage.module.css";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import {
  login,
  getKakaoAuthUrl,
  getGoogleAuthUrl,
  getNaverAuthUrl
} from "../../api/auth";
import CompletePopup from "../../components/CompletePopup";

export default function SignInPage() {

  const navigate = useNavigate();
  const { setAuthData } = useAuthStore();

  // 이메일, 비밀번호 상태
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isRemembered, setIsRemembered] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // 모달을 위한 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 카카오 로그인 처리
  function handleKakaoLogin() {
    const authUrl = getKakaoAuthUrl();
    window.location.href = authUrl;
  }

  // 구글 로그인 처리
  function handleGoogleLogin() {
    const authUrl = getGoogleAuthUrl();
    window.location.href = authUrl;
  }

  // 네이버 로그인 처리
  function handleNaverLogin() {
    const authUrl = getNaverAuthUrl();
    window.location.href = authUrl;
  }

  function handleEmailChange(e) {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (!emailValue) {
      setEmailError("이메일을 입력해주세요.");
    } else if (!emailRegex.test(emailValue)) {
      setEmailError("유효한 이메일 형식을 입력해주세요.");
    } else {
      setEmailError("");
    }
  }

  function handlePasswordChange(e) {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (!passwordValue) {
      setPasswordError("비밀번호를 입력해주세요.");
    } else {
      setPasswordError("");
    }
  }

  function handleRememberMeChange(e) {
    setIsRemembered(e.target.checked);
  }

  // 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setIsRemembered(true);
    }
  }, []);

  // 유효성 검사후 버튼 활성화 결정
  useEffect(() => {
    if (emailRegex.test(email) && password && !emailError && !passwordError) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password, emailError, passwordError]);

  // 폼 제출 함수
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await login(email, password);

      // 로그인 실패 처리
      if (!response.success) {
        setErrorMessage(response.message || "로그인 실패");
        setIsModalOpen(true);
        return;
      }

      // 로그인 성공 처리
      setAuthData({
        token: response.data.token,
        email: response.data.email,
        nickname: response.data.nickname,
        cuid: response.data.cuid,
      });
      navigate("/");

    } catch (error) {
      console.error("로그인 처리 중 오류 발생:", error.message);
      setErrorMessage("로그인 중 문제가 발생했습니다.");
      setIsModalOpen(true);
    }
  }

  return (
    <Main className="subWrap bg">
      <div className="signinBox">
        <Container>
          <div className={`signinContent ${style.signinContent}`}>
            <h3 className={style.title}>로그인</h3>
            <div className={style.imgBox}>
              <img src={LoginImg} alt="로그인 이미지" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className={style.inputBox}>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일 입력"
                  hiddenText="이메일 입력"
                  onChange={handleEmailChange}
                  value={email}
                  error={emailError}
                />
                {emailError && <p className="errorMessage">{emailError}</p>}
              </div>

              <div className={style.inputBox}>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호 입력"
                  hiddenText="비밀번호 입력"
                  onChange={handlePasswordChange}
                  value={password}
                  error={passwordError}
                />
                {passwordError && <p className="errorMessage">{passwordError}</p>}
              </div>

              <div className={style.signinFindBox}>
                <div className={style.inputChkBox}>
                  <input
                    id="loginIdSave"
                    type="checkbox"
                    checked={isRemembered}
                    onChange={handleRememberMeChange}
                  />
                  <label htmlFor="loginIdSave">아이디저장</label>
                </div>
                <Link to="/password-find" className={style.pwFindLink}>
                  비밀번호를 잊어버리셨나요?
                </Link>
              </div>

              <Button
                text="로그인"
                customClass={style.btn}
                disabled={disabled}
              />

            </form>

            <div className={style.snsListBox}>
              <ul className={style.snsList}>
                <li>
                  <button
                    type="button"
                    className={style.naverLogin}
                    onClick={handleNaverLogin}
                  >
                    <span className="blind">네이버 로그인</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={style.kakaoLogin}
                    onClick={handleKakaoLogin}
                  >
                    <span className="blind">카카오 로그인</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={style.googleLogin}
                    onClick={handleGoogleLogin}
                  >
                    <span className="blind">구글 로그인</span>
                  </button>
                </li>
              </ul>
              <div className={style.easySignInBox}>3초 간편로그인</div>
            </div>
            <div className={style.signupLinkBox}>
              <span>아직 계정이 없으신가요?</span>
              <Link to="/signup">회원가입</Link>
            </div>
          </div>
        </Container>
      </div>

      <CompletePopup
        isOpen={isModalOpen}
        message={errorMessage}
        error={true}
        onClose={() => setIsModalOpen(false)}
      />
    </Main>
  );
}
