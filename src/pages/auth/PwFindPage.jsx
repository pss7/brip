import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import "../../styles/login.css";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import Button from "../../components/Button";
import style from "./PwFindPage.module.css";
import Input from "../../components/Input";
import { sendVerificationCode, verifyResetCode } from "../../api/auth"; // 수정된 API 함수 임포트
import CompletePopup from "../../components/CompletePopup"; // CompletePopup 컴포넌트 임포트
import { useNavigate } from "react-router-dom";

export default function PwFindPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // 인증코드 상태 추가
  const [sentCode, setSentCode] = useState(""); // 발송된 코드 저장
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증코드 발송 상태
  const [message, setMessage] = useState(""); // 메시지 상태
  const [error, setError] = useState(false); // 에러 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 열기 여부
  const [timer, setTimer] = useState(180); // 타이머 (3분 = 180초)

  // 이메일 입력 처리
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // 인증코드 입력 처리
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  // 타이머 업데이트
  useEffect(() => {
    let countdown;
    if (isCodeSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setMessage("인증시간이 초과되었습니다. 새 코드를 요청하세요.");
      setError(true);
      setIsPopupOpen(true); // 팝업 열기
    }

    return () => clearInterval(countdown); // 타이머 정리
  }, [isCodeSent, timer]);

  // 인증코드 발송 처리
  const handleSendResetCode = async () => {
    if (!email) {
      setMessage("이메일을 입력해주세요.");
      setError(true);
      setIsPopupOpen(true); // 팝업을 열기
      return;
    }

    try {
      const response = await sendVerificationCode(email); // API 호출
      console.log(response); // API 응답을 로그로 확인

      if (response) {
        setSentCode(response); // 받은 인증코드를 저장
        setMessage("인증코드가 발송되었습니다.");
        setIsCodeSent(true);
        setError(false); // 인증 성공
        setTimer(180); // 타이머 초기화
      } else {
        setMessage("인증코드 발송 실패");
        setError(true); // 인증 실패
      }
      setIsPopupOpen(true); // 팝업을 열기
    } catch (error) {
      console.error("error:", error);
      setMessage("인증 코드 발송 실패");
      setError(true); // 인증 실패
      setIsPopupOpen(true); // 팝업을 열기
    }
  };

  // 인증코드 검증 처리
  const handleVerifyCode = async () => {
    try {
      const response = await verifyResetCode(email, verificationCode); // 서버 검증 요청

      if (response && response.status === 200) {
        setMessage("인증코드가 확인되었습니다.");
        setError(false);
        setIsPopupOpen(true); // ✅ 팝업을 먼저 열고

        // ✅ 팝업의 확인 버튼을 눌렀을 때 이동하도록 설정
      } else {
        setMessage("인증코드가 올바르지 않습니다.");
        setError(true);
        setIsPopupOpen(true);
      }
    } catch (error) {
      console.error("error:", error);
      setMessage("인증 과정에서 오류가 발생했습니다.");
      setError(true);
      setIsPopupOpen(true);
    }
  };

  // 팝업의 확인 버튼을 눌렀을 때 실행될 함수
  const handleClosePopup = () => {
    setIsPopupOpen(false);

    // ✅ 인증 성공 후 팝업을 닫을 때만 이동하도록 처리
    if (!error && message === "인증코드가 확인되었습니다.") {
      navigate("/reset-password", { state: { email } });
    }
  };
  return (
    <Main className="subWrap bg">
      <div className="signinBox">
        <Container>
          <div className={`signinContent ${style.signinContent}`}>
            <h3 className={style.title}>비밀번호 찾기</h3>
            <p className={style.subText}>비밀번호를 재설정할 수 있는 인증코드를 보내드려요.</p>

            <div className="container">
              <form>
                <div className={style.inputWrap}>
                  <div className="inputBox">
                    <Input
                      label="이메일"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      type="text"
                      className="mb-15"
                    />
                  </div>
                </div>

                {isCodeSent && (
                  <>
                    <div className={style.inputWrap}>
                      <div className="inputBox">
                        <Input
                          value={verificationCode}
                          onChange={handleVerificationCodeChange}
                          type="text"
                          className="mb-15"
                          maxLength="6"
                          placeholder="인증코드 입력"
                        />
                      </div>
                    </div>
                    <p className={style.codeTime}>{timer}</p>
                  </>
                )}

                <div className={style.codeBox}>
                  <span>인증코드가 오지 않나요?</span>
                  <button
                    className={style.codeBtn}
                    type="button"
                    onClick={handleSendResetCode}
                  >
                    인증코드 재전송
                  </button>
                </div>

                <Button
                  type="button"
                  text={isCodeSent ? "확인" : "인증코드받기"}
                  onClick={isCodeSent ? handleVerifyCode : handleSendResetCode}
                />
              </form>
            </div>

            <div className="linkBox">
              <ArrowPrevButton href="/signin" hiddenText="로그인 화면으로 이동" />
            </div>
          </div>
        </Container>
      </div>

      {/* CompletePopup */}
      <CompletePopup
        isOpen={isPopupOpen}
        message={message}
        error={error}
        onClose={handleClosePopup}
      />
    </Main>
  );
}
