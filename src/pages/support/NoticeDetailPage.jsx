import { Link, useParams } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import Button from "../../components/Button";
import style from "./NoticeDetailPage.module.css";
import { getDetailNotice } from "../../api/support/notice";
import { useEffect, useState } from "react";
import { useLoadingStore } from "../../store/useLoadingStore";
import Loading from "../../components/Loading";

export default function NoticeDetailPage() {

  const { id } = useParams();

  //로딩 상태 관리
  const { isLoading, setLoading } = useLoadingStore();

  //공지사항 상세 데이터
  const [noticeData, setNoticeData] = useState([]);

  /*
  const notice = noticeData.find((data) => { return (data.id === parseInt(id)) })
*/

  //데이터 불러오기
  useEffect(() => {

    async function fetchDetailNotice() {

      setLoading(true);

      try {

        const response = await getDetailNotice(id);

        if (response) {

          setNoticeData(response);;

        }

      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }

    }

    fetchDetailNotice();

  }, [id])

  // 로딩 중일 때 로딩 표시
  if (isLoading) {
    return <Loading fullScreen />;
  }

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
                <Link to="/inquiry"><span>1:1 문의</span></Link>
                <Link to="/terms"><span>이용약관</span></Link>
                <Link to="/policy"><span>개인정보처리방침</span></Link>
              </aside>

              <div className="content flexColumn">
                <div className={`topBox ${style.topBox}`}>
                  <h4>
                    {noticeData.title}
                  </h4>
                  <div className={style.layoutBox}>
                    <span className={style.category}>
                      {noticeData.category}
                    </span>
                    <span className={style.data}>
                      {noticeData.date}
                    </span>
                  </div>
                </div>

                <p className={style.infoText}>
                  {noticeData.content}
                </p>

                <Button
                  customClass={style.btn}
                  text="목록으로"
                  href="/notice"
                />

              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}