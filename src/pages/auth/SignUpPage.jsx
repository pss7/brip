import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import CompletePopup from "../../components/CompletePopup";
import style from "./SignUpPage.module.css";
import { checkNickname, signUp } from "../../api/auth";

export default function SignUpPage() {
  const navigate = useNavigate();

  // 기본 상태
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  // 핸드폰, 생년월일 추가
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // 이메일 관련
  const [email, setEmail] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [isCustomEmail, setIsCustomEmail] = useState(false);
  const presetEmailDomains = ["직접 입력", "gmail.com", "naver.com", "daum.net"];

  // 비밀번호 관련
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  // 약관 동의
  const [agreements, setAgreements] = useState({
    agreeAll: false,
    agreeAge: false,
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  // 모달 상태
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupError, setIsPopupError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // 닉네임 & 비밀번호 정규식
  const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,12}$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,14}$/;

  // 모달 닫기 => 회원가입 성공 시 /signin 이동
  const closePopup = () => {
    setIsPopupOpen(false);
    if (registrationSuccess) {
      navigate("/signin");
    }
  };

  // 이메일 도메인 Select 변경
  function handleEmailDomainChange(value) {
    if (value === "직접 입력") {
      setIsCustomEmail(true);
      setEmailDomain("");
    } else {
      setIsCustomEmail(false);
      setEmailDomain(value);
    }
  }

  // 닉네임 입력
  function handleNicknameChange(e) {
    const newVal = e.target.value;
    setNickname(newVal);
    setIsNicknameAvailable(false);

    if (!newVal) {
      setNicknameError("닉네임을 입력해주세요.");
    } else if (!nicknameRegex.test(newVal)) {
      setNicknameError("닉네임은 2~12자, 특수문자 및 공백을 포함할 수 없습니다.");
    } else {
      setNicknameError("");
    }
  }

  // 닉네임 중복확인
  async function handleNicknameCheck() {
    if (!nickname || nicknameError) {
      setPopupMessage("유효한 닉네임을 입력해주세요.");
      setIsPopupError(true);
      setIsPopupOpen(true);
      return;
    }

    try {
      const response = await checkNickname(nickname);
      if (response.data.result === "fail") {
        // 이미 존재하는 닉네임
        setNicknameError(response.data.message);
        setIsNicknameAvailable(false);
        setPopupMessage(response.data.message);
        setIsPopupError(true);
        setIsPopupOpen(true);
      } else {
        // 사용 가능한 닉네임
        setNicknameError("");
        setIsNicknameAvailable(true);
        setPopupMessage(response.data.message || "사용 가능한 닉네임입니다.");
        setIsPopupError(false);
        setIsPopupOpen(true);
      }
    } catch (error) {
      console.error("닉네임 중복확인 오류:", error);
      setPopupMessage("닉네임 중복 확인 중 오류가 발생하였습니다.");
      setIsPopupError(true);
      setIsPopupOpen(true);
    }
  }

  // 비밀번호 입력
  function handlePasswordChange(e) {
    const newVal = e.target.value;
    setPassword(newVal);

    if (!newVal) {
      setPasswordError("비밀번호를 입력해주세요");
    } else if (!passwordRegex.test(newVal)) {
      setPasswordError("영문+숫자+특수문자 혼합 6~14자 입력 (대문자 사용불가)");
    } else {
      setPasswordError("");
    }
  }

  // 비밀번호 확인
  function handlePasswordCheck(e) {
    const newVal = e.target.value;
    setPasswordCheck(newVal);
    setIsPasswordMatch(password === newVal);
  }

  // 전체동의
  function handleAgreeAllChange(e) {
    const checked = e.target.checked;
    setAgreements({
      agreeAll: checked,
      agreeAge: checked,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
    });
  }

  // 개별동의
  function handleAgreementChange(e, agreement) {
    const { checked } = e.target;
    setAgreements((prev) => {
      const newVal = { ...prev, [agreement]: checked };
      const allRequiredChecked =
        newVal.agreeAge && newVal.agreeTerms && newVal.agreePrivacy;
      return { ...newVal, agreeAll: allRequiredChecked };
    });
  }

  // 회원가입 처리
  async function handleSignUp(e) {
    e.preventDefault();

    // 필수 입력값
    if (!name || !nickname || !email || !emailDomain || !password || !passwordCheck || !phoneNumber || !birthDate) {
      setPopupMessage("모든 필수 입력값을 확인해주세요.");
      setIsPopupError(true);
      setIsPopupOpen(true);
      return;
    }

    // 필수 약관
    if (!agreements.agreeAge || !agreements.agreeTerms || !agreements.agreePrivacy) {
      setPopupMessage("필수 약관(만 14세 이상, 서비스 이용약관, 개인정보처리방침)에 모두 동의해주세요.");
      setIsPopupError(true);
      setIsPopupOpen(true);
      return;
    }

    // 이메일 합치기
    const fullEmail = `${email}@${emailDomain}`;

    try {
      // 회원가입 API
      const response = await signUp({
        name,
        nickname,
        email: fullEmail,
        password,
        phoneNumber,
        birthDate,
      });

      //서버 응답이 실패일 경우
      if (response.data.result === "fail") {
        setPopupMessage(response.data.message || "회원가입에 실패하였습니다.");
        setIsPopupError(true);
        setIsPopupOpen(true);
        return;
      }
      if (response && response.data) {
        setPopupMessage("회원가입이 완료되었습니다.");
        setIsPopupError(false);
        setRegistrationSuccess(true);
        setIsPopupOpen(true);
      } else {
        const failMsg = response?.data?.message || "회원가입에 실패하였습니다.";
        setPopupMessage(failMsg);
        setIsPopupError(true);
        setIsPopupOpen(true);
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      const errMsg = error?.response?.data?.message || "회원가입 중 오류가 발생하였습니다.";
      setPopupMessage(errMsg);
      setIsPopupError(true);
      setIsPopupOpen(true);
    }
  }

  return (
    <Main className="subWrap bg">
      <div className="signinBox">
        <Container>
          <div className={`signinContent ${style.signinContent}`}>
            <h3 className={style.title}>회원가입</h3>
            <div className="container">
              <form onSubmit={handleSignUp}>

                {/* 이름 */}
                <div className="inputWrap">
                  <div className="inputBox">
                    <Input
                      id="name"
                      label="이름"
                      placeholder="이름 입력"
                      className="mb-15"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* 닉네임 */}
                <div className="inputWrap">
                  <label className="mb-15">닉네임</label>
                  <div className={style.inputNicknameBox}>
                    <Input
                      type="text"
                      placeholder="닉네임 입력"
                      value={nickname}
                      onChange={handleNicknameChange}
                    />
                    <button
                      className={style.duplicateChkBtn}
                      type="button"
                      onClick={handleNicknameCheck}
                      disabled={!nickname || !!nicknameError}
                    >
                      중복확인
                    </button>
                  </div>
                </div>

                {/* 핸드폰 번호 */}
                <div className="inputWrap">
                  <div className="inputBox">
                    <Input
                      id="phoneNumber"
                      label="핸드폰 번호"
                      placeholder="핸드폰 번호 입력"
                      className="mb-15"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* 생년월일 */}
                <div className="inputWrap">
                  <div className="inputBox">
                    <Input
                      id="birthDate"
                      label="생년월일"
                      placeholder="YYYY-MM-DD"
                      className="mb-15"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* 이메일 */}
                <div className="inputWrap">
                  <label className="mb-15">이메일</label>
                  <div className={style.layoutBox}>
                    <div className={`inputBox ${style.inputEmailBox}`}>
                      <Input
                        id="emailId"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      @
                      <Input
                        id="emailDomain"
                        type="text"
                        value={emailDomain}
                        onChange={(e) => setEmailDomain(e.target.value)}
                        disabled={!isCustomEmail}
                      />
                    </div>
                    <Select
                      className={style.select}
                      id="emailSelect"
                      options={presetEmailDomains}
                      onChange={handleEmailDomainChange}
                      hiddenText="이메일 선택"
                    />
                  </div>
                </div>

                {/* 비밀번호 */}
                <div className="inputWrap">
                  <label htmlFor="password" className="mb-15">
                    비밀번호
                  </label>
                  <div className="inputBox">
                    <Input
                      id="password"
                      type="password"
                      placeholder="비밀번호 입력"
                      value={password}
                      onChange={handlePasswordChange}
                      error={passwordError}
                    />
                  </div>
                  {passwordError && <p className="errorMessage">{passwordError}</p>}
                </div>

                {/* 비밀번호 확인 */}
                <div className="inputWrap">
                  <label htmlFor="passwordCheck" className="mb-15">
                    비밀번호 확인
                  </label>
                  <div className="inputBox">
                    <Input
                      id="passwordCheck"
                      type="password"
                      placeholder="비밀번호 확인 입력"
                      value={passwordCheck}
                      onChange={handlePasswordCheck}
                      error={!isPasswordMatch}
                    />
                  </div>
                  {!isPasswordMatch && (
                    <p className="errorMessage">비밀번호가 일치하지 않습니다.</p>
                  )}
                </div>

                {/* 약관 동의 */}
                <div className={style.agreeChkBox}>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk01"
                      type="checkbox"
                      checked={agreements.agreeAll}
                      onChange={handleAgreeAllChange}
                      className="blind"
                    />
                    <label htmlFor="agreeChk01" className="allChk">
                      모두 동의
                    </label>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk02"
                      type="checkbox"
                      checked={agreements.agreeAge}
                      onChange={(e) => handleAgreementChange(e, "agreeAge")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk02">
                      만 14세 이상 가입 동의 (필수)
                    </label>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk03"
                      type="checkbox"
                      checked={agreements.agreeTerms}
                      onChange={(e) => handleAgreementChange(e, "agreeTerms")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk03">
                      서비스 이용약관 동의 (필수)
                    </label>
                    <Link to="/terms">약관보기</Link>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk04"
                      type="checkbox"
                      checked={agreements.agreePrivacy}
                      onChange={(e) => handleAgreementChange(e, "agreePrivacy")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk04">
                      개인정보처리방침 동의 (필수)
                    </label>
                    <Link to="/policy">약관보기</Link>
                  </div>
                  <div className={style.inputChkBox}>
                    <input
                      id="agreeChk05"
                      type="checkbox"
                      checked={agreements.agreeMarketing}
                      onChange={(e) => handleAgreementChange(e, "agreeMarketing")}
                      className="blind"
                    />
                    <label htmlFor="agreeChk05">
                      마케팅 정보 수신 동의 (선택)
                    </label>
                    <Link to="/terms">약관보기</Link>
                  </div>
                </div>

                <Button
                  text="회원가입"
                  type="submit"
                />

              </form>
            </div>
            <div className="linkBox">
              <ArrowPrevButton href="/signin" hiddenText="로그인 화면으로 이동" />
            </div>
          </div>
        </Container>
      </div>

      <CompletePopup
        isOpen={isPopupOpen}
        message={popupMessage}
        error={isPopupError}
        onClose={closePopup}
      />
    </Main>
  );
}
