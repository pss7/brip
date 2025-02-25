import { useEffect, useState } from "react";
import CompletePopup from "../../components/CompletePopup";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import style from "./PasswordReset.module.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { resetPassword } from "../../api/auth";
import { getProfile } from "../../api/user";

export default function PasswordReset() {
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, serError] = useState(false);
  const [disabled, setDisabled] = useState(true);

  //불러온 유저 이메일 상태 관리
  const [email, setEmail] = useState();
  console.log(email);

  // 비밀번호 상태 관리
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 비밀번호 확인 상태 관리
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");

  // 비밀번호 검사 정규식 (영문+숫자+특수문자 6~14자, 대문자 사용 불가)
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,14}$/;

  // 비밀번호 유효성 검사
  function handlePassword(e) {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    if (!passwordValue) {
      setPasswordError("비밀번호를 입력해주세요.");
      setDisabled(true);
    } else if (!passwordRegex.test(passwordValue)) {
      setPasswordError("영문+숫자+특수문자 혼합 6~14자 입력 (대문자 사용불가)");
      setDisabled(true);
    } else {
      setPasswordError("");
    }
  }

  // 비밀번호 확인 유효성 검사
  function handlePasswordCheck(e) {
    const passwordCheckValue = e.target.value;
    setPasswordCheck(passwordCheckValue);
    if (password !== passwordCheckValue) {
      setPasswordCheckError("비밀번호가 일치하지 않습니다.");
      setDisabled(true);
    } else {
      setPasswordCheckError("");
      // 두 입력 모두 정상일 때만 버튼 활성화
      if (password && passwordRegex.test(password)) {
        setDisabled(false);
      }
    }
  }

  // 팝업 닫기 시 처리 (성공 시 로그인 화면으로 이동)
  function handleClosePopup() {
    setIsPopupOpen(false);
    if (error) {
      // 비밀번호 재설정 성공 후 로그인 페이지로 이동 (원하는 경로로 변경)
      window.location.href = "/login";
    }
  }

  // 프로필 데이터에서 이메일 가져오기
  useEffect(() => {
    async function fetchProfile() {
      const response = await getProfile();
      if (response && response.data) {

        setEmail(response.data.email);
      }
    }
    fetchProfile();
  }, []);

  // 비밀번호 재설정 API 호출 (이메일은 상황에 따라 전달, 여기서는 예시로 사용)
  async function handleSubmit(e) {
    e.preventDefault();

    if (!password || !passwordCheck || passwordError || passwordCheckError) {
      return;
    }

    const response = await resetPassword(email, password);

    if (response) {
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
      serError(true);
      setIsPopupOpen(true);
    } else {
      setMessage("비밀번호 변경에 실패하였습니다. 다시 시도해주세요.");
      serError(false);
      setIsPopupOpen(true);
    }
  }

  return (
    <Main className="subWrap bg">
      <div className="signinBox">
        <Container>
          <div className={`signinContent ${style.passwordResetContent}`}>
            <h3 className={style.title}>비밀번호 재설정</h3>
            <p className={style.subText}>사용할 비밀번호를 변경해주세요.</p>
            <div className="container">
              <form onSubmit={handleSubmit}>
                <div className={style.inputBox}>
                  <label htmlFor="password">
                    비밀번호
                    <span className={style.required} title="필수입력">*</span>
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="비밀번호 입력"
                    onChange={handlePassword}
                    error={passwordError}
                  />
                  {passwordError && <p className="errorMessage">{passwordError}</p>}
                </div>
                <div className={style.inputBox}>
                  <label htmlFor="passwordConfirm">
                    비밀번호 확인
                    <span className={style.required} title="필수입력">*</span>
                  </label>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    value={passwordCheck}
                    placeholder="비밀번호 확인 입력"
                    onChange={handlePasswordCheck}
                    error={passwordCheckError}
                  />
                  {passwordCheckError && (
                    <p className="errorMessage">{passwordCheckError}</p>
                  )}
                </div>
                <Button text="비밀번호 변경" disabled={disabled} />
              </form>
            </div>
          </div>
        </Container>
      </div>

      <CompletePopup
        isOpen={isPopupOpen}
        message={message}
        error={!error}
        onClose={handleClosePopup}
      />

    </Main>
  );
}

