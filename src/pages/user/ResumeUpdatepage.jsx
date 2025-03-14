import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import style from "./ResumeRegpage.module.css";
import Button from "../../components/Button";
import Input from "../../components/Input";
import FileImg from "../../assets/images/sub/file_img.svg";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import Loading from "../../components/Loading";
import { getResumeDetail, updateResume } from "../../api/user/resume/resume";
import { getProfile } from "../../api/user";
import CompletePopup from "../../components/CompletePopup";
import { useAuthStore } from "../../store/useAuthStore";

// 헬퍼 함수: 날짜 문자열("YYYY-MM-DD")을 분리하여 [년, 월] 반환
function getDateParts(dateString) {
  return dateString && dateString.includes("-") ? dateString.split("-") : ["", ""];
}

// ResumeField 컴포넌트
const ResumeField = ({ label, value, onChange, placeholder, readOnly, type = "text", step }) => (
  <div className={`${style.inputBox} ${!value ? style.error : ""}`}>
    {label && <label>{label}</label>}
    <Input
      type={type}
      step={step}
      value={value ?? ""}
      onChange={readOnly ? () => { } : onChange}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  </div>
);

export default function ResumeUpdatepage() {
  const { resume_Id } = useParams();
  const { token } = useAuthStore();
  const navigate = useNavigate();

  // resumeData 상태: 등록/수정페이지와 동일한 데이터 구조
  const [resumeData, setResumeData] = useState({
    resumeTitle: "",
    resumePhoto: "",
    isDefault: true,
    education: [{
      schoolType: "",
      schoolName: "",
      major: "",
      admissionDate: "",
      graduationDate: "",
      maxScore: 0,
      score: 0,
    }],
    languageSkill: [{
      languageName: "",
      speakingLevel: "",
      testName: "",
      score: "",
      acquisitionDate: "",
    }],
    certificate: [{
      certificateName: "",
      issuingOrganization: "",
      acquisitionDate: "",
    }],
    activity: [{
      activityType: "",
      organizationName: "",
      startDate: "",
      endDate: "",
      description: "",
    }],
    career: [{
      careerTitle: "",
      startDate: "",
      endDate: "",
    }],
    portfolio: [{
      portfolioName: "",
      url: "",
      filePath: "",
    }],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumePhotoFile, setResumePhotoFile] = useState(null);
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [profileImageUrl, setProfileImageUrl] = useState("");

  // 아코디언 상태 (초기에는 모두 닫힘)
  const [accordions, setAccordions] = useState({
    education: false,
    languageSkill: false,
    certificate: false,
    activity: false,
    career: false,
    portfolio: false,
  });

  const toggleAccordion = (section) => {
    setAccordions(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 배열 내 객체의 값 변경 (동적 입력 처리)
  function handleFieldChange(index, field, value, group) {
    if (group) {
      setResumeData(prev => {
        const updatedGroup = [...prev[group]];
        updatedGroup[index] = { ...updatedGroup[index], [field]: value };
        return { ...prev, [group]: updatedGroup };
      });
    } else {
      setResumeData(prev => ({ ...prev, [field]: value }));
    }
  }

  // 날짜 및 점수 생성 함수
  function generateYears() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1900; i--) {
      years.push(i);
    }
    return years;
  }
  function generateMonths() {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    return months;
  }
  function generateScores() {
    const scores = [];
    for (let i = 0; i <= 4.5; i += 0.1) {
      scores.push(i.toFixed(1));
    }
    return scores;
  }

  // 이력서 사진 파일 선택 처리
  function handleResumePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setResumePhotoFile(file);
      const imageURL = URL.createObjectURL(file);
      setResumeData(prev => ({ ...prev, resumePhoto: imageURL }));
    }
  }

  // 포트폴리오 파일 선택 처리
  function handlePortfolioFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPortfolioFile(file);
      setResumeData(prev => {
        const updatedPortfolio = [...prev.portfolio];
        updatedPortfolio[0] = { ...updatedPortfolio[0], filePath: file.name };
        return { ...prev, portfolio: updatedPortfolio };
      });
    }
  }

  function handlePortfolioFileDelete() {
    setPortfolioFile(null);
    setResumeData(prev => {
      const updatedPortfolio = [...prev.portfolio];
      updatedPortfolio[0] = { ...updatedPortfolio[0], filePath: "" };
      return { ...prev, portfolio: updatedPortfolio };
    });
    document.getElementById("portfolioFileInput").value = "";
  }

  // 동적 항목 추가 함수 (최대 개수 제한 적용)
  const addLanguageSkill = () => {
    setResumeData(prev => {
      if (prev.languageSkill.length >= 5) return prev;
      return {
        ...prev,
        languageSkill: [
          ...prev.languageSkill,
          { languageName: "", speakingLevel: "", testName: "", score: "", acquisitionDate: "" }
        ]
      };
    });
  };

  const addCertificate = () => {
    setResumeData(prev => {
      if (prev.certificate.length >= 10) return prev;
      return {
        ...prev,
        certificate: [
          ...prev.certificate,
          { certificateName: "", issuingOrganization: "", acquisitionDate: "" }
        ]
      };
    });
  };

  const addActivity = () => {
    setResumeData(prev => {
      if (prev.activity.length >= 5) return prev;
      return {
        ...prev,
        activity: [
          ...prev.activity,
          { activityType: "", organizationName: "", startDate: "", endDate: "", description: "" }
        ]
      };
    });
  };

  const addCareer = () => {
    setResumeData(prev => ({
      ...prev,
      career: [...prev.career, { careerTitle: "", startDate: "", endDate: "" }]
    }));
  };

  const addPortfolio = () => {
    setResumeData(prev => ({
      ...prev,
      portfolio: [...prev.portfolio, { portfolioName: "", url: "", filePath: "" }]
    }));
  };

  // 프로필 데이터 불러오기
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const response = await getProfile();
        setProfileData(response.data);
        if (response.data.profileImage) {
          setProfileImageUrl(response.data.profileImage);
        }
      } catch (error) {
        console.error("프로필 데이터 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);


  useEffect(() => {

    async function fetchResumeDetail() {

      try {
        setLoading(true);

        const response = await getResumeDetail(resume_Id);

        if (response) {
          setResumeData({
            resumeTitle: response.resume_title || "",
            resumePhoto: response.resume_photo || "",
            isDefault: response.is_default ?? true,
            education: response.education?.length > 0 ? response.education.map(item => ({
              schoolType: item.school_type || "",
              schoolName: item.school_name || "",
              major: item.major || "",
              admissionDate: item.admission_date || "",
              graduationDate: item.graduation_date || "",
              maxScore: item.max_score || 0,
              score: item.score || 0,
            })) : [{
              schoolType: "",
              schoolName: "",
              major: "",
              admissionDate: "",
              graduationDate: "",
              maxScore: 0,
              score: 0,
            }],
            languageSkill: Array.isArray(response.languageSkill) && response.languageSkill.length > 0
              ? response.languageSkill.map(item => ({
                languageName: item.language_name || "",
                speakingLevel: item.speaking_level || "",
                testName: item.test_name || "",
                score: item.score || "",
                acquisitionDate: item.acquisition_date || "",
              }))
              : response.languageSkill
                ? [{
                  languageName: response.languageSkill.language_name || "",
                  speakingLevel: response.languageSkill.speaking_level || "",
                  testName: response.languageSkill.test_name || "",
                  score: response.languageSkill.score || "",
                  acquisitionDate: response.languageSkill.acquisition_date || "",
                }]
                : [{
                  languageName: "",
                  speakingLevel: "",
                  testName: "",
                  score: "",
                  acquisitionDate: "",
                }],
            certificate: response.certificate?.length > 0 ? response.certificate.map(item => ({
              certificateName: item.certificate_name || "",
              issuingOrganization: item.issuing_organization || "",
              acquisitionDate: item.acquisition_date || "",
            })) : [{
              certificateName: "",
              issuingOrganization: "",
              acquisitionDate: "",
            }],
            activity: response.activity?.length > 0 ? response.activity.map(item => ({
              activityType: item.activity_type || "",
              organizationName: item.organization_name || "",
              startDate: item.start_date || "",
              endDate: item.end_date || "",
              description: item.description || "",
            })) : [{
              activityType: "",
              organizationName: "",
              startDate: "",
              endDate: "",
              description: "",
            }],
            career: response.career?.length > 0 ? response.career.map(item => ({
              careerTitle: item.career_title || "",
              startDate: item.start_date || "",
              endDate: item.end_date || "",
            })) : [{
              careerTitle: "",
              startDate: "",
              endDate: "",
            }],
            portfolio: response.portfolio?.length > 0 ? response.portfolio.map(item => ({
              portfolioName: item.portfolio_name || "",
              url: item.url || "",
              filePath: item.file_path || "",
            })) : [{
              portfolioName: "",
              url: "",
              filePath: "",
            }],
          });
        } else {
          navigate("/resume");
        }
      } catch (error) {
        console.error("이력서 상세 조회 오류:", error);
        navigate("/resume");
      } finally {
        setLoading(false);
      }
    }
    if (resume_Id) {
      fetchResumeDetail();
    }
  }, [resume_Id, navigate]);

  if (loading) return <Loading fullScreen />;

  if (!token) navigate("/signin");

  // 필수 입력 항목 검증 함수
  function validateForm() {
    if (!resumeData.resumeTitle.trim()) {
      setModalMessage("이력서 제목은 필수 입력사항입니다.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    const edu = resumeData.education[0];
    if (!edu.schoolType || !edu.schoolName.trim() || !edu.major.trim() || !edu.admissionDate || !edu.graduationDate) {
      setModalMessage("학력 정보의 필수 입력사항을 모두 입력해주세요.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    const lang = resumeData.languageSkill[0];
    const langFields = [lang.languageName, lang.speakingLevel, lang.testName, lang.score, lang.acquisitionDate];
    if (langFields.some(field => field) && langFields.some(field => !field)) {
      setModalMessage("외국어 정보의 필수 입력사항을 모두 입력해주세요.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    const cert = resumeData.certificate[0];
    const certFields = [cert.certificateName, cert.issuingOrganization, cert.acquisitionDate];
    if (certFields.some(field => field) && certFields.some(field => !field)) {
      setModalMessage("자격증 정보의 필수 입력사항을 모두 입력해주세요.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    const act = resumeData.activity[0];
    const actFields = [act.activityType, act.organizationName, act.startDate, act.endDate, act.description];
    if (actFields.some(field => field) && actFields.some(field => !field)) {
      setModalMessage("대외활동 정보의 필수 입력사항을 모두 입력해주세요.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    const career = resumeData.career[0];
    const careerFields = [career.careerTitle, career.startDate, career.endDate];
    if (careerFields.some(field => field) && careerFields.some(field => !field)) {
      setModalMessage("경력 정보의 필수 입력사항을 모두 입력해주세요.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    const port = resumeData.portfolio[0];
    if ((port.portfolioName || port.url || port.filePath) && (!port.portfolioName || !port.url)) {
      setModalMessage("포트폴리오 정보의 필수 입력사항을 모두 입력해주세요.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    return true;
  }

  function handleClosePopup() {
    setIsModalOpen(false);
    if (!modalError) navigate("/resume");
  }

  function handleProfileImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImageUrl(imageURL);
      setResumeData(prev => ({ ...prev, resumePhoto: imageURL }));
      setResumePhotoFile(file);
    }
  }

  async function handleSubmit() {
    if (!validateForm()) return;
    try {
      const formData = new FormData();
      const dataObject = {
        resumeTitle: resumeData.resumeTitle,
        isDefault: resumeData.isDefault,
        education: resumeData.education,
        languageSkill: resumeData.languageSkill,
        certificate: resumeData.certificate,
        activity: resumeData.activity,
        career: resumeData.career,
        portfolio: resumeData.portfolio,
      };
      formData.append("resumeData", JSON.stringify(dataObject));
      if (resumePhotoFile) formData.append("resumePhoto", resumePhotoFile);
      if (portfolioFile) formData.append("portfolioFile", portfolioFile);
      // 디버그: formData 내용 출력
      for (let pair of formData.entries()) {
        console.log(pair[0], ":", pair[1]);
      }
      const response = await updateResume(resume_Id, formData);
      if (response) {
        setModalMessage("이력서 수정이 완료되었습니다");
        setModalError(false);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("error:", error);
      setModalMessage("이력서 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      setModalError(true);
      setIsModalOpen(true);
    }
  }

  return (
    <Main className="subWrap bg">
      <div className="mypageBox resumePageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/mypage"><span>프로필</span></Link>
                <Link to="/interest"><span>관심공고</span></Link>
                <Link to="/resume" className="active"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>
              <div className={`content ${style.content} flexColumn`}>
                <h4 className={`title ${style.userGreeting}`}>
                  {profileData.name}님의 <br />이력서를 수정해주세요.
                </h4>

                {/* 프로필 이미지 업로드 */}
                <div className={style.imgFileBox}>
                  <input
                    type="file"
                    accept="image/*"
                    className="blind"
                    id="profileImageInput"
                    onChange={handleProfileImageChange}
                  />
                  <label htmlFor="profileImageInput" className={style.fileLabel}>
                    <img src={profileImageUrl || FileImg} alt="프로필 이미지 선택" />
                  </label>
                </div>

                {/* 이력서 제목 */}
                <ResumeField
                  label="이력서 제목"
                  placeholder="나를 대표할 한 줄 제목을 입력해주세요."
                  value={resumeData.resumeTitle}
                  onChange={(e) => handleFieldChange(null, "resumeTitle", e.target.value, null)}
                />

                <h5 className={style.title}>인적사항</h5>
                <ResumeField label="이름" readOnly={true} value={profileData.name} />
                <ResumeField label="휴대폰번호" readOnly={true} value={profileData.phone} />
                <ResumeField label="이메일" readOnly={true} value={profileData.email} />
                <ResumeField label="생년월일" readOnly={true} value={profileData.birth_date} />

                {/* 학력 섹션 (단일 입력) */}
                <div className={style.resumeRegBox}>
                  <button className={`${style.accordionBtn} ${accordions.education ? style.active : ""}`}
                    onClick={() => toggleAccordion("education")}>
                    <h5 className={style.title}>학력</h5>
                  </button>
                  {accordions.education && (
                    <div className={style.accordionBox}>
                      <div className={style.selectBox}>
                        <label htmlFor="SchoolClassification">학교구분</label>
                        <select
                          id="SchoolClassification"
                          className={style.select}
                          value={resumeData.education[0].schoolType}
                          onChange={(e) => handleFieldChange(0, "schoolType", e.target.value, "education")}
                        >
                          <option value="" disabled>학교 구분 선택</option>
                          <option value="대학교">대학교</option>
                          <option value="고등학교">고등학교</option>
                        </select>
                      </div>
                      <ResumeField
                        label="학교명"
                        placeholder="학교명 입력"
                        value={resumeData.education[0].schoolName}
                        onChange={(e) => handleFieldChange(0, "schoolName", e.target.value, "education")}
                      />
                      <ResumeField
                        label="전공명"
                        placeholder="전공명 입력"
                        value={resumeData.education[0].major}
                        onChange={(e) => handleFieldChange(0, "major", e.target.value, "education")}
                      />
                      <div className={style.selectBox}>
                        <label>입학 연월</label>
                        <div className={style.layoutBox}>
                          {(() => {
                            const [year, month] = getDateParts(resumeData.education[0].admissionDate);
                            return (
                              <>
                                <div className={style.box}>
                                  <select className={style.select}
                                    value={year}
                                    onChange={(e) => {
                                      const m = month || "01";
                                      handleFieldChange(0, "admissionDate", `${e.target.value}-${m}`, "education");
                                    }}
                                  >
                                    <option value="" disabled>년</option>
                                    {generateYears().map((yr) => (
                                      <option key={yr} value={yr}>{yr}</option>
                                    ))}
                                  </select>
                                  <span>년</span>
                                </div>
                                <div className={style.box}>
                                  <select className={style.select}
                                    value={month}
                                    onChange={(e) => {
                                      const y = year || "";
                                      handleFieldChange(0, "admissionDate", `${y}-${e.target.value}`, "education");
                                    }}
                                  >
                                    <option value="" disabled>월</option>
                                    {generateMonths().map((mn) => (
                                      <option key={mn} value={mn < 10 ? `0${mn}` : mn}>
                                        {mn < 10 ? `0${mn}` : mn}
                                      </option>
                                    ))}
                                  </select>
                                  <span>월</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div className={style.selectBox}>
                        <label>졸업 연월</label>
                        <div className={style.layoutBox}>
                          {(() => {
                            const [year, month] = getDateParts(resumeData.education[0].graduationDate);
                            return (
                              <>
                                <div className={style.box}>
                                  <select className={style.select}
                                    value={year}
                                    onChange={(e) => {
                                      const m = month || "01";
                                      handleFieldChange(0, "graduationDate", `${e.target.value}-${m}`, "education");
                                    }}
                                  >
                                    <option value="" disabled>년</option>
                                    {generateYears().map((yr) => (
                                      <option key={yr} value={yr}>{yr}</option>
                                    ))}
                                  </select>
                                  <span>년</span>
                                </div>
                                <div className={style.box}>
                                  <select className={style.select}
                                    value={month}
                                    onChange={(e) => {
                                      const y = year || "";
                                      handleFieldChange(0, "graduationDate", `${y}-${e.target.value}`, "education");
                                    }}
                                  >
                                    <option value="" disabled>월</option>
                                    {generateMonths().map((mn) => (
                                      <option key={mn} value={mn < 10 ? `0${mn}` : mn}>
                                        {mn < 10 ? `0${mn}` : mn}
                                      </option>
                                    ))}
                                  </select>
                                  <span>월</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div className={style.selectBox}>
                        <label>학점</label>
                        <div className={style.layoutBox}>
                          <select className={style.select}
                            value={resumeData.education[0].maxScore}
                            onChange={(e) => handleFieldChange(0, "maxScore", Number(e.target.value), "education")}
                          >
                            <option value="" disabled>만점선택</option>
                            {generateScores().map((score) => (
                              <option key={score} value={score}>{score}</option>
                            ))}
                          </select>
                          <ResumeField
                            placeholder="학점 입력 (예: 4.0)"
                            value={resumeData.education[0].score}
                            type="number"
                            step="0.1"
                            onChange={(e) => handleFieldChange(0, "score", parseFloat(e.target.value), "education")}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 외국어(언어능력) 섹션 - 동적 항목 */}
                <div className={style.resumeRegBox}>
                  <button className={`${style.accordionBtn} ${accordions.languageSkill ? style.active : ""}`}
                    onClick={() => toggleAccordion("languageSkill")}>
                    <h5 className={style.title}>외국어</h5>
                  </button>
                  {accordions.languageSkill && (
                    <div className={style.accordionBox}>
                      {resumeData.languageSkill.map((item, idx) => (
                        <div key={idx} className={style.dynamicField}>
                          <div className={style.selectBox}>
                            <label>외국어명</label>
                            <select className={style.select}
                              value={item.languageName}
                              onChange={(e) => handleFieldChange(idx, "languageName", e.target.value, "languageSkill")}
                            >
                              <option value="" disabled>외국어명 선택</option>
                              <option value="영어">영어</option>
                              <option value="한국어">한국어</option>
                            </select>
                          </div>
                          <div className={style.selectBox}>
                            <label>회화능력</label>
                            <select className={style.select}
                              value={item.speakingLevel}
                              onChange={(e) => handleFieldChange(idx, "speakingLevel", e.target.value, "languageSkill")}
                            >
                              <option value="" disabled>회화능력 선택</option>
                              <option value="하">하</option>
                              <option value="중">중</option>
                              <option value="상">상</option>
                            </select>
                          </div>
                          <div className={style.selectBox}>
                            <label>시험명</label>
                            <select className={style.select}
                              value={item.testName}
                              onChange={(e) => handleFieldChange(idx, "testName", e.target.value, "languageSkill")}
                            >
                              <option value="" disabled>시험명 선택</option>
                              <option value="TOEIC">TOEIC</option>
                              <option value="TOEFL">TOEFL</option>
                              <option value="IELTS">IELTS</option>
                            </select>
                          </div>
                          <ResumeField
                            label="점수/급수"
                            placeholder="점수 입력 (예: 850)"
                            value={item.score}
                            onChange={(e) => handleFieldChange(idx, "score", e.target.value, "languageSkill")}
                          />
                          <ResumeField
                            label="취득 년월"
                            placeholder="취득 년월 (ex. 2023-01)"
                            value={item.acquisitionDate}
                            onChange={(e) => handleFieldChange(idx, "acquisitionDate", e.target.value, "languageSkill")}
                          />
                        </div>
                      ))}
                      {resumeData.languageSkill.length < 5 && (
                        <Button text="추가" onClick={addLanguageSkill} />
                      )}
                    </div>
                  )}
                </div>

                {/* 자격증 섹션 - 동적 항목 */}
                <div className={style.resumeRegBox}>
                  <button className={`${style.accordionBtn} ${accordions.certificate ? style.active : ""}`}
                    onClick={() => toggleAccordion("certificate")}>
                    <h5 className={style.title}>자격증</h5>
                  </button>
                  {accordions.certificate && (
                    <div className={style.accordionBox}>
                      {resumeData.certificate.map((item, idx) => (
                        <div key={idx} className={style.dynamicField}>
                          <ResumeField
                            label="자격증명"
                            placeholder="자격증명 입력"
                            value={item.certificateName}
                            onChange={(e) => handleFieldChange(idx, "certificateName", e.target.value, "certificate")}
                          />
                          <ResumeField
                            label="발급 기관"
                            placeholder="발급 기관 입력"
                            value={item.issuingOrganization}
                            onChange={(e) => handleFieldChange(idx, "issuingOrganization", e.target.value, "certificate")}
                          />
                          <ResumeField
                            label="취득일"
                            placeholder="취득일 (ex. 2023-06)"
                            value={item.acquisitionDate}
                            onChange={(e) => handleFieldChange(idx, "acquisitionDate", e.target.value, "certificate")}
                          />
                        </div>
                      ))}
                      {resumeData.certificate.length < 10 && (
                        <Button text="추가" onClick={addCertificate} />
                      )}
                    </div>
                  )}
                </div>

                {/* 대외활동 섹션 - 동적 항목 */}
                <div className={style.resumeRegBox}>
                  <button className={`${style.accordionBtn} ${accordions.activity ? style.active : ""}`}
                    onClick={() => toggleAccordion("activity")}>
                    <h5 className={style.title}>대외활동</h5>
                  </button>
                  {accordions.activity && (
                    <div className={style.accordionBox}>
                      {resumeData.activity.map((item, idx) => (
                        <div key={idx} className={style.dynamicField}>
                          <div className={style.selectBox}>
                            <label>활동 유형</label>
                            <select className={style.select}
                              value={item.activityType}
                              onChange={(e) => handleFieldChange(idx, "activityType", e.target.value, "activity")}
                            >
                              <option value="" disabled>활동 유형 선택</option>
                              <option value="인턴">인턴</option>
                              <option value="봉사활동">봉사활동</option>
                              <option value="공모전">공모전</option>
                            </select>
                          </div>
                          <ResumeField
                            label="기관명"
                            placeholder="기관명 입력"
                            value={item.organizationName}
                            onChange={(e) => handleFieldChange(idx, "organizationName", e.target.value, "activity")}
                          />
                          <ResumeField
                            label="시작일 (YYYY-MM)"
                            placeholder="시작일 입력"
                            value={item.startDate}
                            onChange={(e) => handleFieldChange(idx, "startDate", e.target.value, "activity")}
                          />
                          <ResumeField
                            label="종료일 (YYYY-MM)"
                            placeholder="종료일 입력"
                            value={item.endDate}
                            onChange={(e) => handleFieldChange(idx, "endDate", e.target.value, "activity")}
                          />
                          <ResumeField
                            label="활동 내용"
                            placeholder="활동 내용 입력"
                            value={item.description}
                            onChange={(e) => handleFieldChange(idx, "description", e.target.value, "activity")}
                          />
                        </div>
                      ))}
                      {resumeData.activity.length < 5 && (
                        <Button text="추가" onClick={addActivity} />
                      )}
                    </div>
                  )}
                </div>

                {/* 경력 섹션 - 동적 항목 (제한 없음) */}
                <div className={style.resumeRegBox}>
                  <button className={`${style.accordionBtn} ${accordions.career ? style.active : ""}`}
                    onClick={() => toggleAccordion("career")}>
                    <h5 className={style.title}>경력</h5>
                  </button>
                  {accordions.career && (
                    <div className={style.accordionBox}>
                      {resumeData.career.map((item, idx) => (
                        <div key={idx} className={style.dynamicField}>
                          <ResumeField
                            label="경력 타이틀"
                            placeholder="예: 주니어 개발자"
                            value={item.careerTitle}
                            onChange={(e) => handleFieldChange(idx, "careerTitle", e.target.value, "career")}
                          />
                          <ResumeField
                            label="시작일 (YYYY-MM)"
                            placeholder="시작일 입력"
                            value={item.startDate}
                            onChange={(e) => handleFieldChange(idx, "startDate", e.target.value, "career")}
                          />
                          <ResumeField
                            label="종료일 (YYYY-MM)"
                            placeholder="종료일 입력"
                            value={item.endDate}
                            onChange={(e) => handleFieldChange(idx, "endDate", e.target.value, "career")}
                          />
                        </div>
                      ))}
                      <Button text="추가" onClick={addCareer} />
                    </div>
                  )}
                </div>

                {/* 포트폴리오 섹션 - 동적 항목 (제한 없음) */}
                <div className={style.resumeRegBox}>
                  <button className={`${style.accordionBtn} ${accordions.portfolio ? style.active : ""}`}
                    onClick={() => toggleAccordion("portfolio")}>
                    <h5 className={style.title}>포트폴리오</h5>
                  </button>
                  {accordions.portfolio && (
                    <div className={style.accordionBox}>
                      {resumeData.portfolio.map((item, idx) => (
                        <div key={idx} className={style.dynamicField}>
                          <ResumeField
                            label="포트폴리오명"
                            placeholder="포트폴리오명 입력"
                            value={item.portfolioName}
                            onChange={(e) => handleFieldChange(idx, "portfolioName", e.target.value, "portfolio")}
                          />
                          <ResumeField
                            label="URL"
                            placeholder="URL 입력"
                            value={item.url}
                            onChange={(e) => handleFieldChange(idx, "url", e.target.value, "portfolio")}
                          />
                          <div className={style.resumeRegBox}>
                            <label>파일첨부</label>
                            <div className={style.fileWrap}>
                              <label htmlFor="portfolioFileInput" className={style.fileUploadLeft} aria-label="파일선택">
                                <input
                                  type="file"
                                  id="portfolioFileInput"
                                  accept="image/*,application/pdf"
                                  onChange={handlePortfolioFileChange}
                                  style={{ display: "none" }}
                                />
                              </label>
                              {item.filePath && (
                                <div className={style.fileUploadRight}>
                                  <span className={style.fileName}>{item.filePath}</span>
                                  <button onClick={handlePortfolioFileDelete} className={style.deleteBtn}>
                                    <span className="blind">첨부파일삭제</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button text="추가" onClick={addPortfolio} />
                    </div>
                  )}
                </div>

                <Button text="수정완료" onClick={handleSubmit} />
                <ArrowPrevButton
                  customClass={style.arrowPrevBtn}
                  href="/resume"
                  hiddenText="커리어탐색 화면으로 이동"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <CompletePopup
        isOpen={isModalOpen}
        message={modalMessage}
        error={modalError}
        onClose={handleClosePopup}
      />
    </Main>
  );
}
