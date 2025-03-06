import { Link } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import Card from "../../components/Card";
import { announcementData } from "../../data/announcementData";
import { useEffect, useState } from "react";
import style from "./InterestPage.module.css";
import { getEmploymentList } from "../../api/employment/employment";

export default function InterestPage() {

  const [announcements, setAnnouncements] = useState(announcementData);
  const [employmentData, setEmploymentData] = useState([]);
  
  const handleLikeToggle = (id) => {
    setAnnouncements(prevAnnouncements =>
      prevAnnouncements.map(announcement =>
        announcement.id === id
          ? { ...announcement, isLiked: !announcement.isLiked }
          : announcement
      )
    );
  };

  // 데이터 불러오기
  useEffect(() => {

    async function fetchEmployments() {
      try {
        const response = await getEmploymentList();
        if (response.result === "success") {
          // 좋아요가 눌린 항목만 필터링하여 저장
          const likedEmployments = response.employs.filter(emp => emp.is_liked === 1);
          setEmploymentData(likedEmployments);
        }
      } catch (error) {
        console.error("error", error);
      }
    }
    fetchEmployments();

  }, []);

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
                <Link to="/interest" className="active"><span>관심공고</span></Link>
                <Link to="/resume"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>

              <div className="content">

                <h4 className="title">
                  나의공고
                </h4>

                <p className="subTitle">
                  저장한 채용 공고로 커리어 계획을 세워보세요
                </p>

                <div className={style.cardList}>

                  {employmentData.length > 0 ? (
                    employmentData.slice(0, 6).map((data) => (
                      <Card
                        href={`/employment-detail/${data.id}`}
                        key={data.id}
                        className="cardType"
                        text={`${data.company_name}`}
                        imgSrc="/src/assets/images/sub/Result_Img02.png"
                        title={data.title}
                        subText={`${data.deadline}`}
                        isLiked={data.is_liked === 1}
                        handleLikeToggle={handleLikeToggle}
                      />
                    ))
                  ) : (
                    <p className="infoText">좋아요한 공고가 없습니다.</p>
                  )}

                </div>
              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}