import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import Career_Img01 from "../../assets/images/sub/Career_Img01.jpg";
import Story_Img from "../../assets/images/sub/Story_Img.png";
import style from "./CareerExplorationDetailPage.module.css";
import { getJobDetail } from "../../api/career/career";
import Loading from "../../components/Loading";

export default function CareerExplorationDetailPage() {
  const { career_Id } = useParams();

  // 상세 데이터 상태 관리
  const [jobDetailData, setJobDetailData] = useState({});
  // 로딩 상태 관리
  const [loading, setLoading] = useState(false);
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState("직무정보");
  const [selectedStage, setSelectedStage] = useState("초급"); // 경력 단계 (초기: 초급)
  const [targetActiveTab, setTargetActiveTab] = useState("단기목표"); // 로드맵 서브 탭 (초기: 단기목표)

  // 각 섹션에 대한 ref 생성
  const jobInfoRef = useRef(null);
  const careerStageRef = useRef(null);
  const roadmapRef = useRef(null);
  const successCaseRef = useRef(null);

  // 고정 헤더 높이 (px)
  const headerOffset = 80;

  // 커스텀 부드러운 스크롤 함수 (오프셋 적용)
  const smoothScrollWithOffset = (element) => {
    if (!element) return; // 요소가 없으면 종료
  
    const headerOffset = 80; // 고정 헤더 높이
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;
  
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth", // 부드러운 스크롤 적용
    });
  };
  

  // 탭 클릭 시 해당 섹션으로 부드럽게 스크롤 이동하는 함수
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setTimeout(() => {
      if (tab === "직무정보" && jobInfoRef.current) {
        smoothScrollWithOffset(jobInfoRef.current);
      } else if (tab === "경력단계" && careerStageRef.current) {
        smoothScrollWithOffset(careerStageRef.current);
      } else if (tab === "로드맵" && roadmapRef.current) {
        smoothScrollWithOffset(roadmapRef.current);
      } else if (tab === "성공사례" && successCaseRef.current) {
        smoothScrollWithOffset(successCaseRef.current);
      }
    }, 100); // 100ms 딜레이 후 실행
  };
  

  useEffect(() => {
    async function fetchJobDetail() {
      setLoading(true);
      try {
        const response = await getJobDetail(career_Id);
        if (response) {
          setJobDetailData(response.career);
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobDetail();
  }, [career_Id]);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <Main className={`subWrap ${style.subWrap}`}>
      <div className={`careerBox ${style.careerDetailBox}`}>
        <Container className="container">
          <div className="careerContent">
            {/* 상단 이미지 및 헤더 */}
            <div className={style.careerDetailTop}>
              <div className={style.imgBox}>
                <img src={Career_Img01} alt="선박엔지니어" />
              </div>
              <h3>{jobDetailData.job_title}</h3>
              <ArrowPrevButton
                customClass={style.arrowPrevBtn}
                href="/career"
                hiddenText="커리어탐색 화면으로 이동"
              />
            </div>

            {/* 탭 메뉴 */}
            <ul className={style.careerDetailTab}>
              {["직무정보", "경력단계", "로드맵", "성공사례"].map((tab) => (
                <li key={tab}>
<Link
  to="#"
  onClick={(e) => {
    e.preventDefault(); // 기본 이벤트 방지
    handleTabClick(tab);
  }}
  className={activeTab === tab ? style.active : ""}
>
  {tab === "직무정보" ? "직무정의" : tab}
</Link>

                </li>
              ))}
            </ul>

            {/* 섹션별 콘텐츠 */}
            <div className={style.careerDetailContent}>
              {/* 직무정보 섹션 */}
              <section ref={jobInfoRef} data-section="직무정보">
                <div className={style.box}>
                  <h4>직무 정의</h4>
                  <p>{jobDetailData.job_definition}</p>
                  {/* <ul className={style.list}>
                      <li>
                        선박 엔지니어는 선박의 기계 및 전기 시스템을 설계, 유지보수, 수리하며,
                        선박이 안전하고 효율적으로 작동하도록 관리하는 역할을 맡습니다.
                      </li>
                      <li>
                        주로 해운회사, 조선소, 선박 유지보수 회사에서 근무하며, 선박 엔진, 추진 시스템, 전기 시스템 등 복잡한 설비를 다룹니다.
                      </li>
                    </ul> */}

                </div>
                <div className={style.box}>
                  <h4>주요 역할 및 책임</h4>
                  <h5 className={style.subTitle}>핵심 업무</h5>
                  <p>{jobDetailData.roles_responsibilities}</p>
                  {/* <ul className={style.list}>
                      <li>설계 및 기술 지원</li>
                      <li>유지보수 및 수리</li>
                      <li>안전 및 품질 관리</li>
                      <li>현장 감독 및 팀 관리</li>
                    </ul> */}
                </div>
                <div className={style.box}>
                  <h4>필수 역량</h4>
                  <p>{jobDetailData.required_skills}</p>
                  {/* <ul className={style.list}>
                      <li>기계 및 전기 시스템 설계/분석 능력</li>
                      <li>문제 해결 및 고장 진단 능력</li>
                      <li>협업 및 커뮤니케이션 능력</li>
                      <li>국제 규정(IMO, SOLAS) 이해</li>
                    </ul> */}
                </div>
                <div className={style.box}>
                  <h4>평균 연봉 및 시장 전망</h4>
                  <p>{jobDetailData.salary_outlook}</p>
                  {/* <ul className={style.list}>
                      <li>초급: 3,000만 원 ~ 4,000만 원</li>
                      <li>중급: 5,000만 원 ~ 6,500만 원</li>
                      <li>고급: 7,000만 원 이상</li>
                      <li>
                        해운 산업의 디지털 전환 및 친환경 선박 기술 수요 증가로 연봉 상승 전망
                      </li>
                    </ul> */}
                </div>
              </section>

              {/* 경력단계 섹션 */}
              <section ref={careerStageRef} data-section="경력단계">
                <div className={style.box}>
                  <h4>경력 단계별 가이드</h4>
                  <select
                    className={style.dropdown}
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                  >
                    <option value="초급">초급</option>
                    <option value="중급">중급</option>
                    <option value="고급">고급</option>
                  </select>
                  {selectedStage === "초급" && (
                    <p className={style.description}>{jobDetailData.junior_guide}</p>
                    /*
                      <ul className={style.guideList}>
                        <li>
                          <h5>필수 학습 목표</h5>
                          <ul className={style.list}>
                            <li>기초 선박 엔진 및 전기 시스템 이해</li>
                            <li>기초 설계 도구 사용법 습득</li>
                          </ul>
                        </li>
                        <li>
                          <h5>수행 업무</h5>
                          <ul className={style.list}>
                            <li>기초 점검 및 유지보수 지원</li>
                            <li>간단한 설계 보조 업무</li>
                          </ul>
                        </li>
                        <li>
                          <h5>추천 교육 과정</h5>
                          <ul className={style.list}>
                            <li>기초 선박 공학 과정</li>
                            <li>AutoCAD, SolidWorks 기본 교육</li>
                          </ul>
                        </li>
                      </ul>
                      */
                  )}
                  {selectedStage === "중급" && (
                    <p className={style.description}>{jobDetailData.mid_level_guide}</p>
                    /*
                        <ul className={style.guideList}>
                        <li>
                          <h5>필수 학습 목표</h5>
                          <ul className={style.list}>
                            <li>중급 선박 시스템 이해</li>
                            <li>문제 해결 및 분석 능력 강화</li>
                          </ul>
                        </li>
                        <li>
                          <h5>수행 업무</h5>
                          <ul className={style.list}>
                            <li>주요 시스템 유지보수 및 수리</li>
                            <li>설계 최적화 지원</li>
                          </ul>
                        </li>
                        <li>
                          <h5>추천 교육 과정</h5>
                          <ul className={style.list}>
                            <li>중급 선박 설계 과정</li>
                            <li>고급 설계 도구 교육</li>
                          </ul>
                        </li>
                      </ul>
*/
                  )}
                  {selectedStage === "고급" && (
                    <p className={style.description}>{jobDetailData.senior_guide}</p>
                    /*
                             <ul className={style.guideList}>
                        <li>
                          <h5>필수 학습 목표</h5>
                          <ul className={style.list}>
                            <li>선박 기술 혁신 및 고급 분석</li>
                            <li>전략적 의사결정 능력 강화</li>
                          </ul>
                        </li>
                        <li>
                          <h5>수행 업무</h5>
                          <ul className={style.list}>
                            <li>고난도 문제 해결 및 시스템 개선 주도</li>
                            <li>팀 리더십 및 전략 수립</li>
                          </ul>
                        </li>
                        <li>
                          <h5>추천 교육 과정</h5>
                          <ul className={style.list}>
                            <li>고급 선박 기술 리더십 과정</li>
                            <li>전략 경영 및 혁신 교육</li>
                          </ul>
                        </li>
                      </ul>
*/
                  )}
                </div>
              </section>

              {/* 로드맵 섹션 */}
              <section ref={roadmapRef} data-section="로드맵">
                <div className={style.box}>
                  <h4>경력 로드맵과 마일스톤</h4>
                  <ul className={`roadMapTab ${style.roadMapTab}`}>
                    <li>
                      <Link
                        to="#"
                        onClick={() => setTargetActiveTab("단기목표")}
                        className={targetActiveTab === "단기목표" ? "active" : ""}
                      >
                        단기목표
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        onClick={() => setTargetActiveTab("중기목표")}
                        className={targetActiveTab === "중기목표" ? "active" : ""}
                      >
                        중기목표
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        onClick={() => setTargetActiveTab("장기목표")}
                        className={targetActiveTab === "장기목표" ? "active" : ""}
                      >
                        장기목표
                      </Link>
                    </li>
                  </ul>
                  {targetActiveTab === "단기목표" && (
                    <>
                      <h3 style={{ marginBottom: "30px" }}>단기목표</h3>
                      <p className={style.description}>
                        {jobDetailData.short_term_goals}
                      </p>
                      {/* <ul className={`roadmapList01 ${style.roadmapList01}`}>
                          <li>
                            <Link to="#">초급</Link>
                            <ul className={`roadmapList02 ${style.roadmapList02}`}>
                              <li>
                                <Link to="#">기술학습</Link>
                                <ul className={style.roadmapList03}>
                                  <li>설계 도구 자격증 취득 (AutoCAD Certified User 등)</li>
                                  <li>선박 엔진과 전기 시스템 기본 구조 이해</li>
                                </ul>
                              </li>
                              <li>
                                <Link to="#">실무경험</Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <Link to="#">중급</Link>
                          </li>
                          <li>
                            <Link to="#">고급</Link>
                          </li>
                        </ul> */}

                    </>
                  )}
                  {targetActiveTab === "중기목표" && (
                    <>
                      <h3 style={{ marginBottom: "30px" }}>중기목표</h3>
                      <p className={style.description}>
                        {jobDetailData.mid_term_goals}
                      </p>
                      {/* <ul className={`roadmapList01 ${style.roadmapList01}`}>
                          <li>
                            <Link to="#">초급</Link>
                            <ul className={`roadmapList02 ${style.roadmapList02}`}>
                              <li>
                                <Link to="#">기술학습</Link>
                                <ul className={style.roadmapList03}>
                                  <li>설계 도구 자격증 취득 (AutoCAD Certified User 등)</li>
                                  <li>선박 엔진과 전기 시스템 기본 구조 이해</li>
                                </ul>
                              </li>
                              <li>
                                <Link to="#">실무경험</Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <Link to="#">중급</Link>
                          </li>
                          <li>
                            <Link to="#">고급</Link>
                          </li>
                        </ul> */}

                    </>
                  )}
                  {targetActiveTab === "장기목표" && (
                    <>
                      <h3 style={{ marginBottom: "30px" }}>장기목표</h3>
                      <p className={style.description}>
                        {jobDetailData.long_term_goals}
                      </p>
                      {/* <ul className={`roadmapList01 ${style.roadmapList01}`}>
                          <li>
                            <Link to="/">초급</Link>
                            <ul className={`roadmapList02 ${style.roadmapList02}`}>
                              <li>
                                <Link to="/">기술학습</Link>
                                <ul className={style.roadmapList03}>
                                  <li>설계 도구 자격증 취득 (AutoCAD Certified User 등)</li>
                                  <li>선박 엔진과 전기 시스템 기본 구조 이해</li>
                                </ul>
                              </li>
                              <li>
                                <Link to="/">실무경험</Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <Link to="/">중급</Link>
                          </li>
                          <li>
                            <Link to="/">고급</Link>
                          </li>
                        </ul> */}
                    </>
                  )}
                </div>
              </section>

              {/* 성공사례 섹션 */}
              <section ref={successCaseRef} data-section="성공사례">
                <div className={style.box}>
                  <h3 style={{ marginBottom: "30px" }}>성공사례</h3>
                  <img src={Story_Img} alt="성공사례" className={style.successImg} />
                  <h4>성공사례: {jobDetailData.success_case_title}</h4>
                  <p>{jobDetailData.success_case_text}</p>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
