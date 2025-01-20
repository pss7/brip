import ArrowPrevButton from "../components/ArrowPrevButton";
import Container from "../components/Container";
import Main from "../components/section/Main";
import style from "./EmploymentDetailPage.module.css";
import { Link } from "react-router-dom";
import Career_Img01 from "../assets/images/sub/Career_Img01.jpg";

export default function CareerDetailPage() {

  return (
    <Main className="subWrap">

      <div className="employmentBox employmentDetailBox careerDetailBox">
        <Container className={style.container}>
          <div className="employmentContent">

            <div className="employmentDetailTop">
              <div className="imgBox">
                <img src={Career_Img01} alt="" />
              </div>
              <div className="textBox">
                <div className="titleBox">
                  <h3>
                    선박엔지니어
                  </h3>
                </div>
              </div>
              <ArrowPrevButton
                customClass={style.arrowPrevBtn}
                href="/career"
                hiddenText="커리어탐색 화면으로 이동"
              />
            </div>

            <div className="layoutBox">
              <ul className="careerDetailTab">
                <li>
                  <Link to="/" className="active">
                    직무정보
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    경력단계
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    로드맵
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    성공사례
                  </Link>
                </li>
              </ul>

              <div className="employmentDetailContent">
                <div className="employmentDetailLeft">
                  <div className="employmentDetail">

                    <div className="box">
                      <h4>
                        직무 정의
                      </h4>
                      <ul className="list">
                        <li>
                          선박 엔지니어는 선박의 기계 및 전기 시스템을 설계, 유지보수, 수리하며, 선박이 안전하고 효율적으로 작동하도록 관리하는 역할을 맡습니다.
                        </li>
                        <li>
                          주로 해운회사, 조선소, 선박 유지보수 회사에서 근무하며, 선박 엔진, 추진 시스템, 전기 시스템 등 복잡한 설비를 다룹니다.
                        </li>
                      </ul>
                    </div>

                    <div className="box">
                      <h4>
                        주요 역할 및 책임
                      </h4>
                      <h5 className="subTitle">
                        설계 및 기술 지원
                      </h5>
                      <ul className="list">
                        <li>
                          선박의 기계 및 전기 시스템 설계 및 최적화
                        </li>
                        <li>
                          국제 규정 및 기술 표준에 맞는 설계 작업 수행
                        </li>
                      </ul>
                      <h5 className="subTitle">
                        유지보수 및 수리
                      </h5>
                      <ul className="list">
                        <li>
                          선박의 정기적인 점검 및 유지보수 작업 수행
                        </li>
                        <li>
                          엔진, 발전기, 냉각 시스템 등 주요 설비 문제 해결
                        </li>
                      </ul>

                      <h5 className="subTitle">
                        안전 및 품질 관리
                      </h5>
                      <ul className="list">
                        <li>
                          선박 안전 기준 준수 및 품질 관리
                        </li>
                        <li>
                          해상 안전 규정(ISM Code 등) 준수 확인
                        </li>
                      </ul>

                      <h5 className="subTitle">
                        현장 감독 및 팀 관리
                      </h5>
                      <ul className="list">
                        <li>
                          유지보수 및 수리 작업 감독
                        </li>
                        <li>
                          작업팀과 협력하여 프로젝트를 실행
                        </li>
                      </ul>
                    </div>

                    <div className="box">
                      <h4>
                        필수 역량
                      </h4>
                      <ul className="list">
                        <li>기계 및 전기 시스템 설계 및 분석 능력</li>
                        <li>문제 해결 및 고장 진단 능력</li>
                        <li>협업 및 커뮤니케이션 능력</li>
                        <li>국제 규정(IMO, SOLAS) 및 기술 표준에 대한 이해</li>
                      </ul>
                    </div>

                    <div className="box">
                      <h4>
                        평균 연봉 및 시장 전망
                      </h4>

                      <h5 className="subTitle">
                        평균 연봉:
                      </h5>

                      <ul className="list">
                        <li>초급: 3,000만 원~4,000만 원</li>
                        <li>중급: 5,000만 원~6,500만 원</li>
                        <li>고급: 7,000만 원 이상</li>
                      </ul>

                      <h5 className="subTitle">
                        시장 전망:
                      </h5>

                      <ul className="list">
                        <li>해운 산업의 디지털 전환 및 친환경 선박 기술 수요 증가로 인해 선박 엔지니어의 역할은 더욱 중요해질 전망</li>
                        <li>탄소 중립 및 지속 가능성 프로젝트로 인해 고급 엔지니어 수요가 꾸준히 증가</li>
                      </ul>

                    </div>

                    <h4>
                      경력 단계별 가이드
                    </h4>


                    <select>
                      <option>초급단계</option>
                    </select>

                    <ul className="guideList">
                      <li>
                        <h4>
                          필요한 역량과 스킬
                        </h4>
                        <ul className="list">
                          <li>기초 기계 공학 및 전기 공학 지식</li>
                          <li>기초 설계 도구 활용 능력(AutoCAD, SolidWorks)</li>
                          <li>문제 해결 및 데이터 분석 기초</li>
                        </ul>
                      </li>
                      <li>
                        <h4>
                          수행업무
                        </h4>
                        <ul className="list">
                          <li>유지보수 작업 보조</li>
                          <li>선박 기계 장치의 점검 및 기록</li>
                          <li>기초 설계 및 보고서 작성</li>
                        </ul>
                      </li>
                      <li>
                        <h4>
                          추천 교육 과정
                        </h4>
                        <ul className="list">
                          <li>기초 선박 공학 과정</li>
                          <li>AutoCAD, SolidWorks 등 설계 소프트웨어 교육</li>
                          <li> IMO 규정 및 SOLAS 기초 과정</li>
                        </ul>
                      </li>
                      <li>
                        <h4>
                          마일스톤 목표
                        </h4>
                        <ul className="list">
                          <li>선박 기본 설계 프로젝트 참여</li>
                          <li>설계 도구 자격증 취득</li>
                          <li>정기 점검 작업에 능숙해지기</li>
                        </ul>
                      </li>
                    </ul>

               
                    <h4>
                    경력 로드맵과 마일스톤
                  </h4>

                  <ul className="roadMapTab">
                    <li>
                      <Link to="#" className="active">
                        단기목표
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        중기목표
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        장기목표
                      </Link>
                    </li>
                  </ul>

                  <ul className="roadmapList01">
                    <li>
                      <Link to="/">
                        초급
                      </Link>
                      <ul className="roadmapList02">
                        <li>
                          <Link to="/">
                            기술학습
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            실무경험
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/">
                        중급
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        고급
                      </Link>
                    </li>
                  </ul>
                  </div>


         
                </div>

              </div>
            </div>

          </div>
        </Container>
      </div >
    </Main >
  )

}