import { Link, useParams } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import { inquiryData } from "../data/inquiryData";
import style from "./InquiryDetailPage.module.css";

export default function InquiryDetailPage() {

  const { id } = useParams();
  const inquiry = inquiryData.find((data) => {
    return (
      data.id === Number(id)
    )
  })

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

              <div className="content flexColumn">
                <h4>1:1문의</h4>

                <div className={style.inquiryQuestionWrap}>
                  <div className={style.inquiryQuestionBox}>
                    <div className={style.topBox}>
                      <p className={style.title}>
                        {inquiry.title}
                      </p>
                      <div className={style.box}>
                        <span className={style.category}>
                          {inquiry.category}
                        </span>
                        <span className={style.date}>
                          {inquiry.date}
                        </span>
                        <span className={style.status}>
                          {inquiry.status}
                        </span>
                      </div>
                    </div>

                    <div className={style.inquiryQuestionContent}>
                      <p>
                        {inquiry.content}
                      </p>
                    </div>

                  </div>

                  <div className={style.inquiryAnswerBox}>
                    <div className={style.topBox}>
                      <p className={style.title}>
                        {inquiry.status}
                      </p>
                      <span className={style.date}>
                        {inquiry.responseDate}
                      </span>
                    </div>
                    <div className={style.inquiryAnswerContent}>
                      <p>
                        {inquiry.response}
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  );
}
