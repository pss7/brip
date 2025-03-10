import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import style from "./ResumePage.module.css";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import ViewButton from "../../components/ViewButton";
import { deleteResume, getResume } from "../../api/user/resume/resume";
import Loading from "../../components/Loading";
import ConfirmPopup from "../../components/ConfirmPopup";
import CompletePopup from "../../components/CompletePopup";
import { useAuthStore } from "../../store/useAuthStore";

export default function ResumePage() {

  //토큰
  const { token } = useAuthStore();

  const navigate = useNavigate();

  //이력서 상태 관리
  const [resumeList, setResumeList] = useState([]);

  //로딩 상태 관리
  const [loading, setLoading] = useState(false);

  //팝업 상태 관리
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetResumeId, setTargetResumeId] = useState(null);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [completeMessage, setCompleteMessage] = useState("");
  const [completeError, setCompleteError] = useState(false);

  // 데이터 불러오기
  useEffect(() => {
    async function fetchResume() {
      setLoading(true);
      try {
        const response = await getResume();
        setResumeList(response);
      } catch (error) {
        console.error("error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, []);

  // 로딩 처리
  if (loading) return <Loading fullScreen />;

  // 날짜 형식 변환 (YYYY-MM-DD)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  function handleToggle(id) {
    setResumeList((prevList) =>
      prevList.map((resume) =>
        resume.resume_id === id
          ? { ...resume, isActionsVisible: !resume.isActionsVisible }
          : resume
      )
    );
  }

  function handleOpenDeleteConfirm(resume_id) {
    setTargetResumeId(resume_id);
    setIsConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    try {
      const response = await deleteResume(targetResumeId);
      if (response) {
        setCompleteMessage("이력서가 성공적으로 삭제되었습니다.");
        setCompleteError(false);
        setIsCompleteOpen(true);
        setResumeList((prevList) =>
          prevList.filter((resume) => resume.resume_id !== targetResumeId)
        );
      } else {

        setCompleteMessage("이력서 삭제에 실패했습니다.");
        setCompleteError(true);
        setIsCompleteOpen(true);
      }
    } catch (error) {
      console.error("error:", error);
      setCompleteMessage("오류가 발생했습니다. 다시 시도해주세요.");
      setCompleteError(true);
      setIsCompleteOpen(true);
    } finally {
      // ConfirmPopup 닫기
      setIsConfirmOpen(false);
      setTargetResumeId(null);
    }
  }

  function handleCloseConfirmPopup() {
    setIsConfirmOpen(false);
    setTargetResumeId(null);
  }

  function handleCloseCompletePopup() {
    setIsCompleteOpen(false);
  }

  // 이력서 수정
  function updateResume(updatedResume) {
    setResumeList((prevList) =>
      prevList.map((resume) =>
        resume.resume_id === updatedResume.id ? updatedResume : resume
      )
    );
  }

  if (!token) {
    navigate("/signin");
  }

  if (loading) {
    return <Loading />
  }

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
                <Link to="/interest"><span>관심공고</span></Link>
                <Link to="/resume" className="active"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>

              <div className={`content ${style.content} flexColumn`}>
                <h4 className="title">이력서 관리</h4>
                <p className="subTitle">
                  효율적인 이력서 관리로 커리어 목표를 달성하세요
                </p>

                <div className={style.resumeList}>
                  {
                    resumeList.length > 0 ? (
                      resumeList.map((resumeData) => (
                        <div className={style.resumeBox} key={resumeData.resume_id}>
                          {resumeData.is_default && (
                            <span className={style.basicResume}>기본이력서</span>
                          )}
                          <h5>
                            <Link to={`/resume-detail/${resumeData.resume_id}`}>{resumeData.resume_title}</Link>
                          </h5>
                          <span className={style.date}>
                            {formatDate(resumeData.created_at)}
                          </span>
                          <ViewButton
                            className={`${style.viewBox}`}
                            handleToggle={handleToggle}
                            data={resumeData}
                            onEdit={() => {
                              console.log("📌 수정할 이력서 ID:", resumeData.resume_id); // 여기서 확인
                              if (resumeData.resume_id) {
                                navigate(`/resume-update/${resumeData.resume_id}`);
                              } else {
                                console.error("❌ 이력서 ID가 존재하지 않습니다. 데이터 구조를 확인하세요.");
                              }
                            }}
                          />

                        </div>
                      ))
                    ) : (
                      <>
                        <p className="infoText">
                          등록된 이력서가 없습니다.
                        </p>
                      </>
                    )
                  }

                </div>

                <Button
                  text="이력서작성"
                  href={`/resume-registration`}
                  customClass={style.btn}
                />

              </div>
            </div>
          </div>
        </Container>
      </div>

      <ConfirmPopup
        isOpen={isConfirmOpen}
        message="정말 이력서를 삭제하시겠습니까?"
        subMessage="삭제 후에는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onClose={handleCloseConfirmPopup}
      />

      <CompletePopup
        isOpen={isCompleteOpen}
        message={completeMessage}
        error={completeError}
        onClose={handleCloseCompletePopup}
      />
    </Main>
  );
}
