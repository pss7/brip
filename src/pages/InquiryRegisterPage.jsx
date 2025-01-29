import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import Button from "../components/Button";
import style from "./InquiryRegisterPage.module.css";
import Select from "../components/Select";
import Textarea from "../components/Textarea";
import FileUpload from "../components/FileUpload";

export default function InquiryRegisterPage() {

  return (
    <Main className="subWrap bg">
      <div className="inquiryBox">
        <Container className="lnbContainer">
          <div className="inquiryContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice"><span>공지사항</span></Link>
                <Link to="/faq"><span>FAQ</span></Link>
                <Link to="/inquiry" className="active"><span>1:1 문의</span></Link>
                <Link to="/terms"><span>이용약관</span></Link>
                <Link to="/policy"><span>개인정보처리방침</span></Link>
              </aside>

              <div className="content">
                <h4>1:1문의</h4>
                <p className={style.inquiryInfoText}>
                  문의량이 많을 시 답변이 지연될 수 있습니다. <br />
                  답변은 평일 9:30 ~ 17:00 에 등록되며, 가능한 빨리 답변드릴 수 있도록 노력하겠습니다.
                </p>

                <form className={style.form}>

                  <div className={style.selectBox}>
                    <Select
                      className={style.select}
                      id="select"
                      option="카테고리 선택"
                    />
                  </div>

                  <div className={style.textareaBox}>
                    <Textarea
                      hiddenText="내용입력"
                      placeholder="내용을 입력해주세요"
                      className={style.textarea}
                    />
                  </div>

                  <FileUpload />

                  <Button
                    text="등록"
                    customClass={style.btn}
                  />
                </form>

              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  );
}
