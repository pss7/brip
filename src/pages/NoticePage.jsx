import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import Table from "../components/Table";
import { noticeData } from "../data/noticeData";
import { useState } from "react";

export default function NoticePage() {

  const [data] = useState(noticeData);

  return (
    <Main className="subWrap bg">

      <div className="noticeBox">
        <Container className="lnbContainer">
          <div className="noticeContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice" className="active">
                  <span>
                    공지사항
                  </span>
                </Link>
                <Link to="/faq"><span>FAQ</span></Link>
                <Link to="#"><span>1:1 문의</span></Link>
                <Link to="/terms"><span>이용약관</span></Link>
                <Link to="/policy"><span>개인정보처리방침</span></Link>
              </aside>

              <div className="content">
                <div className="topBox">
                  <h4>
                    공지사항
                  </h4>
                  <div className="searchBox">
                    <div className="search">
                      <label htmlFor="search" className="blind">
                        검색
                      </label>
                      <input id="search" placeholder="키워드를 검색해주세요." />
                    </div>
                    <div className="selectBox">
                      <label htmlFor="select" className="blind">
                        최신순, 오래된 순 선택
                      </label>
                      <select id="select" className="select">
                        <option>
                          최신순
                        </option>
                        <option>
                          오래된 순
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <Table href="/noticedetail" data={data} className={"textLeft ellipsisText"}/>

              </div>
            </div>

          </div>
        </Container>
      </div >
    </Main >
  )

}