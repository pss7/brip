import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import style from "./ApplyPage.module.css";

export default function ApplyPage() {

  return (
    <Main className="subWrap bg">

      <div className="mypageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">

            <div className="lnbLayoutBox">
              <aside>
                <Link to="/mypage">
                  <span>
                    프로필
                  </span>
                </Link>
                <Link to="/interest"><span>관심공고</span></Link>
                <Link to="/resume"><span>이력서관리</span></Link>
                <Link to="/apply" className="active"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>

              <div className="content">

                <h4 className="title">
                  지원현황
                </h4>

                <p className="subTitle">
                  내가 지원한 채용 공고의 진행 상황을 한눈에 확인하세요
                </p>

                <ul className={style.infoList}>
                  <li>
                    <span>지원완료</span>
                    <em>12</em>
                  </li>
                  <li>
                    <span>열람</span>
                    <em>9</em>
                  </li>
                  <li>
                    <span>미열람</span>
                    <em>2</em>
                  </li>
                  <li>
                    <span>지원취소</span>
                    <em>1</em>
                  </li>
                </ul>

                <ul className={style.applyList}>
                  <li>
                    <div className={style.topBox}>
                      <span className={style.receipt}>
                        접수마감
                      </span>
                      <div className={style.textBox}>
                        <em>
                          (주)국토해양환경기술단
                        </em>
                        <h5>
                          해양생태계분야(해조류/해초류)직원채용공고
                        </h5>
                      </div>
                    </div>
                    <div className={style.dateBox}>
                      <span>
                        지원일
                      </span>
                      <em className={style.date}>
                        2024.12.22
                      </em>
                      <span className={style.viewingDate}>
                        열람 12/23
                      </span>
                    </div>
                    <button className={style.delBtn}>
                      지원내역삭제
                    </button>
                  </li>
                </ul>



              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}