import { Link, useParams } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import Button from "../components/Button";
import { noticeData } from "../data/noticeData";

export default function NoticeDetailPage() {

  const { id } = useParams();

  const notice = noticeData.find((data) => { return (data.id === parseInt(id)) })

  return (
    <Main className="subWrap bg">

      <div className="noticeBox noticeDetailBox">
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
                <div className="topBox">
                  <h4>
                    {notice.title}
                  </h4>
                  <div className="layoutBox">
                    <span className="category">
                      {notice.category}
                    </span>
                    <span className="date">
                      {notice.date}
                    </span>
                  </div>
                </div>

                <p className="infoText">
                  {notice.content}
                </p>

                <Button
                  customClass="btn"
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