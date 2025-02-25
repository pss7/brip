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
import { login, getKakaoAuthUrl, getGoogleAuthUrl } from "../../api/auth";

export default function SignInPage() {
  const navigate = useNavigate();
  const { setAuthData } = useAuthStore();

  // 이메일, 비밀번호 상태 관리
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isRemembered, setIsRemembered] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 카카오 로그인 처리
  const handleKakaoLogin = () => {
    const authUrl = getKakaoAuthUrl();
    window.location.href = authUrl;
  };

  // 구글 로그인 처리 (카카오와 동일한 구조)
  const handleGoogleLogin = () => {
    const authUrl = getGoogleAuthUrl();
    window.location.href = authUrl;
  };

  function handleEmailChange(e) {
    const emailValue = e.target.value;
    setEmail(emailValue);
    if (!emailValue) {
      setEmailError('이메일을 입력해주세요.');
      return;
    } else if (!emailRegex.test(emailValue)) {
      setEmailError('유효한 이메일 형식을 입력해주세요.');
      return;
    } else {
      setEmailError('');
    }
  }

  function handlePasswordChange(e) {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    if (!passwordValue) {
      setPasswordError('비밀번호를 입력해주세요.');
      return;
    } else {
      setPasswordError('');
    }
  }

  function handleRememberMeChange(e) {
    setIsRemembered(e.target.checked);
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setIsRemembered(true);
    }
  }, []);

  useEffect(() => {
    if (emailRegex.test(email) && password && !emailError && !passwordError) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password, emailError, passwordError]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (isRemembered) {
        localStorage.setItem('savedEmail', email);
      } else {
        localStorage.removeItem('savedEmail');
      }
      setAuthData({
        token: response.token, // 응답 구조에 따라 수정
        email: response.email,
        nickname: response.nickname,
        cuid: response.cuid,
      });
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
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
                <Link to="/passwordfind" className={style.pwFindLink}>
                  비밀번호를 잊어버리셨나요?
                </Link>
              </div>
              <Button text="로그인" customClass={style.btn} disabled={disabled} />
            </form>
            <div className={style.snsListBox}>
              <ul className={style.snsList}>
                <li>
                  <button className={style.naverLogin}>
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
    </Main>
  );
}
