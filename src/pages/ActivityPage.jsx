import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import style from "./ActivityPage.module.css";
import ViewButton from "../components/ViewButton";
import { activityData } from "../data/activityData";
import { useState } from "react";

export default function ActivityPage() {

  const [activities, setActivities] = useState(activityData);

  function handleLikeClick(id) {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? { ...activity, likes: activity.likes + 1 }
          : activity
      )
    );
  };

  function handleToggle(id) {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? { ...activity, isActionsVisible: !activity.isActionsVisible }
          : activity
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
                <Link to="/resume"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity" className="active"><span>내 활동</span></Link>
              </aside>

              <div className="content">

                <h4 className="title">
                  내 활동
                </h4>

                <p className="subTitle">
                  커뮤니티에서 내가 쓴 글들을 한곳에서 확인할 수 있습니다.
                </p>

                <ul className={style.activityList}>

                  {
                    activities.map((data) => {

                      return (

                        <li key={data.id}>
                          <div className={style.topBox}>
                            <span className={style.name}>
                              {data.nickname}
                            </span>
                            <span className={style.date}>
                              {data.date}
                            </span>
                          </div>

                          <p className={style.content}>
                            {data.content}
                          </p>

                          <div className={style.btnWrap}>
                            <div className={style.btnBox}>
                              <button
                                className={style.likeBtn}
                                onClick={() => { handleLikeClick(data.id) }}
                              >
                                <span className="blind">좋아요</span>
                              </button>
                              <span className={style.number}>
                                {data.likes}
                              </span>
                            </div>

                            <div className={style.btnBox}>
                              <em className={style.comment}>
                                <span className="blind">댓글</span>
                              </em>
                              <span className={style.number}>
                                {data.comments}
                              </span>
                            </div>
                          </div>
                          <ViewButton
                            handleToggle={handleToggle}
                            className={style.viewBox}
                            data={data}
                          />
                        </li>

                      )

                    })

                  }
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}