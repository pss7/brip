import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import style from "./InquiryDetailPage.module.css";
import { getInquiryDetail } from "../../api/support/inquiry";
import Loading from "../../components/Loading";
import { useLoadingStore } from "../../store/useLoadingStore";
import Button from "../../components/Button";

export default function InquiryDetailPage() {
  const { id } = useParams();

  //데이터 상태 관리
  const [inquiryData, setInquiryData] = useState([]);

  //로딩 상태 관리
  const { isLoading, setLoading } = useLoadingStore();

  useEffect(() => {

    async function fetchInquiry() {

      try {

        setLoading(true);

        const response = await getInquiryDetail(id);

        setInquiryData(response);

      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInquiry();

  }, []);

  // 로딩 중일 때 로딩 표시
  if (isLoading) {
    return <Loading fullScreen />;
  }




  // if (!inquiry) {
  //   return (
  //     <Main className="subWrap bg">
  //       <div className="inquiryBox">
  //         <Container className="lnbContainer">
  //           <div className="inquiryContent">
  //             <div className="lnbLayoutBox">
  //               <div className="content">
  //                 <h4>1:1 문의 상세</h4>
  //                 <p>해당 문의를 찾을 수 없습니다.</p>
  //               </div>
  //             </div>
  //           </div>
  //         </Container>
  //       </div>
  //     </Main>
  //   );
  // }

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
                <h4>1:1 문의 상세</h4>

                <div className={style.inquiryQuestionWrap}>
                  <div className={style.inquiryQuestionBox}>
                    <div className={style.topBox}>
                      <p className={style.title}>Q.{inquiryData.title}</p>
                      <div className={style.box}>
                        <span className={style.category}>{inquiryData.category}</span>
                        <span className={style.date}>{inquiryData.created_at}</span>
                        <span className={style.status}>{inquiryData.status}</span>
                      </div>
                    </div>

                    <div className={style.inquiryQuestionContent}>
                      <p>{inquiryData.content}</p>
                    </div>
                  </div>

                  <div className={style.inquiryAnswerBox}>
                    <div className={style.topBox}>

                      <p className={style.title}>A.{inquiryData.status}</p>
                      <span className={style.status}>{inquiryData.answer_date}</span>

                    </div>

                    <div className={style.inquiryAnswerContent}>
                      {inquiryData.answer}
                    </div>

                  </div>
                </div>

                <Button
                  href="/inquiry"
                  text="목록으로"
                />

              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
