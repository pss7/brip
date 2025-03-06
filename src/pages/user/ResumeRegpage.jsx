import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import style from "./ResumeRegpage.module.css";
import Button from "../../components/Button";
import Input from "../../components/Input";
import FileImg from "../../assets/images/sub/file_img.svg";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import Loading from "../../components/Loading";
import { createResume } from "../../api/user/resume/resume";
import { getProfile, updateProfileImage } from "../../api/user";
import CompletePopup from "../../components/CompletePopup";
import { useAuthStore } from "../../store/useAuthStore";

// ResumeField 컴포넌트
const ResumeField = ({ label, value, onChange, placeholder, readOnly, type = "text", step }) => (
  <div className={`${style.inputBox} ${!value ? style.error : ""}`}>
    {label && <label>{label}</label>}
    <Input
      type={type}
      step={step}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  </div>
);

export default function ResumeRegpage() {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  // 이력서 데이터 상태
  const [resumeData, setResumeData] = useState({
    resumeTitle: "",
    resumePhoto: "",
    isDefault: true,
    education: [
      {
        schoolType: "",
        schoolName: "",
        major: "",
        admissionDate: "",
        graduationDate: "",
        maxScore: 0,
        score: 0,
      },
    ],
    languageSkill: [
      {
        languageName: "",
        speakingLevel: "",
        testName: "",
        score: "",
        acquisitionDate: "",
      },
    ],
    certificate: [
      {
        certificateName: "",
        issuingOrganization: "",
        acquisitionDate: "",
      },
    ],
    activity: [
      {
        activityType: "",
        organizationName: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    career: [
      {
        careerTitle: "",
        startDate: "",
        endDate: "",
      },
    ],
    portfolio: [
      {
        portfolioName: "",
        url: "",
        filePath: "",
      },
    ],
  });

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState(false);

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 파일 상태
  const [resumePhotoFile, setResumePhotoFile] = useState(null);
  const [portfolioFile, setPortfolioFile] = useState(null);

  // 프로필 데이터 및 이미지 상태
  const [profileData, setProfileData] = useState({});
  const [profileImageUrl, setProfileImageUrl] = useState("");

  // 아코디언 상태 (모든 섹션 닫힘)
  const [accordions, setAccordions] = useState({
    education: false,
    languageSkill: false,
    certificate: false,
    activity: false,
    career: false,
    portfolio: false,
  });

  // 아코디언 토글 함수
  const toggleAccordion = (section) => {
    setAccordions((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 공통 필드 변경 핸들러 (배열 내 객체 지원)
  function handleFieldChange(index, field, value, group) {
    if (group) {
      setResumeData((prev) => {
        const updatedGroup = [...prev[group]];
        updatedGroup[index] = { ...updatedGroup[index], [field]: value };
        return { ...prev, [group]: updatedGroup };
      });
    } else {
      setResumeData((prev) => ({ ...prev, [field]: value }));
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
      setResumeData((prev) => ({ ...prev, resumePhoto: imageURL }));
    }
  }

  // 포트폴리오 파일 선택 처리
  function handlePortfolioFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPortfolioFile(file);
      setResumeData((prev) => {
        const updatedPortfolio = [...prev.portfolio];
        updatedPortfolio[0] = { ...updatedPortfolio[0], filePath: file.name };
        return { ...prev, portfolio: updatedPortfolio };
      });
    }
  }
  function handlePortfolioFileDelete() {
    setPortfolioFile(null);
    setResumeData((prev) => {
      const updatedPortfolio = [...prev.portfolio];
      updatedPortfolio[0] = { ...updatedPortfolio[0], filePath: "" };
      return { ...prev, portfolio: updatedPortfolio };
    });
    document.getElementById("portfolioFileInput").value = "";
  }

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
        console.error("error:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();

  }, []);

  if (loading) {
    return <Loading fullScreen />;
  }
  if (!token) {
    navigate("/signin");
  }

  // 필수 입력 항목 검증 함수
  function validateForm() {
    if (!resumeData.resumeTitle.trim()) {
      setModalMessage("이력서 제목은 필수 입력사항입니다.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    const edu = resumeData.education[0];
    if (
      !edu.schoolType ||
      !edu.schoolName.trim() ||
      !edu.major.trim() ||
      !edu.admissionDate ||
      !edu.graduationDate
    ) {
      setModalMessage("학력 정보의 필수 입력사항을 모두 입력해주세요.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    const lang = resumeData.languageSkill[0];
    const langFields = [lang.languageName, lang.speakingLevel, lang.testName, lang.score, lang.acquisitionDate];
    if (langFields.some((field) => field) && langFields.some((field) => !field)) {
      setModalMessage("언어능력 정보의 필수 입력사항을 모두 입력해주세요.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    const cert = resumeData.certificate[0];
    const certFields = [cert.certificateName, cert.issuingOrganization, cert.acquisitionDate];
    if (certFields.some((field) => field) && certFields.some((field) => !field)) {
      setModalMessage("자격증 정보의 필수 입력사항을 모두 입력해주세요.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    const act = resumeData.activity[0];
    const actFields = [act.activityType, act.organizationName, act.startDate, act.endDate, act.description];
    if (actFields.some((field) => field) && actFields.some((field) => !field)) {
      setModalMessage("대외활동 정보의 필수 입력사항을 모두 입력해주세요.");
      setModalError(true);
      setIsModalOpen(true);
      return false;
    }
    const career = resumeData.career[0];
    const careerFields = [career.careerTitle, career.startDate, career.endDate];
    if (careerFields.some((field) => field) && careerFields.some((field) => !field)) {
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

  // 모달 닫기 (성공 시 페이지 이동)
  function handleClosePopup() {
    setIsModalOpen(false);
    if (!modalError) {
      navigate("/resume");
    }
  }

  // 프로필 이미지 파일 선택 시 자동 업데이트 (업로드 즉시 API 호출)
  async function handleProfileImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImageUrl(imageURL);
      // 파일 선택과 동시에 업데이트 API 호출
      const result = await updateProfileImage(file);
      if (result && result.success) {
        setModalMessage("프로필 이미지 업데이트 완료");
        setModalError(false);
      } else {
        setModalMessage("프로필 이미지 업데이트 실패");
        setModalError(true);
      }
      setIsModalOpen(true);
    }
  }

  // 이력서 등록 함수
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
      if (resumePhotoFile) {
        formData.append("resumePhoto", resumePhotoFile);
      }
      if (portfolioFile) {
        formData.append("portfolioFile", portfolioFile);
      }
      for (let pair of formData.entries()) {
        console.log(pair[0], ":", pair[1]);
      }
      const response = await createResume(formData);
      if (response) {
        setModalMessage("이력서 등록이 완료되었습니다");
        setModalError(false);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("error:", error);
      setModalMessage("이력서 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      setModalError(true);
      setIsModalOpen(true);
    }
  }

  return (
    <Main className="subWrap bg">
      <div className="mypageBox">
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
                  {profileData.name}님의 <br />이력서를 완성해주세요.
                </h4>

                {/* 프로필 이미지 업데이트 섹션 (파일 선택 즉시 업데이트) */}
                <div className={style.imgFileBox}>
                  {/* <h5>프로필 이미지 업데이트</h5> */}
                  <input
                    type="file"
                    accept="image/*"
                    className="blind"
                    id="profileImageInput"
                    onChange={handleProfileImageChange}
                  />
                  {!profileImageUrl ? (
                    <label htmlFor="profileImageInput" className={style.fileLabel}>
                      <img src={FileImg} alt="프로필 이미지 선택" />
                    </label>
                  ) : (
                    <img
                      src={profileImageUrl}
                      alt="선택된 프로필 이미지"
                      className={style.profileImg}
                    />
                  )}
                </div>

                {/* 이력서 사진 업로드 */}
                {/* <div className={style.imgFileBox}>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="blind"
                    id="resumePhotoInput"
                    onChange={handleResumePhotoChange}
                  />
                  {!resumeData.resumePhoto ? (
                    <label htmlFor="resumePhotoInput" className={style.fileLabel}>
                      <img src={FileImg} alt="이력서 사진 선택" />
                    </label>
                  ) : (
                    <img
                      src={resumeData.resumePhoto}
                      alt="선택된 이력서 사진"
                      className={style.profileImg}
                    />
                  )}
                </div> */}

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

                {/* 학력 섹션 */}
                <div className={style.resumeRegBox}>
                  <button
                    className={`${style.accordionBtn} ${accordions.education ? style.active : ""}`}
                    onClick={() => toggleAccordion("education")}
                  >
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
                          onChange={(e) =>
                            handleFieldChange(0, "schoolType", e.target.value, "education")
                          }
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
                        onChange={(e) =>
                          handleFieldChange(0, "schoolName", e.target.value, "education")
                        }
                      />
                      <ResumeField
                        label="전공명"
                        placeholder="전공명 입력"
                        value={resumeData.education[0].major}
                        onChange={(e) =>
                          handleFieldChange(0, "major", e.target.value, "education")
                        }
                      />
                      <div className={style.selectBox}>
                        <label>입학 연월</label>
                        <div className={style.layoutBox}>
                          <div className={style.box}>
                            <select
                              className={style.select}
                              value={resumeData.education[0].admissionDate.split("-")[0] || ""}
                              onChange={(e) => {
                                const month = resumeData.education[0].admissionDate.split("-")[1] || "01";
                                handleFieldChange(0, "admissionDate", `${e.target.value}-${month}`, "education");
                              }}
                            >
                              <option value="" disabled>년</option>
                              {generateYears().map((year) => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                            <span>년</span>
                          </div>
                          <div className={style.box}>
                            <select
                              className={style.select}
                              value={resumeData.education[0].admissionDate.split("-")[1] || ""}
                              onChange={(e) => {
                                const year = resumeData.education[0].admissionDate.split("-")[0] || "";
                                handleFieldChange(0, "admissionDate", `${year}-${e.target.value}`, "education");
                              }}
                            >
                              <option value="" disabled>월</option>
                              {generateMonths().map((month) => (
                                <option key={month} value={month < 10 ? `0${month}` : month}>
                                  {month < 10 ? `0${month}` : month}
                                </option>
                              ))}
                            </select>
                            <span>월</span>
                          </div>
                        </div>
                      </div>
                      <div className={style.selectBox}>
                        <label>졸업 연월</label>
                        <div className={style.layoutBox}>
                          <div className={style.box}>
                            <select
                              className={style.select}
                              value={resumeData.education[0].graduationDate.split("-")[0] || ""}
                              onChange={(e) => {
                                const month = resumeData.education[0].graduationDate.split("-")[1] || "01";
                                handleFieldChange(0, "graduationDate", `${e.target.value}-${month}`, "education");
                              }}
                            >
                              <option value="" disabled>년</option>
                              {generateYears().map((year) => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                            <span>년</span>
                          </div>
                          <div className={style.box}>
                            <select
                              className={style.select}
                              value={resumeData.education[0].graduationDate.split("-")[1] || ""}
                              onChange={(e) => {
                                const year = resumeData.education[0].graduationDate.split("-")[0] || "";
                                handleFieldChange(0, "graduationDate", `${year}-${e.target.value}`, "education");
                              }}
                            >
                              <option value="" disabled>월</option>
                              {generateMonths().map((month) => (
                                <option key={month} value={month < 10 ? `0${month}` : month}>
                                  {month < 10 ? `0${month}` : month}
                                </option>
                              ))}
                            </select>
                            <span>월</span>
                          </div>
                        </div>
                      </div>
                      <div className={style.selectBox}>
                        <label>학점</label>
                        <div className={style.layoutBox}>
                          <select
                            className={style.select}
                            value={resumeData.education[0].maxScore}
                            onChange={(e) =>
                              handleFieldChange(0, "maxScore", Number(e.target.value), "education")
                            }
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
                            onChange={(e) =>
                              handleFieldChange(0, "score", parseFloat(e.target.value), "education")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 언어능력 섹션 */}
                <div className={style.resumeRegBox}>
                  <button
                    className={`${style.accordionBtn} ${accordions.languageSkill ? style.active : ""}`}
                    onClick={() => toggleAccordion("languageSkill")}
                  >
                    <h5 className={style.title}>언어능력</h5>
                  </button>
                  {accordions.languageSkill && (
                    <div className={style.accordionBox}>
                      <div className={style.selectBox}>
                        <label>외국어명</label>
                        <select
                          className={style.select}
                          value={resumeData.languageSkill[0].languageName}
                          onChange={(e) =>
                            handleFieldChange(0, "languageName", e.target.value, "languageSkill")
                          }
                        >
                          <option value="" disabled>외국어명 선택</option>
                          <option value="영어">영어</option>
                          <option value="한국어">한국어</option>
                        </select>
                      </div>
                      <div className={style.selectBox}>
                        <label>회화능력</label>
                        <select
                          className={style.select}
                          value={resumeData.languageSkill[0].speakingLevel}
                          onChange={(e) =>
                            handleFieldChange(0, "speakingLevel", e.target.value, "languageSkill")
                          }
                        >
                          <option value="" disabled>회화능력 선택</option>
                          <option value="하">하</option>
                          <option value="중">중</option>
                          <option value="상">상</option>
                        </select>
                      </div>
                      <div className={style.selectBox}>
                        <label>시험명</label>
                        <select
                          className={style.select}
                          value={resumeData.languageSkill[0].testName}
                          onChange={(e) =>
                            handleFieldChange(0, "testName", e.target.value, "languageSkill")
                          }
                        >
                          <option value="" disabled>시험명 선택</option>
                          <option value="TOEIC">TOEIC</option>
                          <option value="TOEFL">TOEFL</option>
                          <option value="IELTS">IELTS</option>
                        </select>
                      </div>
                      <div className={style.selectBox}>
                        <ResumeField
                          label="점수/급수"
                          placeholder="점수 입력 (예: 850)"
                          value={resumeData.languageSkill[0].score}
                          onChange={(e) =>
                            handleFieldChange(0, "score", e.target.value, "languageSkill")
                          }
                        />
                      </div>
                      <ResumeField
                        label="취득 년월"
                        placeholder="취득 년월 (ex. 2023-01)"
                        value={resumeData.languageSkill[0].acquisitionDate}
                        onChange={(e) =>
                          handleFieldChange(0, "acquisitionDate", e.target.value, "languageSkill")
                        }
                      />
                    </div>
                  )}
                </div>

                {/* 자격증 섹션 */}
                <div className={style.resumeRegBox}>
                  <button
                    className={`${style.accordionBtn} ${accordions.certificate ? style.active : ""}`}
                    onClick={() => toggleAccordion("certificate")}
                  >
                    <h5 className={style.title}>자격증</h5>
                  </button>
                  {accordions.certificate && (
                    <div className={style.accordionBox}>
                      <ResumeField
                        label="자격증명"
                        placeholder="자격증명 입력"
                        value={resumeData.certificate[0].certificateName}
                        onChange={(e) =>
                          handleFieldChange(0, "certificateName", e.target.value, "certificate")
                        }
                      />
                      <ResumeField
                        label="발급 기관"
                        placeholder="발급 기관 입력"
                        value={resumeData.certificate[0].issuingOrganization}
                        onChange={(e) =>
                          handleFieldChange(0, "issuingOrganization", e.target.value, "certificate")
                        }
                      />
                      <ResumeField
                        label="취득일"
                        placeholder="취득일 (ex. 2023-06)"
                        value={resumeData.certificate[0].acquisitionDate}
                        onChange={(e) =>
                          handleFieldChange(0, "acquisitionDate", e.target.value, "certificate")
                        }
                      />
                    </div>
                  )}
                </div>

                {/* 대외활동 섹션 */}
                <div className={style.resumeRegBox}>
                  <button
                    className={`${style.accordionBtn} ${accordions.activity ? style.active : ""}`}
                    onClick={() => toggleAccordion("activity")}
                  >
                    <h5 className={style.title}>대외활동</h5>
                  </button>
                  {accordions.activity && (
                    <div className={style.accordionBox}>
                      <div className={style.selectBox}>
                        <label>활동 유형</label>
                        <select
                          className={style.select}
                          value={resumeData.activity[0].activityType}
                          onChange={(e) =>
                            handleFieldChange(0, "activityType", e.target.value, "activity")
                          }
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
                        value={resumeData.activity[0].organizationName}
                        onChange={(e) =>
                          handleFieldChange(0, "organizationName", e.target.value, "activity")
                        }
                      />
                      <div className={style.regBox}>
                        <label>활동 기간</label>
                        <div className={style.regDateBox}>
                          <ResumeField
                            placeholder="시작일 (YYYY-MM)"
                            value={resumeData.activity[0].startDate}
                            onChange={(e) =>
                              handleFieldChange(0, "startDate", e.target.value, "activity")
                            }
                          />
                          ~
                          <ResumeField
                            placeholder="종료일 (YYYY-MM)"
                            value={resumeData.activity[0].endDate}
                            onChange={(e) =>
                              handleFieldChange(0, "endDate", e.target.value, "activity")
                            }
                          />
                        </div>
                      </div>
                      <ResumeField
                        label="활동 내용"
                        placeholder="활동 내용 입력"
                        value={resumeData.activity[0].description}
                        onChange={(e) =>
                          handleFieldChange(0, "description", e.target.value, "activity")
                        }
                      />
                    </div>
                  )}
                </div>

                {/* 경력 섹션 */}
                <div className={style.resumeRegBox}>
                  <button
                    className={`${style.accordionBtn} ${accordions.career ? style.active : ""}`}
                    onClick={() => toggleAccordion("career")}
                  >
                    <h5 className={style.title}>경력</h5>
                  </button>
                  {accordions.career && (
                    <div className={style.accordionBox}>
                      <ResumeField
                        label="경력 타이틀"
                        placeholder="예: 주니어 개발자"
                        value={resumeData.career[0].careerTitle}
                        onChange={(e) =>
                          handleFieldChange(0, "careerTitle", e.target.value, "career")
                        }
                      />
                      <div className={style.regBox}>
                        <label>경력 기간</label>
                        <div className={style.regDateBox}>
                          <ResumeField
                            placeholder="시작일 (YYYY-MM)"
                            value={resumeData.career[0].startDate}
                            onChange={(e) =>
                              handleFieldChange(0, "startDate", e.target.value, "career")
                            }
                          />
                          ~
                          <ResumeField
                            placeholder="종료일 (YYYY-MM)"
                            value={resumeData.career[0].endDate}
                            onChange={(e) =>
                              handleFieldChange(0, "endDate", e.target.value, "career")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 포트폴리오 섹션 */}
                <div className={style.resumeRegBox}>
                  <button
                    className={`${style.accordionBtn} ${accordions.portfolio ? style.active : ""}`}
                    onClick={() => toggleAccordion("portfolio")}
                  >
                    <h5 className={style.title}>포트폴리오</h5>
                  </button>
                  {accordions.portfolio && (
                    <div className={style.accordionBox}>
                      <ResumeField
                        label="포트폴리오명"
                        placeholder="포트폴리오명 입력"
                        value={resumeData.portfolio[0].portfolioName}
                        onChange={(e) =>
                          handleFieldChange(0, "portfolioName", e.target.value, "portfolio")
                        }
                      />
                      <ResumeField
                        label="URL"
                        placeholder="URL 입력"
                        value={resumeData.portfolio[0].url}
                        onChange={(e) =>
                          handleFieldChange(0, "url", e.target.value, "portfolio")
                        }
                      />
                      <div className={style.resumeRegBox}>
                        <label>파일첨부</label>
                        <div className={style.fileWrap}>
                          <label
                            htmlFor="portfolioFileInput"
                            className={style.fileUploadLeft}
                            aria-label="파일선택"
                          >
                            <input
                              type="file"
                              id="portfolioFileInput"
                              accept="image/*,application/pdf"
                              onChange={handlePortfolioFileChange}
                              style={{ display: "none" }}
                            />
                          </label>
                          {resumeData.portfolio[0].filePath && (
                            <div className={style.fileUploadRight}>
                              <span className={style.fileName}>{resumeData.portfolio[0].filePath}</span>
                              <button onClick={handlePortfolioFileDelete} className={style.deleteBtn}>
                                <span className="blind">첨부파일삭제</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button text="작성완료" onClick={handleSubmit} />
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
