import Container from "../components/Container";
import Main from "../components/section/Main";
import "../assets/css/style.css"
import Button from "../components/Button";
import ArrowPrevButton from "../components/ArrowPrevButton";
import ResultImg from "../assets/images/sub/Result_Img.png";
import Chart_Img from "../assets/images/sub/Chart_Img.png";
import Result_Img01 from "../assets/images/sub/Result_Img01.png";
import Result_Img02 from "../assets/images/sub/Result_Img02.png";
import Result_Img03 from "../assets/images/sub/Result_Img03.png";

import { Link } from "react-router-dom";

export default function RoadMapResultPage() {

  return (
    <Main className="subWrap bg">

      <div className="roadMapBox roadMapResultBox">
        <Container>
          <div className="roadMapContent">
            <div className="titleBox">
              <h3>
                나만의 커리어 로드맵 설계
              </h3>
            </div>

            <p className="infoTitle">
              홍길동님의 커리어 현황과 성장 로드맵
            </p>

            <div className="imgBox imgBox01">
              <img src={ResultImg} alt="" />
            </div>

            <span className="subInfoText">
              홍길동님은 현재 <em>[입문단계]</em> 입니다.
            </span>

            <span className="subInfoText subInfoText02">
              직무 역량 충족도 <em>60%</em>
            </span>

            <div className="imgBox imgBox02">
              <img src={Chart_Img} alt="" />
            </div>

            <div className="resultInfoBox">
              <h4>
                부족한 역량 분석 및 개선 가이드
              </h4>

              <div className="resultBox">
                <h5>데이터분석능력</h5>

                <div className="infoBox">
                  <div className="scoreBox">
                    <div className="score01">
                      <span>현재 50점</span>
                      <span>목표 70점</span>
                    </div>
                    <div className="score02">
                      <span style={{ display: "block", width: "50%", height: "100%", backgroundColor: "#1C1B18" }}></span>
                    </div>
                  </div>

                  <p className="infoText">
                    기초 데이터 분석 강의를 수강하세요.
                  </p>

                  <div className="ViewBox">
                    <Link to="/">
                      <div className="imgBox">
                        <img src={Result_Img01} alt="" />
                      </div>
                      <div className="textBox">
                        <span className="topText">
                          직무직군
                        </span>
                        <h6>
                          해운항만물류 실무와 사례
                          특강
                        </h6>
                        <em className="bottomText">
                          데이터리안
                        </em>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="resultBox">
                <h5>팀 협업 능력</h5>

                <div className="infoBox">
                  <div className="scoreBox">
                    <div className="score01">
                      <span>현재 50점</span>
                      <span>목표 70점</span>
                    </div>
                    <div className="score02">
                      <span style={{ display: "block", width: "50%", height: "100%", backgroundColor: "#1C1B18" }}></span>
                    </div>
                  </div>

                  <p className="infoText">
                    팀워크 프로젝트 경험을 늘리세요.
                  </p>

                  <div className="ViewBox">
                    <Link to="/">
                      <div className="imgBox">
                        <img src={Result_Img02} alt="" />
                      </div>
                      <div className="textBox">
                        <span className="topText">
                          직무직군
                        </span>
                        <h6>
                          해운항만물류 실무와 사례
                          특강
                        </h6>
                        <em className="bottomText">
                          ~01.15(수)
                        </em>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="resultBox">
                <h5>리더십 잠재력</h5>

                <div className="infoBox">
                  <div className="scoreBox">
                    <div className="score01">
                      <span>현재 50점</span>
                      <span>목표 70점</span>
                    </div>
                    <div className="score02">
                      <span style={{ display: "block", width: "50%", height: "100%", backgroundColor: "#1C1B18" }}></span>
                    </div>
                  </div>

                  <p className="infoText">
                    리더십 워크숍 참여를 추천합니다.
                  </p>

                  <div className="ViewBox">
                    <Link to="/">
                      <div className="imgBox">
                        <img src={Result_Img03} alt="" />
                      </div>
                      <div className="textBox">
                        <span className="topText">
                          직무직군
                        </span>
                        <h6>
                          물류업계 현직자와의
                          네트워킹 강연
                        </h6>
                        <em className="bottomText">
                          2024-12-20
                        </em>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="recommendedRoadmap">
                <h4>
                  추천 로드맵
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
                      역량 강화
                    </Link>
                    <ul className="roadmapList02">
                      <li>
                        <Link to="/">
                          SCM(Supply Chain Management) 기초 과정
                        </Link>
                      </li>
                      <li>
                        <Link to="/">
                          Python으로 데이터 분석 시작하기
                        </Link>
                      </li>
                      <li>
                        <Link to="/">
                          Agile 방법론과 프로젝트 관리 실습
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="/">
                      포트폴리오
                    </Link>
                  </li>
                  <li>
                    <Link to="/">
                      자격증 취득
                    </Link>
                  </li>
                </ul>
              </div>

              <button className="downloadBtn">
                <span>
                  PDF로 다운로드
                </span>
              </button>
            </div>

            <Button
              text="확인"
              href="/roadmapinfo"
            />

            <div className="linkBox">
              <ArrowPrevButton href="/roadmapinfo" hiddenText="" />
            </div>

          </div>
        </Container>
      </div>

    </Main>
  )

}