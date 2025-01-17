import Container from "../components/Container";
import Main from "../components/section/Main";
import "../assets/css/style.css"
import Button from "../components/Button";
import ArrowPrevButton from "../components/ArrowPrevButton";
import { Link } from "react-router-dom";

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

            <div className="selectBox">
              <p className="selectText">
                안녕하세요! 홍길동님 <br />
                현재 상태를 선택해주세요.
              </p>

              <ul className="selectList">
                <li>
                  <Link to="#">
                    현재 재학 중입니다.
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    졸업을 준비하고 있습니다.
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    졸업 후 첫 직장을 찾고 있습니다.
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    현재 경력을 쌓고 있는 중입니다.
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    이직을 준비하고 있습니다.
                  </Link>
                </li>
              </ul>

            </div>

            <div className="selectBox">
              <p className="selectText">
              어떤 직무 분야에 관심이 있나요?
              </p>

              <ul className="selectList">
                <li>
                  <Link to="#">
                    해운
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    항만
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    물류
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    창고
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    기타
                  </Link>
                </li>
              </ul>
            </div>

            <Button text="완료" />

            <div className="linkBox">
              <ArrowPrevButton href="/roadmapinfo" hiddenText="로드맵안내화면으로 이동" />
            </div>

          </div>
        </Container>
      </div>

    </Main>
  )

}