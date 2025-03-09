import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import Career_Img01 from "../../assets/images/sub/Career_Img01.jpg";
import Story_Img from "../../assets/images/sub/Story_Img.png";
import style from "./CareerExplorationDetailPage.module.css";

export default function CareerExplorationDetailPage() {
  const [activeTab, setActiveTab] = useState("직무정보");
  const [selectedStage, setSelectedStage] = useState("초급"); // 경력 단계 가이드 선택 (초기: 초급)
  const [targetActiveTab, setTargetActiveTab] = useState("단기목표"); // 로드맵 서브 탭 (초기: 단기목표)

  // 각 섹션을 위한 ref 생성
  const jobInfoRef = useRef(null);
  const careerStageRef = useRef(null);
  const roadmapRef = useRef(null);
  const successCaseRef = useRef(null);

  // 탭 클릭 시 해당 섹션으로 스크롤 이동
  const handleTabClick = (tabName) => {
    if (tabName === "직무정보" && jobInfoRef.current) {
      jobInfoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tabName === "경력단계" && careerStageRef.current) {
      careerStageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tabName === "로드맵" && roadmapRef.current) {
      roadmapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tabName === "성공사례" && successCaseRef.current) {
      successCaseRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 스크롤 시 현재 보이는 섹션에 따라 activeTab 업데이트
  useEffect(() => {
    const sections = [
      { ref: jobInfoRef, name: "직무정보" },
      { ref: careerStageRef, name: "경력단계" },
      { ref: roadmapRef, name: "로드맵" },
      { ref: successCaseRef, name: "성공사례" },
    ];
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute("data-section");
          setActiveTab(sectionName);
        }
      });
    }, observerOptions);
    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });
    return () => observer.disconnect();
  }, []);

  return (
    <Main className="subWrap">
      <div className={`careerBox ${style.careerDetailBox}`}>
        <Container className="container">
          <div className="careerContent">
            {/* 상단 이미지 및 헤더 */}
            <div className={style.careerDetailTop}>
              <div className={style.imgBox}>
                <img src={Career_Img01} alt="선박엔지니어" />
              </div>
              <h3>선박엔지니어</h3>
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
                      onClick={() => handleTabClick(tab)}
                      className={activeTab === tab ? style.active : ""}
                    >
                      {tab === "직무정보" ? "직무정의" : tab}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* 전체 섹션 렌더링 */}
              <div className={style.careerDetailContent}>
                {/* 직무정보 섹션 */}
                <section ref={jobInfoRef} data-section="직무정보">
                  <div className={style.box}>
                    <h4>직무 정의</h4>
                    <ul className={style.list}>
                      <li>
                        선박 엔지니어는 선박의 기계 및 전기 시스템을 설계, 유지보수, 수리하며,
                        선박이 안전하고 효율적으로 작동하도록 관리하는 역할을 맡습니다.
                      </li>
                      <li>
                        주로 해운회사, 조선소, 선박 유지보수 회사에서 근무하며, 선박 엔진, 추진 시스템, 전기 시스템 등 복잡한 설비를 다룹니다.
                      </li>
                    </ul>
                  </div>
                  <div className={style.box}>
                    <h4>주요 역할 및 책임</h4>
                    <h5 className={style.subTitle}>핵심 업무</h5>
                    <ul className={style.list}>
                      <li>설계 및 기술 지원</li>
                      <li>유지보수 및 수리</li>
                      <li>안전 및 품질 관리</li>
                      <li>현장 감독 및 팀 관리</li>
                    </ul>
                  </div>
                  <div className={style.box}>
                    <h4>필수 역량</h4>
                    <ul className={style.list}>
                      <li>기계 및 전기 시스템 설계/분석 능력</li>
                      <li>문제 해결 및 고장 진단 능력</li>
                      <li>협업 및 커뮤니케이션 능력</li>
                      <li>국제 규정(IMO, SOLAS) 이해</li>
                    </ul>
                  </div>
                  <div className={style.box}>
                    <h4>평균 연봉 및 시장 전망</h4>
                    <ul className={style.list}>
                      <li>초급: 3,000만 원 ~ 4,000만 원</li>
                      <li>중급: 5,000만 원 ~ 6,500만 원</li>
                      <li>고급: 7,000만 원 이상</li>
                      <li>
                        해운 산업의 디지털 전환 및 친환경 선박 기술 수요 증가로 연봉 상승 전망
                      </li>
                    </ul>
                  </div>
                </section>

                {/* 경력 단계 가이드 섹션 */}
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
                    )}
                    {selectedStage === "중급" && (
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
                    )}
                    {selectedStage === "고급" && (
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
                    )}
                  </div>
                </section>

                {/* 경력 로드맵 섹션 */}
                <section ref={roadmapRef} data-section="로드맵">
                  <div className={style.box}>
                    <h4>경력 로드맵과 마일스톤</h4>
                    {/* 로드맵 서브 탭 */}
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
                        <ul className={`roadmapList01 ${style.roadmapList01}`}>
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
                        </ul>
                      </>
                    )}
                    {targetActiveTab === "중기목표" && (
                      <>
                        <h3 style={{ marginBottom: "30px" }}>중기목표</h3>
                        <ul className={`roadmapList01 ${style.roadmapList01}`}>
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
                        </ul>
                      </>
                    )}
                    {targetActiveTab === "장기목표" && (
                      <>
                        <h3 style={{ marginBottom: "30px" }}>장기목표</h3>
                        <ul className={`roadmapList01 ${style.roadmapList01}`}>
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
                        </ul>
                      </>
                    )}
                  </div>
                </section>

                {/* 성공사례 섹션 */}
                <section ref={successCaseRef} data-section="성공사례">
                  <h3 style={{ marginBottom: "30px" }}>성공사례</h3>
                  <div className={style.box}>
                    <img src={Story_Img} alt="성공사례" className={style.successImg} />
                    <h4>성공사례: 선박엔지니어 김현우님의 이야기</h4>
                    <p>
                      김현우님(35)은 대학 시절 기계공학을 전공하며 막연히 자동차나 항공 분야에 진출할 것을 꿈꿨습니다. 하지만 졸업 직전, 해운 산업에 대해 배우게 되면서 선박의 기계와 전기 시스템을 설계하는 일에 흥미를 느끼게 됩니다. “친환경 선박 기술이 각광받고 있다는 걸 알게 된 게 결정적이었어요. 앞으로 중요한 산업이 될 거라고 확신했습니다.”
                      그는 졸업 후 국내 조선소에 신입 엔지니어로 입사하며 해운업계에 첫발을 내딛습니다.
                      입사 초기, 그는 선박 유지보수 팀에 배치되어 주로 소형 화물선의 엔진 설계 보조와 정기 점검 업무를 맡았습니다. "당시엔 모든 게 새로웠고, 선박 시스템의 복잡함에 매일 놀랐죠." 현우님은 주어진 작업을 수행하며 AutoCAD와 SolidWorks 같은 설계 도구를 익히고, 유지보수 프로세스의 기초를 배웠습니다.
                      첫 프로젝트는 노후 선박의 엔진 효율 개선 작업이었습니다. 설계 보조 역할을 맡은 그는 베테랑 팀원들의 지도 아래, 효율적인 냉각 시스템 설계에 성공적으로 기여했습니다. “작은 역할이었지만, 제 아이디어가 실제로 선박 개선에 쓰이는 걸 보고 큰 자부심을 느꼈어요.”
                      이후 그는 선박 기초 설계와 유지보수 점검 업무에서 3년간 경험을 쌓으며, 기본적인 역량을 다지는 데 집중했습니다.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
