import { useState, useEffect } from "react";
import Table from "../../components/Table";
import style from "./InquiryPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import { useLoadingStore } from "../../store/useLoadingStore";
import Loading from "../../components/Loading";
import { getInquiry } from "../../api/support/inquiry";
import { useAuthStore } from "../../store/useAuthStore";
// import ConfirmPopup from "../../components/ConfirmPopup";

export default function InquiryPage() {
  const navigate = useNavigate();

  // 토큰 불러오기
  const { token } = useAuthStore();

  // 데이터 상태 관리
  const [inquiryData, setInquiryData] = useState([]);

  // 로딩 상태 관리
  const { isLoading, setLoading } = useLoadingStore();

  // 데이터 불러오기
  useEffect(() => {

    async function fetchInquiry() {

      setLoading(true);

      try {
        const response = await getInquiry();
        setInquiryData(response);
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInquiry();

  }, []);

  if (!token) {
    navigate("/signin");
  }

  // 최신순 정렬 (문의 생성일 기준으로 정렬하도록 필드명을 수정할 수 있음)
  const sortedData = inquiryData.sort((a, b) => {
    return new Date(b.inquiryData) - new Date(a.inquiryData);
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

                {isLoading ? (
                  <Loading center />
                ) : sortedData.length === 0 ? (
                  "등록한 문의가 없습니다."
                ) : (
                  <Table
                    caption="1:1문의하기"
                    href="/inquiry-detail"
                    filteredData={sortedData}
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

                {token && (
                  <Button href="/inquiry-registration" text="1:1문의 등록" />
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
