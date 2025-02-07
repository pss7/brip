import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import style from "./ResumePage.module.css";
import Button from "../components/Button";
import { useState } from "react";
import { resumeData } from "../data/resumeData";
import ViewButton from "../components/ViewButton";

export default function ResumePage() {
  const [resumeList, setResumeList] = useState(
    resumeData.map((resume) => ({ ...resume, isActionsVisible: false })) // 각 이력서 항목에 isActionsVisible 추가
  );
  
  const navigate = useNavigate();  // 페이지 이동을 위한 navigate 훅

  // ViewButton 클릭 시 수정/삭제 버튼 보이게 하는 토글 함수
  function handleToggle(id) {
    setResumeList((prevList) =>
      prevList.map((resume) =>
        resume.id === id
          ? { ...resume, isActionsVisible: !resume.isActionsVisible }
          : resume
      )
    );
  }

  // 수정 버튼 클릭 시
  function handleEdit(id) {
    const resumeToEdit = resumeList.find((resume) => resume.id === id);  // 수정할 이력서 찾기
    navigate(`/resumereg/${id}`, { state: { resume: resumeToEdit } });  // 수정할 이력서 데이터 전달
  }

  // 삭제 버튼 클릭 시
  function handleDelete(id) {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setResumeList((prevList) => prevList.filter((resume) => resume.id !== id));
    }
  }

  // 이력서 등록 페이지로 이동
  const handleCreateResume = () => {
    navigate("/resumereg/0"); // 새 이력서 작성 페이지로 이동
  };

  return (
    <Main className="subWrap bg">
      <div className="mypageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/mypage">
                  <span>프로필</span>
                </Link>
                <Link to="/interest">
                  <span>관심공고</span>
                </Link>
                <Link to="/resume" className="active">
                  <span>이력서관리</span>
                </Link>
                <Link to="/apply">
                  <span>지원현황</span>
                </Link>
                <Link to="/activity">
                  <span>내 활동</span>
                </Link>
              </aside>

              <div className={`content ${style.content} flexColumn`}>
                <h4 className="title">이력서 관리</h4>
                <p className="subTitle">효율적인 이력서 관리로 커리어 목표를 달성하세요</p>

                <ul className={style.resumeList}>
                  {resumeList.map((data) => (
                    <li key={data.id}>
                      {data.isDefault && <span className={style.basicResume}>기본이력서</span>}
                      <h5>{data.name}</h5>
                      <span className={style.date}>{data.date}</span>

                      {/* ViewButton을 클릭하여 수정/삭제 버튼 보이기 */}
                      <ViewButton
                        className={style.viewBox}
                        handleToggle={handleToggle}
                        data={data}
                        onEdit={handleEdit}  // 수정 함수 전달
                        onDelete={handleDelete}  // 삭제 함수 전달
                      />
                    </li>
                  ))}
                </ul>

                {/* 이력서 작성 버튼 */}
                <Button
                  text="이력서작성"
                  customClass={style.btn}
                  onClick={handleCreateResume} // 클릭 시 새 이력서 등록 페이지로 이동
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
