import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import "../../styles/style.css";
import Button from "../../components/Button";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import style from "./RoadMapDesignPage.module.css";
import { fetchRoadmapQuestions, submitRoadmapAnswers } from "../../api/roadmap/roadmap.js";
import CompletePopup from "../../components/CompletePopup.jsx";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading.jsx";

export default function RoadMapDesignPage() {

  const navigate = useNavigate();

  //로딩 상태 
  const [isLoading, setIsLoading] = useState(false);

  // 팝업 상태
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // 질문 목록, 사용자 답변
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  // 질문 불러오기
  useEffect(() => {

    async function loadQuestions() {

      setIsLoading(true);

      try {
        const response = await fetchRoadmapQuestions();
        if (response?.result === "success") {
          setQuestions(response.questions);
        }
      } catch (error) {
        console.error("로드맵 질문 로딩 에러:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuestions();

  }, []);

  // RADIO 선택
  const handleRadioChange = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [optionId],
    }));
  };

  // CHECKBOX 선택
  const handleCheckboxChange = (questionId, optionId) => {
    setAnswers((prev) => {
      const existing = prev[questionId] || [];
      if (existing.includes(optionId)) {
        return {
          ...prev,
          [questionId]: existing.filter((id) => id !== optionId),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...existing, optionId],
        };
      }
    });
  };

  const handleComplete = async () => {
    // 1) 모든 질문이 답변되었는지 확인
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const ans = answers[q.id];
      // 미답변이면 팝업 표시 후 리턴
      if (!ans || ans.length === 0) {
        setPopupMessage(`답변하지 않은 항목이 있습니다. 선택해주세요.`);
        setPopupOpen(true);
        return;
      }
    }

    // 2) 모두 답변 -> 서버 전송
    try {
      const response = await submitRoadmapAnswers(answers);
      if (response?.result === "success") {
        setPopupMessage("답변이 저장되었습니다.");
        setPopupOpen(true);
        navigate("/roadmap-result")
      } else {
        setPopupMessage("답변 저장 실패했습니다.");
        setPopupOpen(true);
      }
    } catch (error) {
      console.error("답변 저장 중 오류:", error);
      setPopupMessage("답변 저장 도중 문제가 발생했습니다.");
      setPopupOpen(true);
    }
  };

  // 질문 렌더링
  const renderQuestionBox = (question) => {
    const { id, mainTitle, subTitle, responseType, answerOptions = [] } = question;
    const selectedOptionIds = answers[id] || [];

    return (
      <div key={id} className={style.selectBox}>
        {/* 제목/설명 */}
        {mainTitle && <p className={style.selectText}>{mainTitle}</p>}
        {subTitle && <p className={style.selectText}>{subTitle}</p>}

        <ul className={style.selectList}>
          {answerOptions.map((option) => {
            const isSelected = selectedOptionIds.includes(option.id);
            const btnClass = `${style.selectBtn} ${isSelected ? style.active : ""}`;

            const handleClick = () => {
              if (responseType === "RADIO") {
                handleRadioChange(id, option.id);
              } else {
                handleCheckboxChange(id, option.id);
              }
            };

            return (
              <li key={option.id}>
                <button className={btnClass} onClick={handleClick}>
                  {option.optionText}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <Main className="subWrap bg">
      <div className="roadMapBox">
        <Container>
          <div className="roadMapContent">
            <div className="titleBox">
              <h3>나만의 커리어 로드맵 설계</h3>
            </div>

            {
              isLoading ? (
                <Loading center />
              ) : (
                <>
                  {/* 모든 질문 표시 */}
                  {questions.map(renderQuestionBox)}

                  {/* 완료 버튼 */}
                  <Button text="완료" onClick={handleComplete} />
                </>
              )
            }

            <div className="linkBox">
              <ArrowPrevButton href="/roadmap-info" hiddenText="로드맵안내화면으로 이동" />
            </div>
          </div>
        </Container>
      </div>

      {/* 팝업 */}
      <CompletePopup
        isOpen={popupOpen}
        message={popupMessage}
        onClose={() => setPopupOpen(false)}
      />
    </Main>
  );
}
