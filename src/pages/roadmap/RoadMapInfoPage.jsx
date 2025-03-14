import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import "../../styles/style.css";
import Button from "../../components/Button";
import RoadMapImg from "../../assets/images/sub/RoadMap_Img.png";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import style from "./RoadMapInfoPage.module.css";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getResume } from "../../api/user/resume/resume";
import CompletePopup from "../../components/CompletePopup";

export default function RoadMapInfoPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  // 팝업 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // 이력서 데이터 상태 관리
  const [resumeData, setResumeData] = useState([]);

  // 이력서 목록 데이터 불러오기
  useEffect(() => {
    async function fetchResume() {
      try {
        const response = await getResume();
        if (response) {
          setResumeData(response);
        }
      } catch (error) {
        console.error("error", error);
      }
    }
    fetchResume();
  }, []);

  if (!token) {
    navigate("/signin");
  }

  // 버튼 클릭 시 팝업을 띄울 조건 및 동작
  function handlePopup(e) {

    if (!resumeData || resumeData.length === 0) {
      setPopupMessage("이력서 등록 진행해주세요.");
      setIsPopupOpen(true);
      e.preventDefault();
    }
  }

  // 팝업 닫기 함수
  function onClose() {
    setIsPopupOpen(false);
  }

  return (
    <Main className="subWrap bg">
      <div className="roadMapBox">
        <Container>
          <div className={`roadMapContent ${style.roadMapContent}`}>
            <div className={`titleBox ${style.titleBox}`}>
              <h3>나만의 커리어 로드맵 설계</h3>
              <p>
                현재 상태를 분석하고, 부족한 역량을 채워줄
                <br />
                로드맵을 설계해드려요!
              </p>
            </div>

            <div className={style.imgBox}>
              <img src={RoadMapImg} alt="" />
            </div>

            <p className={style.infotext}>
              로드맵 설계를 통해 이런 혜택을 얻을 수 있어요!
            </p>

            <ul className={style.roadMapInfoList}>
              <li>필요한 역량을 분석하여 개선 방향 제시</li>
              <li>단계별 커리어 목표와 성장 경로 제공</li>
              <li>맞춤형 교육과 채용 정보 추천</li>
            </ul>

            <p className={style.infotext02}>
              지금 바로 로드맵 설계를 시작해보세요!
            </p>

            <Button
              text="로드맵 설계 시작하기"
              href="/roadmap-design"
              onClick={handlePopup}
            />

            <div className="linkBox">
              <ArrowPrevButton href="#" hiddenText="" />
            </div>
          </div>
        </Container>
      </div>

      {isPopupOpen && (
        <CompletePopup
          isOpen={isPopupOpen}
          message={popupMessage}
          onClose={onClose}
        />
      )}
    </Main>
  );
}
