
import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import { useEffect, useState } from "react";
import google from "../assets/images/login/Google_Img.svg";
import kakao from "../assets/images/login/Kakao_Img.svg";
import naver from "../assets/images/login/Naver_Img.svg";


export default function MyPage() {

  const [user, setUser] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);


  return (
    <Main className="subWrap bg">

      <div className="signinBox signupBox mypageBox">
        <Container className="lnbContainer">
          <div className="signinContent mypageContentBox">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/mypage" className="active">
                  <span>
                    프로필
                  </span>
                </Link>
                <Link to="#"><span>관심공고</span></Link>
                <Link to="#"><span>이력서관리</span></Link>
                <Link to="#"><span>지원현황</span></Link>
                <Link to="#"><span>내 활동</span></Link>
              </aside>

              <div className="content">
                <h4>
                  프로필
                </h4>
                <form>

                  <div className="inputBox">
                    <label htmlFor="name" className="text">
                      이름
                    </label>
                    <input id="name" type="text" value={user.name} />
                  </div>

                  <div className="inputNickNameBox">
                    <div className="inputBox">
                      <label htmlFor="nickname" className="text">
                        닉네임
                      </label>
                      <div className="inputLayoutBox">
                        <input id="nickname" type="text" value={user.nickname} />
                        <button className="duplicateChkBtn" type="button">
                          완료
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="inputBox">
                    <label htmlFor="number" className="text">
                      휴대폰번호
                    </label>
                    <div className="layoutBox">
                      <input id="number" type="text" value="010-5167-1674" />
                      <button className="changeBtn" type="button">
                        변경
                      </button>
                    </div>
                  </div>

                  <div className="inputBox">
                    <label htmlFor="email" className="text">
                      이메일
                    </label>
                    <div className="layoutBox">
                      <input id="email" type="text" value={user.email} />
                      <button className="changeBtn" type="button">
                        변경
                      </button>
                    </div>
                  </div>

                  <div className="inputBox">
                    <label htmlFor="date" className="text">
                      생년월일
                    </label>
                    <input id="date" type="text" value="1998-01-01" />
                  </div>

                </form>

                <div className="snsSignInBox">
                  <h5>
                    SNS 로그인 연결
                  </h5>
                  <ul className="snsSignInList">
                    <li>
                      <div className="imgBox">
                        <img src={naver} alt="네이버로그인" />
                      </div>
                      <span className="snsText">
                        네이버 로그인
                      </span>
                      <button className="connectBtn">
                        연결
                      </button>
                    </li>
                    <li className="kakao">
                      <div className="imgBox">
                        <img src={kakao} alt="카카오로그인" />
                      </div>
                      <span className="snsText">
                        카카오 로그인
                      </span>
                      <button className="connectBtn">
                        연결
                      </button>
                    </li>
                  </ul>
                </div>

                <button className="terminationBtn">
                  서비스 해지
                </button>

              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}