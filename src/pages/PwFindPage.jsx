import Container from "../components/Container";
import Main from "../components/section/Main";
import "../assets/css/login.css";
import ArrowPrevButton from "../components/ArrowPrevButton";
import Button from "../components/Button";

export default function PwFindPage() {

  return (
    <>
      <Main className="subWrap bg">
        <div className="signinBox pwFindBox">
          <Container>
            <div className="signinContent">

              <h3>
                비밀번호 찾기
              </h3>

              <p className="subText">
                비밀번호를 재설정할 수 있는 인증코드를 보내드려요.
              </p>

              <div className="container">
                <form>
                  <div className="inputBox">
                    <label htmlFor="email" className="text">
                      이메일
                    </label>
                    <input id="email" type="text" value="asdfd1234@naver.com" />
                  </div>

                  <div className="inputBox">
                    <label htmlFor="password">
                      <span className="blind">
                        비밀번호 재설정 인증코드
                      </span>
                    </label>
                    <input id="password" type="text" />
                  </div>

                  <div className="codeBox">
                    <span>
                      인증코드가 오지 않나요?
                    </span>
                    <button className="codeBtn" type="button">
                      인증코드 재전송
                    </button>
                  </div>

                  <Button text="확인" />

                </form>
              </div>

              <div className="linkBox">
                <ArrowPrevButton href="/signin" hiddenText="로그인 화면으로 이동" />
              </div>

            </div>
          </Container>
        </div >
      </Main >
    </>
  )

}