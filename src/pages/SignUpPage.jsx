import Container from "../components/Container";
import Main from "../components/section/Main";
import { Link } from "react-router-dom";
import ArrowPrevButton from "../components/ArrowPrevButton";
import Button from "../components/Button";
import style from "./SignUpPage.module.css";
import Input from "../components/Input";
import Select from "../components/Select";

export default function SignUpPage() {

  return (
    <>
      <Main className="subWrap bg">

        <div className="signinBox">
          <Container>
            <div className={`signinContent ${style.signinContent}`}>

              <h3 className={style.title}>
                회원가입
              </h3>

              <div className="container">
                <form>

                  <div className="inputWrap">
                    <div className="inputBox">
                      <Input
                        id="name"
                        label="이름"
                        placeholder="이름 입력"
                        className="mb-15"
                      />
                    </div>
                  </div>

                  <div className="inputWrap">
                    <label className="mb-15">
                      닉네임
                    </label>
                    <div className={`inputBox ${style.inputNicknameBox}`}>
                      <Input
                        type="text"
                        placeholder="닉네임 입력"
                        title="닉네임"
                      >
                        <button className={style.duplicateChkBtn} type="button">
                          중복확인
                        </button>
                      </Input>
                    </div>
                  </div>

                  <div className="inputWrap">
                    <label className="mb-15">
                      이메일
                    </label>
                    <div className={style.layoutBox}>
                      <div className={`inputBox ${style.inputEmailBox}`}>
                        <Input
                          id="nickname"
                          type="text"
                          title="이메일 아이디"
                        />
                        @
                        <Input
                          id="nickname"
                          type="text"
                          title="이메일 주소"
                        />
                      </div>
                      <Select
                        className={style.select}
                        id="emailSelect"
                        hiddenText="이메일 선택"
                      />
                    </div>
                  </div>

                  <div className="inputWrap">
                    <label htmlFor="password" className="mb-15">
                      비밀번호
                    </label>
                    <div className="inputBox">
                      <Input
                        id="password"
                        type="text"
                        placeholder="비밀번호 입력"
                      />
                      <button
                        className={style.pwHiddenToggleBtn}
                        type="button"
                      >
                        <span className="blind">
                          비밀번호숨기기
                        </span>
                      </button>
                    </div>
                    <p className={style.infoText}>
                      영문+숫자+특수문자 혼합 6~14자 입력 (대문자 사용불가)
                    </p>
                  </div>

                  <div className="inputWrap">
                    <label htmlFor="passwordCheck" className="mb-15">
                      비밀번호 확인
                    </label>
                    <div className="inputBox">
                      <Input
                        id="passwordCheck"
                        type="text"
                        placeholder="비밀번호 확인 입력"
                      />
                      <button
                        className={style.pwHiddenToggleBtn}
                        type="button"
                      >
                        <span className="blind">
                          비밀번호숨기기
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className={style.agreeChkBox}>
                    <div className={style.inputChkBox}>
                      <input id="agreeChk01" type="checkbox" className="blind" />
                      <label htmlFor="agreeChk01" className="allChk">
                        모두 동의
                      </label>
                    </div>

                    <div className={style.inputChkBox}>
                      <input id="agreeChk02" type="checkbox" className="blind" />
                      <label htmlFor="agreeChk02">
                        만 14세 이상 가입 동의 (필수)
                      </label>
                    </div>

                    <div className={style.inputChkBox}>
                      <input id="agreeChk03" type="checkbox" className="blind" />
                      <label htmlFor="agreeChk03">
                        서비스 이용약관 동의 (필수)
                      </label>
                      <Link to="#">
                        약관보기
                      </Link>
                    </div>

                    <div className={style.inputChkBox}>
                      <input id="agreeChk04" type="checkbox" className="blind" />
                      <label htmlFor="agreeChk04">
                        개인정보처리방침 동의 (필수)
                      </label>
                      <Link to="#">
                        약관보기
                      </Link>
                    </div>

                    <div className={style.inputChkBox}>
                      <input id="agreeChk05" type="checkbox" className="blind" />
                      <label htmlFor="agreeChk05">
                        마케팅 정보 수진 동의 (선택)
                      </label>
                      <Link to="#">
                        약관보기
                      </Link>
                    </div>

                  </div>

                  <Button text="회원가입" />

                </form>
              </div>

              <div className="linkBox">
                <ArrowPrevButton href="/signin" hiddenText="로그인 화면으로 이동" />
              </div>

            </div>
          </Container >
        </div >
      </Main >
    </>
  )

}