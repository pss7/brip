import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";

export default function PolicyPage() {

  return (
    <Main className="subWrap bg">

      <div className="faqBox">
        <Container className="lnbContainer">
          <div className="fqaContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice">
                  <span>
                    공지사항
                  </span>
                </Link>
                <Link to="/faq"><span>FAQ</span></Link>
                <Link to="#"><span>1:1 문의</span></Link>
                <Link to="/terms"><span>이용약관</span></Link>
                <Link to="/policy" className="active"><span>개인정보처리방침</span></Link>
              </aside>

              <div className="content">

                <h4>
                  개인정보처리방침
                </h4>


              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}