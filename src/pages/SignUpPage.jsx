import Container from "../components/Container";
import Main from "../components/section/Main";
import "../assets/css/login.css";
import LoginImg from "../assets/images/login/Login_Img.svg"
import { Link } from "react-router-dom";

export default function SignUpPage() {

  return (
    <>
      <Main className="subWrap bg">

        <div className="signinBox signupBox">
          <Container>
            <div className="signinContent">

              <h3>
                회원가입
              </h3>

              <div className="container">
                <form>

                  <div className="inputBox">
                    <label htmlFor="name" className="text">
                      이름
                    </label>
                    <input id="name" type="text" placeholder="이름 입력" />
                  </div>

                  <div className="inputNickNameBox">
                    <div className="inputBox">
                      <label htmlFor="nickname" className="text">
                        닉네임
                      </label>
                      <div className="inputLayoutBox">
                        <input id="nickname" type="text" placeholder="닉네임 입력" />
                        <button className="duplicateChkBtn" type="button">
                          중복확인
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="inputEmailBox">
                    <span className="text">
                      이메일
                    </span>
                    <div className="inputLayoutBox">
                      <div className="inputBox">
                        <label htmlFor="email01" className="blind">
                          이메일 아이디
                        </label>
                        <input id="email01" type="text" />
                      </div>
                      @
                      <div className="inputBox">
                        <label htmlFor="email02" className="blind">
                          이메일 주소
                        </label>
                        <input id="email02" type="text" />
                      </div>

                      <div className="selectBox">
                        <label htmlFor="emailSelect" className="blind">
                          이메일 선택
                        </label>
                        <select className="select" id="emailSelect">
                          <option>선택</option>
                          <option></option>
                          <option></option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="inputPasswordBox">
                    <label htmlFor="password01" className="text">
                      비밀번호
                    </label>
                    <div className="inputBox">
                      <input id="password01" type="text" placeholder="비밀번호 입력" />
                      <button className="pwHiddenToggleBtn" type="button">
                        <span className="blind">
                          비밀번호숨기기
                        </span>
                      </button>
                    </div>
                    <p className="infoText">
                      영문+숫자+특수문자 혼합 6~14자 입력 (대문자 사용불가)
                    </p>
                  </div>

                  <div className="inputPasswordBox">
                    <label htmlFor="password02" className="text">
                      비밀번호 확인
                    </label>
                    <div className="inputBox">
                      <input id="password02" type="text" placeholder="비밀번호 확인 입력" />
                      <button className="pwHiddenToggleBtn" type="button">
                        <span className="blind">
                          비밀번호숨기기
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="agreeChkBox">
                    <div className="inputChkBox">
                      <input id="agreeChk01" type="checkbox" className="blind" />
                      <label htmlFor="agreeChk01" className="allChk">
                        모두 동의
                      </label>
                    </div>

                    <div className="inputChkBox">
                      <input id="agreeChk02" type="checkbox" className="blind" />
                      <label htmlFor="agreeChk02">
                        만 14세 이상 가입 동의 (필수)
                      </label>
                    </div>

                    <div className="inputChkBox">
                      <input id="agreeChk03" type="checkbox" className="blind" />
                      <label htmlFor="agreeChk03">
                        서비스 이용약관 동의 (필수)
                      </label>
                      <Link to="#">
                        약관보기
                      </Link>
                    </div>

                    <div className="inputChkBox">
                      <input id="agreeChk04" type="checkbox" className="blind" />
                      <label htmlFor="agreeChk04">
                        개인정보처리방침 동의 (필수)
                      </label>
                      <Link to="#">
                        약관보기
                      </Link>
                    </div>

                    <div className="inputChkBox">
                      <input id="agreeChk05" type="checkbox" className="blind" />
                      <label htmlFor="agreeChk05">
                        마케팅 정보 수진 동의 (선택)
                      </label>
                      <Link to="#">
                        약관보기
                      </Link>
                    </div>

                  </div>

                  <div className="btnBox">
                    <button className="btn">
                      회원가입
                    </button>
                  </div>

                </form>
              </div>

              <Link to="/signin" className="linkbtn">
                <span className="blind">
                  로그인 화면으로 이동
                </span>
              </Link>

            </div>
          </Container>
        </div >
      </Main >
    </>
  )

}