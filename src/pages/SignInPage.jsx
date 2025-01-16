import Container from "../components/Container";
import Main from "../components/section/Main";
import "../assets/css/login.css";
import LoginImg from "../assets/images/login/Login_Img.svg"
import { Link } from "react-router-dom";
import Button from "../components/Button";
import style from "./SignInPage.module.css";

export default function SignInPage() {

  return (
    <>
      <Main className="subWrap bg">

        <div className="signinBox signinSt">
          <Container>
            <div className="signinContent">

              <h3>
                로그인
              </h3>

              <div className="imgBox">
                <img src={LoginImg} alt="" />
              </div>

              <form>
                <div className="inputBox">
                  <label htmlFor="email">
                    <span className="blind">
                      이메일입력
                    </span>
                  </label>
                  <input id="email" type="text" placeholder="이메일 입력" />
                </div>

                <div className="inputBox">
                  <label htmlFor="password">
                    <span className="blind">
                      비밀번호 입력
                    </span>
                  </label>
                  <input id="password" type="text" placeholder="비밀번호 입력" />
                </div>

                <div className="signinFindBox">
                  <div className="inputChkBox">
                    <input id="loginIdSave" type="checkbox" />
                    <label htmlFor="loginIdSave" className="loginIdSave">
                      아이디저장
                    </label>
                  </div>
                  <Link to="/passwordfind" className="pwFindLink">
                    비밀번호를 잊어버리셨나요?
                  </Link>
                </div>

                <Button text="로그인" customClass={style.btnSt} />

              </form>

              <div className="snsListBox">
                <ul className="snsList">
                  <li>
                    <Link to="/" className="naverLogin">
                      <span className="blind">
                        네이버 로그인
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="kakaoLogin">
                      <span className="blind">
                        카카오 로그인
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="googleLogin">
                      <span className="blind">
                        구글 로그인
                      </span>
                    </Link>
                  </li>
                </ul>

                <div className="easySignInBox">
                  3초 간편로그인
                </div>

              </div>

              <div className="signupLinkBox">
                <span>
                  아직 계정이 없으신가요?
                </span>
                <Link to="/signup">
                  회원가입
                </Link>
              </div>

            </div>
          </Container>
        </div >
      </Main >
    </>
  )

}