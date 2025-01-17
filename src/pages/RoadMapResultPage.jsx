import Container from "../components/Container";
import Main from "../components/section/Main";
import "../assets/css/style.css"
import Button from "../components/Button";
import ArrowPrevButton from "../components/ArrowPrevButton";

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
              홍길동님은 현재[입문단계]입니다.
            </p>

            <div className="imgBox">
              
            </div>

            <span className="subInfoText">
              직무 역량 충족도 <em>60%</em>
            </span>





























            <Button text="확인" />

            <div className="linkBox">
              <ArrowPrevButton href="#" hiddenText="" />
            </div>

          </div>
        </Container>
      </div>

    </Main>
  )

}