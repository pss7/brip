import { useState, useEffect } from "react";
import Table from "../components/Table";
import { UserContext } from "../context/UserProvider";
import { useContext } from "react";
import style from "./InquiryPage.module.css";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Container from "../components/Container";
import Main from "../components/section/Main";

export default function InquiryPage() {
  const [data, setData] = useState([]);
  const { user } = useContext(UserContext);

  // 로컬스토리지에서 데이터 가져오기
  useEffect(() => {
    const storedData = localStorage.getItem("inquiryData");
    if (storedData) {
      setData(JSON.parse(storedData)); // 로컬스토리지에서 데이터를 불러와서 상태에 저장
    }
  }, []);

  // 최신순으로 정렬
  const sortedData = data.sort((a, b) => {
    return new Date(b.date) - new Date(a.date); // 최신순
  });

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
                <p className={style.inquiryInfoText}>
                  문의량이 많을 시 답변이 지연될 수 있습니다. <br />
                  답변은 평일 9:30 ~ 17:00 에 등록되며, 가능한 빨리 답변드릴 수 있도록 노력하겠습니다.
                </p>

                {sortedData.length === 0 ? (
                  "등록한 문의가 없습니다."
                ) : (
                  <Table
                    caption="1:1문의하기"
                    href="/inquirydetail"
                    filteredData={sortedData} // 최신순으로 정렬된 데이터
                    className="textLeft ellipsisText"
                    showStatus={true}
                    columns={["NO.", "구분", "제목", "처리상태", "등록일"]}
                    colgroup={
                      <>
                        <col style={{ width: "90px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "150px" }} />
                      </>
                    }
                  />
                )}

                {user && (
                  <Button
                    href="/inquiryreg"
                    text="1:1문의 등록"
                    customClass={style.btn}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
