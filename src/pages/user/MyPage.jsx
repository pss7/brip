import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import kakao from "../../assets/images/login/Kakao_Img.svg";
import naver from "../../assets/images/login/Naver_Img.svg";
import google from "../../assets/images/login/Google_Img.svg";
import style from "./MyPage.module.css";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import { getnicknameCheck, getProfile, updateEmail, updateNickname, updatePhone } from "../../api/user";
import CompletePopup from "../../components/CompletePopup";
import ConfirmPopup from "../../components/ConfirmPopup";
import Loading from "../../components/Loading";
import { useAuthStore } from "../../store/useAuthStore";
import { logout, withdraw } from "../../api/auth";
import {
  getKakaoAuthUrl,
  getGoogleAuthUrl,
  getNaverAuthUrl,
  disconnectSNS,
} from "../../api/auth.js";

export default function MyPage() {
  const navigate = useNavigate();
  const { logout: clearAuthData } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  // 로그아웃 함수
  async function handleLogout() {
    try {
      const response = await logout();
      if (response) {
        console.log("로그아웃 성공");
        clearAuthData();
        navigate("/");
      } else {
        console.log("로그아웃 실패");
      }
    } catch (error) {
      console.error("error:", error);
    }
  }

  // 로딩 상태 관리
  const [isLoading, setLoading] = useState(false);

  // 데이터 상태 관리
  const [profileData, setProfileData] = useState([]);

  // 팝업 상태 관리
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupError, setPopupError] = useState(false);
  const [confirmPopupOpen, setConfirmPopupOpen] = useState(false);

  // 에러 상태 관리
  const [error, setError] = useState("");

  // 버튼 활성화/비활성화 상태 관리
  const [disabled, setDisabled] = useState(true);

  // 닉네임 상태 관리
  const [nickname, setNickname] = useState();
  const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,12}$/;

  // SNS 연동 상태 관리 (서버에서 받은 정보로 업데이트할 수 있음)
  const [snsStatus, setSnsStatus] = useState({
    naver: false,
    kakao: false,
    google: false,
  });

  // 닉네임 상태 업데이트 함수
  function handleNicknameChange(e) {
    setNickname(e.target.value);
    setIsNicknameValid(false);
  }

  async function handleNicknameUpdate() {
    if (!isNicknameValid) {
      setPopupMessage("닉네임 중복 체크를 먼저 진행해주세요.");
      setPopupError(true);
      setPopupOpen(true);
      return;
    }

    try {
      const response = await updateNickname({ nickname });
      if (response && response.result === "success") {
        setPopupMessage("닉네임이 변경되었습니다.");
        setPopupError(false);
        setProfileData(prev => ({ ...prev, nickname }));
      } else {
        setPopupMessage("닉네임 변경에 실패했습니다.");
        setPopupError(true);
      }
      setPopupOpen(true);
    } catch (error) {
      setPopupMessage("닉네임 변경 중 오류가 발생했습니다.");
      setPopupError(true);
      setPopupOpen(true);
    }
  }

  // 닉네임 중복 체크 함수
  async function handleDuplicateCheck() {
    try {
      const response = await getnicknameCheck(nickname);
      if (response && response.data.result === "success") {
        setPopupMessage("사용 가능한 닉네임입니다.");
        setPopupError(false);
        setIsNicknameValid(true);
      } else {
        setPopupMessage("이미 사용 중인 닉네임입니다.");
        setPopupError(true);
      }
      setPopupOpen(true);
    } catch (error) {
      setPopupMessage("닉네임 중복 체크 중 오류가 발생했습니다.");
      setPopupError(true);
      setPopupOpen(true);
    }
  }
  // 서비스 해지 팝업 열기 함수
  function openConfirmPopup() {
    setConfirmPopupOpen(true);
  }

  async function handleEmailUpdate() {
    try {
      const response = await updateEmail({ email });
      if (response && response.result === "success") {
        setPopupMessage("이메일이 변경되었습니다.");
        setPopupError(false);
        setProfileData(prev => ({ ...prev, email }));
      } else {
        setPopupMessage("이메일 변경 실패");
        setPopupError(true);
      }
      setPopupOpen(true);
    } catch (error) {
      setPopupMessage("이메일 변경 중 오류 발생");
      setPopupError(true);
      setPopupOpen(true);
    }
  }

  // 서비스 해지 확인 함수
  async function handleConfirmTermination() {
    try {
      const response = await withdraw();
      if (response) {
        console.log("탈퇴 완료");
        localStorage.removeItem("token");
        clearAuthData();
        navigate("/");
      } else {
        console.log("탈퇴 실패");
      }
    } catch (error) {
      console.error("탈퇴 처리 오류:", error);
    }
    setConfirmPopupOpen(false);
  }

  // 서비스 해지 취소 함수
  function handleCancelTermination() {
    setConfirmPopupOpen(false);
  }

  // SNS 연결 함수 (연결 버튼 클릭 시 해당 SNS 로그인 URL로 리다이렉트)
  function handleConnectSNS(provider) {
    if (provider === "naver") {
      window.location.href = getNaverAuthUrl();
    } else if (provider === "kakao") {
      window.location.href = getKakaoAuthUrl();
    } else if (provider === "google") {
      window.location.href = getGoogleAuthUrl();
    }
  }

  // SNS 해제 함수 (해제 버튼 클릭 시 서버에 해제 요청)
  async function handleDisconnectSNS(provider) {
    try {
      const response = await disconnectSNS(provider);
      if (response && response.result === "success") {
        setPopupMessage(`${provider} 연동 해제 완료`);
        // 해제 성공 시 상태 업데이트
        setSnsStatus(prev => ({ ...prev, [provider]: false }));
      } else {
        setPopupMessage(`${provider} 연동 해제 실패`);
      }
      setPopupError(!(response && response.result === "success"));
      setPopupOpen(true);
    } catch (error) {
      console.error("SNS 해제 오류:", error);
      setPopupMessage(`${provider} 연동 해제 중 오류 발생`);
      setPopupError(true);
      setPopupOpen(true);
    }
  }

  async function handlePhoneUpdate() {
    try {
      const response = await updatePhone({ phone });
      if (response && response.result === "success") {
        setPopupMessage("휴대폰 번호가 변경되었습니다.");
        setPopupError(false);
        setProfileData(prev => ({ ...prev, phone }));
      } else {
        setPopupMessage("휴대폰 번호 변경 실패");
        setPopupError(true);
      }
      setPopupOpen(true);
    } catch (error) {
      setPopupMessage("휴대폰 번호 변경 중 오류 발생");
      setPopupError(true);
      setPopupOpen(true);
    }
  }

  // 데이터 불러오기
  useEffect(() => {

    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await getProfile();
        if (response && response.data) {
          setProfileData(response.data);
          setNickname(response.data.nickname || "");
          setPhone(response.data.phone || "");
          setEmail(response.data.email || "");
          if (response.data.snsStatus) setSnsStatus(response.data.snsStatus);
        }
      } catch (error) {
        console.error("프로필 데이터 불러오기 오류:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();

  }, []);

  return (
    <Main className="subWrap bg">
      <div className="mypageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/mypage" className="active">
                  <span>프로필</span>
                </Link>
                <Link to="/interest"><span>관심공고</span></Link>
                <Link to="/resume"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>

              <div className={`content ${style.content}`}>
                <div className={style.box}>
                  <h4 className={`title ${style.title}`}>프로필</h4>

                  {
                    isLoading ? (
                      <Loading center />
                    ) : (
                      <>
                        <form>
                          <div className="inputWrap">
                            <div className="inputBox">
                              <Input
                                id="name"
                                type="text"
                                value={profileData.name}
                                label="이름"
                                className="mb-15"
                                disabled={true}
                              />
                            </div>
                          </div>

                          <div className="inputWrap">
                            <label htmlFor="nickname" className="mb-15">닉네임</label>
                            <div className={`inputBox ${style.inputNicknameBox}`}>
                              <Input id="nickname" type="text" value={nickname} onChange={handleNicknameChange} />
                              {isNicknameValid ? (
                                <button className={style.changeBtn} type="button" onClick={handleNicknameUpdate}>
                                  변경
                                </button>
                              ) : (
                                <button className={style.duplicateChkBtn} type="button" onClick={handleDuplicateCheck}>
                                  중복 체크
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="inputWrap">
                            <label htmlFor="phone" className="mb-15">휴대폰 번호</label>
                            <div className="inputBox">
                              <Input id="phone" type="text" value={phone} onChange={e => setPhone(e.target.value)} />
                              <button className={style.changeBtn} type="button" onClick={handlePhoneUpdate}>
                                변경
                              </button>
                            </div>
                          </div>

                          <div className="inputWrap">
                            <label htmlFor="email">이메일</label>
                            <div className="inputBox">
                              <Input id="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                              <button className={style.changeBtn} type="button" onClick={handleEmailUpdate}>
                                변경
                              </button>
                            </div>
                          </div>

                          <div className="inputWrap">
                            <div className="inputBox">
                              <Input
                                id="birthdate"
                                type="text"
                                value={profileData.birth_date}
                                label="생년월일"
                                className="mb-15"
                                disabled={true}
                              />
                            </div>
                          </div>
                        </form>

                        <div className={style.snsSignInBox}>
                          <h5>SNS 로그인 연결</h5>
                          <ul className={style.snsSignInList}>
                            <li className={style.naver}>
                              <div className={style.imgBox}>
                                <img src={naver} alt="네이버로그인" />
                              </div>
                              <span className={style.snsText}>네이버 로그인</span>
                              {snsStatus.naver ? (
                                <button className={style.disconnectBtn} onClick={() => handleDisconnectSNS("naver")}>
                                  해제
                                </button>
                              ) : (
                                <button className={style.connectBtn} onClick={() => handleConnectSNS("naver")}>
                                  연결
                                </button>
                              )}
                            </li>
                            <li className={style.kakao}>
                              <div className={style.imgBox}>
                                <img src={kakao} alt="카카오로그인" />
                              </div>
                              <span className={style.snsText}>카카오 로그인</span>
                              {snsStatus.kakao ? (
                                <button className={style.disconnectBtn} onClick={() => handleDisconnectSNS("kakao")}>
                                  해제
                                </button>
                              ) : (
                                <button className={style.connectBtn} onClick={() => handleConnectSNS("kakao")}>
                                  연결
                                </button>
                              )}
                            </li>
                            <li className={style.google}>
                              <div className={style.imgBox}>
                                <img src={google} alt="구글로그인" />
                              </div>
                              <span className={style.snsText}>구글 로그인</span>
                              {snsStatus.google ? (
                                <button className={style.disconnectBtn} onClick={() => handleDisconnectSNS("google")}>
                                  해제
                                </button>
                              ) : (
                                <button className={style.connectBtn} onClick={() => handleConnectSNS("google")}>
                                  연결
                                </button>
                              )}
                            </li>
                          </ul>
                        </div>

                        <button className={style.btn} onClick={handleLogout}>
                          로그아웃
                        </button>

                        <button className={style.btn} onClick={openConfirmPopup}>
                          서비스 해지
                        </button>
                      </>
                    )
                  }

                </div>
              </div>
            </div>
          </div >
        </Container >
      </div >

      <ConfirmPopup
        isOpen={confirmPopupOpen}
        message="서비스를 해지하시겠습니까?"
        onConfirm={handleConfirmTermination}
        onClose={handleCancelTermination}
        confirmText="확인"
        cancelText="취소"
      />

      <CompletePopup
        isOpen={popupOpen}
        message={popupMessage}
        error={popupError}
        onClose={() => setPopupOpen(false)}
      />
    </Main >
  );
}
