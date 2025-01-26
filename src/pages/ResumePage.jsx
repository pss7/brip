import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import style from "./ResumePage.module.css";
import Button from "../components/Button";
import { useState } from "react";
import { resumeData } from "../data/resumeData";
import ViewButton from "../components/ViewButton";

export default function ResumePage() {

  const [resumeList, setResumeList] = useState(resumeData);

  function handleToggle(id) {
    setResumeList((prevList) =>
      prevList.map((resume) =>
        resume.id === id
          ? { ...resume, isActionsVisible: !resume.isActionsVisible }
          : resume
      )
    );
  };

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
                <Link to="/resume" className="active"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>

              <div className={`content ${style.content} flexColumn`}>

                <h4 className="title">
                  이력서 관리
                </h4>

                <p className="subTitle">
                  효율적인 이력서 관리로 커리어 목표를 달성하세요
                </p>

                <ul className={style.resumeList}>
                  {
                    resumeList.map((data) => {

                      return (
                        <>
                          <li key={data.id}>
                            {
                              data.isDefault && (
                                <span className={style.basicResume}>
                                  기본이력서
                                </span>
                              )
                            }
                            <h5>
                              {data.name}
                            </h5>
                            <span className={style.date}>
                              {data.date}
                            </span>
                            <ViewButton
                              className={`${style.viewBox}`}
                              handleToggle={handleToggle}
                              data={data}
                            />
                          </li>
                        </>
                      )
                    })

                  }

                </ul>

                <Button
                  text="이력서작성"
                  href=""
                  customClass={style.btn}
                />

              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}