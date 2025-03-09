import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Main from "../../components/layout/Main";
import Container from "../../components/Container";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import { getJobDetail } from "../../api/career/career";
import Career_Img01 from "../../assets/images/sub/Career_Img01.jpg";
import Story_Img from "../../assets/images/sub/Story_Img.png";
import style from "./CareerExplorationDetailPage.module.css";
import Loading from "../../components/Loading";

export default function CareerExplorationDetailPage() {

  const { id } = useParams(); // URL에서 ID 가져오기
  const [activeTab, setActiveTab] = useState("직무정보");
  const [targetActiveTab, setTargetActiveTab] = useState("단기목표");
  const [jobDetail, setJobDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchJobDetail() {
      try {
        const response = await getJobDetail(id);
        if (response && response.career) {
          setJobDetail(response.career);
        } else {
          console.error("데이터를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetail();
  }, [id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleTargetTabClick = (tab) => {
    setTargetActiveTab(tab);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Main className="subWrap">
      <div className={`careerBox ${style.careerDetailBox}`}>
        <Container className="container">
          <div className="careerContent">
            <div className={style.careerDetailTop}>
              <div className={style.imgBox}>
                <img src={Career_Img01} alt={jobDetail.job_title} />
              </div>
              <h3>{jobDetail.job_title}</h3>
              <ArrowPrevButton
                customClass={style.arrowPrevBtn}
                href="/career"
                hiddenText="커리어탐색 화면으로 이동"
              />
            </div>

            <div className={style.layoutBox}>
              {/* 탭 메뉴 */}
              <ul className={style.careerDetailTab}>
                {["직무정보", "경력단계", "로드맵", "성공사례"].map((tab) => (
                  <li key={tab}>
                    <Link
                      to="#"
                      className={activeTab === tab ? style.active : ""}
                      onClick={() => handleTabClick(tab)}
                    >
                      {tab}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* 탭 콘텐츠 */}
              <div className={style.careerDetailContent}>
                {activeTab === "직무정보" && (
                  <>
                    <h3>직무 정의</h3>
                    <div className={style.box}>
                      <h4>직무 정의</h4>
                      <p>{jobDetail.job_definition}</p>
                    </div>
                    <div className={style.box}>
                      <h4>주요 역할 및 책임</h4>
                      <p>{jobDetail.roles_responsibilities}</p>
                    </div>
                    <div className={style.box}>
                      <h4>필수 역량</h4>
                      <p>{jobDetail.required_skills}</p>
                    </div>
                    <div className={style.box}>
                      <h4>평균 연봉 및 시장 전망</h4>
                      <p>{jobDetail.salary_outlook}</p>
                    </div>
                  </>
                )}

                {activeTab === "경력단계" && (
                  <>
                    <h3>경력 단계별 가이드</h3>
                    <div className={style.box}>
                      <h4>초급</h4>
                      <p>{jobDetail.junior_guide}</p>
                    </div>
                    <div className={style.box}>
                      <h4>중급</h4>
                      <p>{jobDetail.mid_level_guide}</p>
                    </div>
                    <div className={style.box}>
                      <h4>고급</h4>
                      <p>{jobDetail.senior_guide}</p>
                    </div>
                  </>
                )}

                {activeTab === "로드맵" && (
                  <>
                    <h3>경력 로드맵과 마일스톤</h3>
                    <ul className={`roadMapTab ${style.roadMapTab}`}>
                      {["단기목표", "중기목표", "장기목표"].map((goal) => (
                        <li key={goal}>
                          <Link
                            to="#"
                            onClick={() => handleTargetTabClick(goal)}
                            className={targetActiveTab === goal ? "active" : ""}
                          >
                            {goal}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className={style.box}>
                      {targetActiveTab === "단기목표" && <p>{jobDetail.short_term_goals}</p>}
                      {targetActiveTab === "중기목표" && <p>{jobDetail.mid_term_goals}</p>}
                      {targetActiveTab === "장기목표" && <p>{jobDetail.long_term_goals}</p>}
                    </div>
                  </>
                )}

                {activeTab === "성공사례" && (
                  <>
                    <h3>성공사례</h3>
                    <div className={style.box}>
                      <div className={style.story}>
                        <h4>{jobDetail.success_case_title}</h4>
                        <img src={Story_Img} alt="성공사례" />
                        <p>{jobDetail.success_case_text}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
