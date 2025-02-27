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
  const handleKakaoLogin = () => {
    const authUrl = getKakaoAuthUrl();
    window.location.href = authUrl;
  };

  // 구글 로그인 처리
  const handleGoogleLogin = () => {
    const authUrl = getGoogleAuthUrl();
    window.location.href = authUrl;
  };

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

  // 유효성 검사 후 버튼 활성화 결정
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
      // 로그인 API 호출
      const response = await login(email, password);

      /**
       * 서버에서 {"result":"fail","message":"이메일 또는 비밀번호가 올바르지 않습니다."}
       * 같은 형태로 반환한다고 가정할 경우.
       */
      if (response.result === "fail") {
        // 로그인 실패 -> 모달 출력, 페이지 이동 X
        setErrorMessage(response.message);
        setIsModalOpen(true);
        return; // 여기서 함수 종료
      }

      // result === "success" 라고 가정
      if (isRemembered) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      // 스토어에 인증 정보 저장
      setAuthData({
        token: response.token, // 응답 구조에 맞게 수정
        email: response.email,
        nickname: response.nickname,
        cuid: response.cuid
      });

      // 로그인 성공 시 메인 페이지로 이동
      navigate("/");

    } catch (error) {

      // 네트워크 에러 / 기타 예외 상황
      console.error("로그인 실패:", error);
      setErrorMessage("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
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

      {/* 로그인 실패 모달 */}
      <CompletePopup
        isOpen={isModalOpen}
        message={errorMessage}
        error={true}
        onClose={() => setIsModalOpen(false)}
      />
    </Main>
  );
}
