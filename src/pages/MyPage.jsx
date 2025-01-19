
import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import { useEffect, useState } from "react";

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
                    <input id="number" type="text" value="010-5167-1674" />
                  </div>

                  <div className="inputBox">
                    <label htmlFor="email" className="text">
                      이메일
                    </label>
                    <input id="email" type="text" value={user.email} />
                  </div>

                  <div className="inputBox">
                    <label htmlFor="date" className="text">
                      생년월일
                    </label>
                    <input id="date" type="text" value="1998-01-01" />
                  </div>

                </form>

                <ul className="snsSignIn">
                  <li>
                    <span>

                    </span>
                  </li>
                </ul>


              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}