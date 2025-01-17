import Container from "../components/Container";
import Main from "../components/section/Main";
import "../assets/css/style.css";
import Button from "../components/Button";
import ArrowPrevButton from "../components/ArrowPrevButton";
import { useState } from "react";

export default function RoadMapDesignPage() {

  const options1 = [
    "현재 재학 중입니다.",
    "졸업을 준비하고 있습니다.",
    "졸업 후 첫 직장을 찾고 있습니다.",
    "현재 경력을 쌓고 있는 중입니다.",
    "이직을 준비하고 있습니다.",
  ];

  const options2 = [
    "해운",
    "항만",
    "물류",
    "창고",
    "기타",
  ];

  const allOptions = [...options1, ...options2];
  const [selectState, setSelectState] = useState(new Array(allOptions.length).fill(false));

  const handleSelect = (index) => {
    setSelectState((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <Main className="subWrap bg">
      <div className="roadMapBox roadMapDesignBox">
        <Container>
          <div className="roadMapContent">
            <div className="titleBox">
              <h3>나만의 커리어 로드맵 설계</h3>
            </div>

            <div className="selectBox">
              <p className="selectText">
                안녕하세요! 홍길동님 <br />
                현재 상태를 선택해주세요.
              </p>

              <ul className="selectList">
                {options1.map((option, index) => (
                  <li key={index}>
                    <button
                      className={`selectBtn ${selectState[index] ? "active" : ""}`}
                      onClick={() => handleSelect(index)}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="selectBox">
              <p className="selectText">어떤 직무 분야에 관심이 있나요?</p>

              <ul className="selectList">
                {options2.map((option, index) => (
                  <li key={index}>
                    <button
                      className={`selectBtn ${selectState[index + options1.length] ? "active" : ""}`}
                      onClick={() => handleSelect(index + options1.length)}
                    >
                      {option}
                    </button>
                  </li>
                ))}
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
  );
}
