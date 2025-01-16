import Container from "../components/Container";
import Main from "../components/section/Main";
import "../assets/css/style.css"
import Button from "../components/Button";
import ArrowPrevButton from "../components/ArrowPrevButton";

export default function RoadMapDesignPage() {

  return (
    <Main className="subWrap bg">

      <div className="loadMapBox roadMapDesignBox">
        <Container>
          <div className="loadMapContent">
            <div className="titleBox">
              <h3>
                나만의 커리어 로드맵 설계
              </h3>
            </div>

            <Button text="완료" />

            <div className="linkBox">
              <ArrowPrevButton href="/roadmapinfo" hiddenText="" />
            </div>

          </div>
        </Container>
      </div>

    </Main>
  )

}