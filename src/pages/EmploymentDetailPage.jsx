import ArrowPrevButton from "../components/ArrowPrevButton";
import Card from "../components/Card";
import Container from "../components/Container";
import Main from "../components/section/Main";
import style from "./EmploymentDetailPage.module.css";
import CardImg02 from "../assets/images/main/Card_Img02.png";
import CardImg03 from "../assets/images/main/Card_Img03.png";
import DetailImg from "../assets/images/sub/Detail_Img.png";
import Button from "../components/Button";

export default function EmploymentDetailPage() {

  return (
    <Main className="subWrap">

      <div className="employmentBox employmentDetailBox">
        <Container className={style.container}>
          <div className="employmentContent">

            <div className="employmentDetailTop">
              <div className="imgBox">
                <img src={DetailImg} alt="" />
              </div>
              <div className="textBox">
                <span className="company">
                  (주)국토해양환경기술단
                </span>
                <div className="titleBox">
                  <h3>
                    해양생태계분야(해조류/해초류)직원채용공고
                  </h3>
                  <span className="dDAY">
                    D-12
                  </span>
                </div>
                <p className="condition">
                  신입·경력  대졸↑  정규직  경기 수원시
                </p>
                <button className="likeBtn">
                  <span className="blind">
                    좋아요
                  </span>
                </button>
              </div>
              <ArrowPrevButton
                customClass={style.arrowPrevBtn}
                href="/employment"
                hiddenText="채용공고 화면으로 이동"
              />
            </div>

            <div className="employmentDetailContent">
              <div className="employmentDetailLeft">
                <div className="employmentDetail">
                  <h4>
                    상세요강
                  </h4>

                  <ul className="detailContentList">
                    <li>
                      <span>[교용형태]</span>
                      <em>
                        정규직
                      </em>
                    </li>
                    <li>
                      <span>[구분]</span>
                      <em>
                        관련 경력 5년 이상
                      </em>
                    </li>
                    <li>
                      <span>[조직소개]</span>
                      <em>
                        CyberLogtiec은 세상의 시간과 공간을 더욱 가치있게 만들자는 슬로건을 가지고, 해운,항만 물류 분야의 세계 유명 Container Shipping Liner 에 B2B IT 솔루션을 제공하고 있습니다 <br /><br />

                        CyberLogtitec 에서는 Global Container Shipping Liner (해운선사) 의 모든 비즈니스 프로세스를 담고 있는 OPUS Container의 차세대 제품 프로젝트 (이름 : Chorus)를 진행하고 있습니다.
                      </em>
                    </li>
                  </ul>

                  <button className="detailView">
                    상세정보 더보기
                  </button>

                </div>


                <div className="employmentDetail">
                  <h4>
                    기술스택
                  </h4>

                  <ul className="techStack">
                    <li>
                      Github
                    </li>
                    <li>
                      React
                    </li>
                    <li>
                      JavaScript
                    </li>
                    <li>
                      Node.js
                    </li>
                  </ul>
                </div>

                <div className="employmentDetail">
                  <h4>
                    마감일
                  </h4>
                  <span className="deadlineText">
                    2024.12.22
                  </span>
                </div>

                <div className="employmentDetail">
                  <h4>
                    기업정보
                  </h4>

                  <div className="corporateInfo">
                    기업정보영역
                  </div>
                </div>

                <div className="employmentDetail">
                  <h4>
                    근무위치
                  </h4>

                  <address>
                    경기 수원시 영통구 덕영대로 1556번길 15
                  </address>

                  <div className="mapBox">
                    지도영역
                  </div>

                </div>

              </div>

              <div className="employmentDetailRight">
                <Button
                  text="지원하기"
                  customClass={style.btn}
                />
                <div className="aiInfoBox">
                  <p>
                    이력서를 작성하면 <br />
                    AI가 <strong>채용공고를 추천</strong>해줘요!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <Container>
          <h4 className="aiTitle">
            AI추천공고
          </h4>
          <div className="cardContainer">
            <Card
              className="cardType"
              text="씨아이지해운(주)"
              title="해운항만물류 실무와 사례
    특강"
              imgSrc={CardImg02}
              subText="~01.15(수)"
            />
            <Card
              className="cardType"
              text="씨아이지해운(주)"
              title="해운항만물류 실무와 사례
    특강"
              imgSrc={CardImg03}
              subText="~01.15(수)"
            />
            <Card
              className="cardType"
              text="씨아이지해운(주)"
              title="해운항만물류 실무와 사례
    특강"
              imgSrc={CardImg02}
              subText="~01.15(수)"
            />

            <Card
              className="cardType"
              text="씨아이지해운(주)"
              title="해운항만물류 실무와 사례
    특강"
              imgSrc={CardImg03}
              subText="~01.15(수)"
            >
            </Card>
          </div>
        </Container>
      </div>

    </Main >
  )

}