
import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import kakao from "../assets/images/login/Kakao_Img.svg";
import naver from "../assets/images/login/Naver_Img.svg";
import style from "./MyPage.module.css";
import Input from "../components/Input";
import { UserContext } from "../context/UserProvider";
import { useContext } from "react";

export default function MyPage() {

  const { user } = useContext(UserContext);

  return (
    <Main className="subWrap bg">

      <div className="mypageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">

            <div className={`lnbLayoutBox ${style.lnbLayoutBox}`}>
              <aside>
                <Link to="/mypage" className="active">
                  <span>
                    프로필
                  </span>
                </Link>
                <Link to="/interest"><span>관심공고</span></Link>
                <Link to="/resume"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>

              <div className={`content ${style.content}`}>
                <div className={style.box}>
                  <h4 className={`title ${style.title}`}>
                    프로필
                  </h4>
                  <form>

                    <div className="inputWrap">
                      <div className="inputBox">
                        <Input
                          id="name"
                          type="text"
                          value={user.name}
                          label="이름"
                        />
                      </div>
                    </div>

                    <div className="inputWrap">
                      <label htmlFor="nickname" >
                        닉네임
                      </label>
                      <div className={`inputBox ${style.inputNicknameBox}`}>
                        <Input
                          id="nickname"
                          type="text"
                          value={user.nickname}
                        >
                          <button className={style.duplicateChkBtn} type="button">
                            완료
                          </button>
                        </Input>
                      </div>
                    </div>

                    <div className="inputWrap">
                      <label htmlFor="number" >
                        휴대폰번호
                      </label>
                      <div className="inputBox">
                        <Input
                          id="number"
                          type="text"
                          value="010-5167-1674"
                        >
                          <button className={style.changeBtn} type="button">
                            변경
                          </button>
                        </Input>
                      </div>
                    </div>

                    <div className="inputWrap">
                      <label htmlFor="email" >
                        이메일
                      </label>
                      <div className="inputBox">
                        <Input
                          id="email"
                          type="text"
                          value={user.email}
                        >
                          <button className={style.changeBtn} type="button">
                            변경
                          </button>
                        </Input>
                      </div>
                    </div>

                    <div className="inputWrap">
                      <div className="inputBox">
                        <Input
                          id="email"
                          type="text"
                          value="1998-01-01"
                          label="생년월일"
                        />
                      </div>
                    </div>

                  </form>

                  <div className={style.snsSignInBox}>
                    <h5>
                      SNS 로그인 연결
                    </h5>
                    <ul className={style.snsSignInList}>
                      <li>
                        <div className={style.imgBox}>
                          <img src={naver} alt="네이버로그인" />
                        </div>
                        <span className={style.snsText}>
                          네이버 로그인
                        </span>
                        <button className={style.connectBtn}>
                          연결
                        </button>
                      </li>
                      <li className={style.kakao}>
                        <div className={style.imgBox}>
                          <img src={kakao} alt="카카오로그인" />
                        </div>
                        <span className={style.snsText}>
                          카카오 로그인
                        </span>
                        <button className={style.connectBtn}>
                          연결
                        </button>
                      </li>
                    </ul>
                  </div>

                  <button className={style.terminationBtn}>
                    서비스 해지
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}