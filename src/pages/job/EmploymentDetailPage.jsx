import { Link, useParams } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import style from "./EmploymentDetailPage.module.css";
import DetailImg from "../../assets/images/sub/Detail_Img.png";
import Button from "../../components/Button";
import { useEffect, useState, useMemo } from "react";
import CompletePopup from "../../components/CompletePopup";
import { getEmploymentDetail, getResumes, likeEmployment, applyEmployment } from "../../api/employment/employment";

// 정적 지원분야 옵션 (추후 API 연동 가능)
const applicationFields = [
  { id: 1, name: "개발" },
  { id: 2, name: "디자인" },
  { id: 3, name: "마케팅" },
  { id: 4, name: "영업" },
  { id: 5, name: "운영" },
];

export default function EmploymentDetailPage() {
  const { employment_Id } = useParams();
  const [employmentData, setEmploymentData] = useState({});
  const [skillsData, setSkillsData] = useState([]);
  const [isResumeVisible, setIsResumeVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // 이력서 목록 데이터 및 선택된 이력서 ID
  const [resumeData, setResumeData] = useState([]);
  const [resumeId, setResumeId] = useState(null);
  console.log(resumeId);

  const handlePopupCancel = () => {
    setIsPopupOpen(false);
  };

  // EmploymentDetail API 호출
  useEffect(() => {
    async function fetchEmploymentDetail() {
      try {
        const response = await getEmploymentDetail(employment_Id);
        if (response.result === "success") {
          setEmploymentData(response.employ);
          setSkillsData(response.skills);
        }
      } catch (error) {
        console.error("EmploymentDetail API 에러:", error);
      }
    }
    fetchEmploymentDetail();
  }, [employment_Id]);

  // Resumes API 호출: 이력서 목록 및 기본 이력서 선택
  useEffect(() => {
    async function fetchResumes() {
      try {
        const response = await getResumes();
        if (
          response &&
          response.result === "success" &&
          response.resumes &&
          response.resumes.length > 0
        ) {
          setResumeData(response.resumes);
          const defaultResume =
            response.resumes.find((r) => r.isDefault) || response.resumes[0];
          setResumeId(defaultResume.id);
        }
      } catch (error) {
        console.error("이력서 API 에러:", error);
      }
    }
    fetchResumes();
  }, []);

  // 상세 설명 파싱: detailed_description를 줄바꿈(\n) 기준으로 두 줄씩 묶어 제목/내용 배열 생성
  const detailItems = useMemo(() => {
    if (!employmentData.detailed_description) return [];
    const lines = employmentData.detailed_description
      .split("\n")
      .filter((line) => line.trim() !== "");
    const items = [];
    for (let i = 0; i < lines.length; i += 2) {
      items.push({
        title: lines[i],
        content: lines[i + 1] || "",
      });
    }
    return items;
  }, [employmentData.detailed_description]);

  // 제출하기 핸들러: 이력서가 없으면 모달로 안내, 있으면 applyEmployment API를 호출함
  const handleSubmit = async (selectedResumeId) => {
    console.log("📌 제출하기 버튼 클릭됨!");
    console.log("📌 employmentId:", employmentData.id);
    console.log("📌 resumeId:", selectedResumeId);

    if (!selectedResumeId) {
      setPopupMessage("지원하기 전에 등록된 이력서가 없습니다. 이력서를 작성해 주세요.");
      setIsError(true);
      setIsPopupOpen(true);
      return;
    }

    try {

      // ✅ API 요청 실행
      const result = await applyEmployment(employmentData.id, selectedResumeId);

      if (result && result.result === "success") {
        setPopupMessage("이력서 제출이 완료되었습니다.");
        setIsError(false);
      }
      setIsPopupOpen(true);
    } catch (error) {

      setPopupMessage("이미 지원한 채용 공고입니다.");
      setIsError(true);
      setIsPopupOpen(true);
    }
  };


  // 좋아요 버튼 핸들러
  const handleLike = async () => {
    try {
      const response = await likeEmployment(employmentData.id);
      if (response && response.result === "success") {
        setEmploymentData((prev) => ({
          ...prev,
          is_liked: !prev.is_liked,
        }));
      }
    } catch (error) {
      console.error("좋아요 API 호출 에러:", error);
    }
  };

  return (
    <Main className="subWrap">
      <div className={`employmentBox ${style.employmentDetailBox}`}>
        <Container className="container">
          <div className="employmentContent">
            <div className={style.employmentDetailTop}>
              <div className={style.imgBox}>
                <img src={DetailImg} alt="" />
              </div>
              <div className={style.textBox}>
                <span className={style.company}>{employmentData.company_name}</span>
                <div className={style.titleBox}>
                  <h3>{employmentData.title}</h3>
                </div>
                <p className={style.condition}>
                  {employmentData.career} {employmentData.education_requirement}{" "}
                  {employmentData.work_type} {employmentData.region_main}{" "}
                  {employmentData.region_sub}
                </p>
                <button
                  className={`${style.likeBtn} ${employmentData.is_liked ? style.active : ""}`}
                  onClick={handleLike}
                >
                  <span className="blind">
                    {employmentData.is_liked ? "좋아요 취소" : "좋아요"}
                  </span>
                </button>
              </div>
              <ArrowPrevButton
                customClass={style.arrowPrevBtn}
                href="/employment"
                hiddenText="채용공고 화면으로 이동"
              />
            </div>

            <div className={style.employmentDetailContent}>
              <div className={style.employmentDetailLeft}>
                <div className={style.employmentDetail}>
                  <h4>상세요강</h4>
                  <ul className={style.detailContentList}>
                    {detailItems.map((item, index) => (
                      <li key={index}>
                        <span>{item.title}</span>
                        <em>{item.content}</em>
                      </li>
                    ))}
                    {isDetailVisible && (
                      <li>
                        <span>[기타]</span>
                        <em>추가된 상세 정보</em>
                      </li>
                    )}
                  </ul>
                  <button
                    className={style.detailView}
                    onClick={() => setIsDetailVisible(!isDetailVisible)}
                  >
                    {isDetailVisible ? "상세정보 숨기기" : "상세정보 더보기"}
                  </button>
                </div>

                <div className={style.employmentDetail}>
                  <h4>기술스택</h4>
                  <ul className={style.techStack}>
                    {skillsData.map((data, index) => (
                      <li key={index}>{data.skill_name}</li>
                    ))}
                  </ul>
                </div>

                <div className={style.employmentDetail}>
                  <h4>마감일</h4>
                  <span className={style.deadlineText}>{employmentData.deadline}</span>
                </div>

                <div className={style.employmentDetail}>
                  <h4>기업정보</h4>
                  <div className={style.corporateInfo}>
                    <div className={style.imgBox}>
                      {/* 기업 이미지 추가 가능 */}
                    </div>
                    <div className={style.textBox}>
                      <h5>{employmentData.company_name}</h5>
                      <ul className={style.corporateInfoList}>
                        <li>{employmentData.company_field}</li>
                        <li>
                          <span>사원수</span> {employmentData.employee_count}
                        </li>
                        <li>{employmentData.founded_year}</li>
                        <li>{employmentData.company_type}</li>
                        <li>{employmentData.annual_sales}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={style.employmentDetail}>
                  <h4>근무위치</h4>
                  <address>{employmentData.work_location}</address>
                  <div className={style.mapBox}>지도영역</div>
                </div>
              </div>

              <div className={style.employmentDetailRight}>
                {isResumeVisible ? (
                  <div className={style.applyBox}>
                    <h4>지원하기</h4>
                    <div className={style.selectBox}>
                      <label htmlFor="select" className="blind">
                        지원분야 선택
                      </label>
                      <select id="select" className={style.select}>
                        <option value="">지원분야선택</option>
                        {applicationFields.map((field) => (
                          <option key={field.id} value={field.id}>
                            {field.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {resumeData.length > 0 ? (
                      <ul className={style.resumeList}>
                        {resumeData.map((resume) => (
                          <li key={resume.id}>
                            <div className={style.resumeBox}>
                              <div className={style.resumeInfoList}>
                                {resume.isDefault && <span className={style.basic}>기본이력서</span>}
                              </div>
                              <div className={style.titleBox}>
                                <h5>
                                  <input
                                    type="radio"
                                    name="resumeRadio"
                                    id={`resumeRadio${resume.id}`}
                                    className="blind"
                                    onChange={() => setResumeId(resume.id)} // ✅ 최신 resumeId 반영
                                    checked={resumeId === resume.id}
                                  />
                                  <label htmlFor={`resumeRadio${resume.id}`}>{resume.title}</label>
                                </h5>
                              </div>
                              <span className={style.date}>{resume.createdAt.slice(0, 10)}</span>
                              <Link to="/resumereg" className={style.viewBtn}>보기</Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="infoText">등록된 이력서가 없습니다.</p>
                    )}

                    <Link to="/resumereg">
                      <button className={style.writeBtn}>
                        <span>새 이력서 작성</span>
                      </button>
                    </Link>

                    <Button
                      text="제출하기"
                      customClass={style.btn}
                      onClick={() => handleSubmit(resumeId)}
                    />

                    <Link className={style.link} to="/employment">
                      <span className="blind">채용공고 화면으로 이동</span>
                    </Link>
                  </div>
                ) : (
                  <Button
                    text="이력서 작성"
                    customClass={style.btn}
                    onClick={() => setIsResumeVisible(true)}
                  />
                )}

                <div className={style.aiInfoBox}>
                  <p>
                    이력서를 작성하면 <br />
                    AI가 <strong>채용공고를 추천</strong>해줘요!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <CompletePopup
        isOpen={isPopupOpen}
        onClose={handlePopupCancel}
        message={popupMessage}
        error={isError}
      />
    </Main>
  );
}
