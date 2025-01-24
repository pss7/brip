import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import Table from "../components/Table";
import Button from "../components/Button";
import { inquiryData } from "../data/inquiryData";
import { useState } from "react";
import style from "./InquiryPage.module.css";

export default function InquiryPage() {

  const [data] = useState(inquiryData);
  const token = localStorage.getItem('authToken');

  return (
    <Main className="subWrap bg">

      <div className="inquiryBox">
        <Container className="lnbContainer">
          <div className="inquiryContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice" ><span>공지사항</span></Link>
                <Link to="/faq"><span>FAQ</span></Link>
                <Link to="/inquiry" className="active"><span>1:1 문의</span></Link>
                <Link to="/terms"><span>이용약관</span></Link>
                <Link to="/policy"><span>개인정보처리방침</span></Link>
              </aside>

              <div className="content flexColumn">
                <h4>
                  1:1문의
                </h4>

                <p className={style.inquiryInfoText}>
                  문의량이 많을 시 답변이 지연 될 수 있습니다.  <br />
                  답변은 평일 9:30 ~ 17:00 에 등록되며, 가능한 빨리 답변드릴 수 있도록 노력하겠습니다.
                </p>

                <Table
                  caption="1:1문의하기"
                  href="/inquirydetail"
                  data={data}
                  className={"textLeft ellipsisText"}
                  showStatus={true}
                >

                  <colgroup>
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "90px" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "100px" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>NO.</th>
                      <th>구분</th>
                      <th>제목</th>
                      <th>처리상태</th>
                      <th>등록일</th>
                    </tr>
                  </thead>
                </Table>

                {token && (
                  <Button
                    href="/inquirydetail"
                    text="1:1문의 등록"
                    customClass={style.btn}
                  />
                )}

              </div>
            </div>

          </div>
        </Container>
      </div >
    </Main >
  )

}