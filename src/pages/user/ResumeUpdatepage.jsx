import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import style from "./ResumeRegpage.module.css"; // 등록 페이지 스타일 재활용
import Button from "../../components/Button";
import Input from "../../components/Input";
import FileImg from "../../assets/images/sub/file_img.svg";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import Loading from "../../components/Loading";
import { updateResume, getResumeDetail } from "../../api/user/resume/resume";
import CompletePopup from "../../components/CompletePopup";

// 단일 필드 컴포넌트 (등록 페이지와 동일)
const ResumeField = ({
  label,
  value,
  onChange,
  placeholder,
  readOnly,
  type = "text",
  step,
}) => (
  <div className={`${style.inputBox} ${value ? "" : style.error}`}>
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

export default function ResumeUpdatePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL 예: /resumeupdate/:id
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB 제한

  // 기존 이력서 데이터 상태 (모든 섹션 포함)
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
        description: "",
      },
    ],
    portfolio: [
      {
        portfolioName: "",
        url: "",
        filePath: "",
        description: "",
      },
    ],
  });

  // 파일 상태 관리
  const [resumePhotoFile, setResumePhotoFile] = useState(null);
  const [portfolioFile, setPortfolioFile] = useState(null);

  // 로딩 및 팝업 상태 관리
  const [loading, setLoading] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [completeMessage, setCompleteMessage] = useState("");
  const [completeError, setCompleteError] = useState(false);

  // 팝업 닫기 (확인 버튼)
  function handleCloseCompletePopup() {
    setIsCompleteOpen(false);
    if (!completeError) {
      navigate("/resume");
    }
  }

  // 특정 필드 변경 핸들러 (그룹 내 객체 지원)
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

  // 파일 선택 처리 (이력서 사진)
  function handleResumePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert("이력서 사진 파일이 너무 큽니다. (5MB 이하)");
      return;
    }
    setResumePhotoFile(file);
    const imageURL = URL.createObjectURL(file);
    setResumeData((prev) => ({ ...prev, resumePhoto: imageURL }));
  }

  // 파일 선택 처리 (포트폴리오)
  function handlePortfolioFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert("포트폴리오 파일이 너무 큽니다. (5MB 이하)");
      return;
    }
    setPortfolioFile(file);
    setResumeData((prev) => {
      const updatedPortfolio = [...prev.portfolio];
      updatedPortfolio[0] = { ...updatedPortfolio[0], filePath: file.name };
      return { ...prev, portfolio: updatedPortfolio };
    });
  }

  // 포트폴리오 파일 삭제 처리
  function handlePortfolioFileDelete() {
    setPortfolioFile(null);
    setResumeData((prev) => {
      const updatedPortfolio = [...prev.portfolio];
      updatedPortfolio[0] = { ...updatedPortfolio[0], filePath: "" };
      return { ...prev, portfolio: updatedPortfolio };
    });
    document.getElementById("portfolioFileInput").value = "";
  }

  // 컴포넌트 마운트 시 기존 이력서 데이터 불러오기
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const detail = await getResumeDetail(id);
        if (detail) {
          setResumeData({
            resumeTitle: detail.resume_title || "",
            resumePhoto: detail.resume_photo || "",
            isDefault: detail.is_default || false,
            education: detail.education || [],
            languageSkill: detail.language_skill || [],
            certificate: detail.certificate || [],
            activity: detail.activity || [],
            career: detail.career || [],
            portfolio: detail.portfolio || [],
          });
        }
      } catch (error) {
        console.error("ResumeUpdatePage fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <Loading fullScreen />;
  }

  // 수정 API 호출 처리
  async function handleSubmit() {
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
      const result = await updateResume(id, formData);
      if (result) {
        setCompleteMessage("이력서가 성공적으로 수정되었습니다.");
        setCompleteError(false);
        setIsCompleteOpen(true);
      } else {
        setCompleteMessage("이력서 수정에 실패했습니다. 다시 시도해주세요.");
        setCompleteError(true);
        setIsCompleteOpen(true);
      }
    } catch (error) {
      console.error("이력서 수정 오류:", error);
      setCompleteMessage("이력서 수정 중 오류가 발생했습니다.");
      setCompleteError(true);
      setIsCompleteOpen(true);
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
                <Link to="/resume"><span>이력서관리</span></Link>
                <Link to="/apply"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>
              <div className={`content ${style.content} flexColumn`}>
                <h4 className={`title ${style.userGreeting}`}>이력서 수정</h4>

                {/* 이력서 사진 업로드 */}
                <div className={style.imgFileBox}>
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
                </div>

                {/* 이력서 제목 */}
                <ResumeField
                  label="이력서 제목"
                  placeholder="나를 대표할 한 줄 제목"
                  value={resumeData.resumeTitle}
                  onChange={(e) =>
                    handleFieldChange(null, "resumeTitle", e.target.value)
                  }
                />

                {/* 인적사항 (프로필 정보) */}
                <h5 className={style.title}>인적사항</h5>
                <ResumeField label="이름" readOnly={true} value={profileData.name} />
                <ResumeField label="휴대폰번호" readOnly={true} value={profileData.phone} />
                <ResumeField label="이메일" readOnly={true} value={profileData.email} />
                <ResumeField label="생년월일" readOnly={true} value={profileData.birth_date} />

                {/* 학력 섹션 */}
                <div className={style.resumeRegBox}>
                  <button className={style.accordionBtn}>
                    <h5 className={style.title}>학력</h5>
                  </button>
                  <div className={style.selectBox}>
                    <label htmlFor="SchoolClassification">학교구분</label>
                    <select
                      id="SchoolClassification"
                      className={style.select}
                      value={resumeData.education[0]?.schoolType || ""}
                      onChange={(e) =>
                        handleFieldChange(0, "schoolType", e.target.value, "education")
                      }
                    >
                      <option value="" disabled>
                        학교 구분 선택
                      </option>
                      <option value="대학교">대학교</option>
                      <option value="고등학교">고등학교</option>
                    </select>
                  </div>
                  <ResumeField
                    label="학교명"
                    placeholder="학교명 입력"
                    value={resumeData.education[0]?.schoolName || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "schoolName", e.target.value, "education")
                    }
                  />
                  <ResumeField
                    label="전공명"
                    placeholder="전공명 입력"
                    value={resumeData.education[0]?.major || ""}
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
                          value={resumeData.education[0]?.admissionDate.split("-")[0] || ""}
                          onChange={(e) => {
                            const month = resumeData.education[0]?.admissionDate.split("-")[1] || "01";
                            handleFieldChange(
                              0,
                              "admissionDate",
                              `${e.target.value}-${month}`,
                              "education"
                            );
                          }}
                        >
                          <option value="" disabled>
                            년
                          </option>
                          {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) =>
                            <option key={new Date().getFullYear() - i} value={new Date().getFullYear() - i}>
                              {new Date().getFullYear() - i}
                            </option>
                          )}
                        </select>
                        <span>년</span>
                      </div>
                      <div className={style.box}>
                        <select
                          className={style.select}
                          value={resumeData.education[0]?.admissionDate.split("-")[1] || ""}
                          onChange={(e) => {
                            const year = resumeData.education[0]?.admissionDate.split("-")[0] || "";
                            handleFieldChange(
                              0,
                              "admissionDate",
                              `${year}-${e.target.value}`,
                              "education"
                            );
                          }}
                        >
                          <option value="" disabled>
                            월
                          </option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = i + 1;
                            const formatted = month < 10 ? `0${month}` : month;
                            return (
                              <option key={formatted} value={formatted}>
                                {formatted}
                              </option>
                            );
                          })}
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
                          value={resumeData.education[0]?.graduationDate.split("-")[0] || ""}
                          onChange={(e) => {
                            const month = resumeData.education[0]?.graduationDate.split("-")[1] || "01";
                            handleFieldChange(
                              0,
                              "graduationDate",
                              `${e.target.value}-${month}`,
                              "education"
                            );
                          }}
                        >
                          <option value="" disabled>
                            년
                          </option>
                          {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) =>
                            <option key={new Date().getFullYear() - i} value={new Date().getFullYear() - i}>
                              {new Date().getFullYear() - i}
                            </option>
                          )}
                        </select>
                        <span>년</span>
                      </div>
                      <div className={style.box}>
                        <select
                          className={style.select}
                          value={resumeData.education[0]?.graduationDate.split("-")[1] || ""}
                          onChange={(e) => {
                            const year = resumeData.education[0]?.graduationDate.split("-")[0] || "";
                            handleFieldChange(
                              0,
                              "graduationDate",
                              `${year}-${e.target.value}`,
                              "education"
                            );
                          }}
                        >
                          <option value="" disabled>
                            월
                          </option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = i + 1;
                            const formatted = month < 10 ? `0${month}` : month;
                            return (
                              <option key={formatted} value={formatted}>
                                {formatted}
                              </option>
                            );
                          })}
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
                        value={resumeData.education[0]?.maxScore || ""}
                        onChange={(e) =>
                          handleFieldChange(0, "maxScore", Number(e.target.value), "education")
                        }
                      >
                        <option value="" disabled>
                          만점 선택
                        </option>
                        {Array.from({ length: 46 }, (_, i) => {
                          const score = (i * 0.1).toFixed(1);
                          return (
                            <option key={score} value={score}>
                              {score}
                            </option>
                          );
                        })}
                      </select>
                      <ResumeField
                        placeholder="내 학점 (예: 4.0)"
                        value={resumeData.education[0]?.score || ""}
                        type="number"
                        step="0.1"
                        onChange={(e) =>
                          handleFieldChange(0, "score", parseFloat(e.target.value), "education")
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 언어능력 섹션 */}
                <div className={style.resumeRegBox}>
                  <button className={style.accordionBtn}>
                    <h5 className={style.title}>언어 능력</h5>
                  </button>
                  <div className={style.selectBox}>
                    <label>외국어명</label>
                    <select
                      className={style.select}
                      value={resumeData.languageSkill[0]?.languageName || ""}
                      onChange={(e) =>
                        handleFieldChange(0, "languageName", e.target.value, "languageSkill")
                      }
                    >
                      <option value="" disabled>
                        외국어명 선택
                      </option>
                      <option value="영어">영어</option>
                      <option value="일본어">일본어</option>
                      <option value="중국어">중국어</option>
                    </select>
                  </div>
                  <div className={style.selectBox}>
                    <label>회화능력</label>
                    <select
                      className={style.select}
                      value={resumeData.languageSkill[0]?.speakingLevel || ""}
                      onChange={(e) =>
                        handleFieldChange(0, "speakingLevel", e.target.value, "languageSkill")
                      }
                    >
                      <option value="" disabled>
                        회화능력 선택
                      </option>
                      <option value="하">하</option>
                      <option value="중">중</option>
                      <option value="상">상</option>
                    </select>
                  </div>
                  <div className={style.selectBox}>
                    <label>시험명</label>
                    <select
                      className={style.select}
                      value={resumeData.languageSkill[0]?.testName || ""}
                      onChange={(e) =>
                        handleFieldChange(0, "testName", e.target.value, "languageSkill")
                      }
                    >
                      <option value="" disabled>
                        시험명 선택
                      </option>
                      <option value="TOEIC">TOEIC</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="IELTS">IELTS</option>
                    </select>
                  </div>
                  <div className={style.selectBox}>
                    <ResumeField
                      label="점수/급수"
                      placeholder="예: 850 또는 Level 6"
                      value={resumeData.languageSkill[0]?.score || ""}
                      onChange={(e) =>
                        handleFieldChange(0, "score", e.target.value, "languageSkill")
                      }
                    />
                  </div>
                  <ResumeField
                    label="취득 연월 (YYYY-MM)"
                    placeholder="예: 2023-01"
                    value={resumeData.languageSkill[0]?.acquisitionDate || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "acquisitionDate", e.target.value, "languageSkill")
                    }
                  />
                </div>

                {/* 자격증 섹션 */}
                <div className={style.resumeRegBox}>
                  <button className={style.accordionBtn}>
                    <h5 className={style.title}>자격증</h5>
                  </button>
                  <ResumeField
                    label="자격증명"
                    placeholder="자격증명 입력"
                    value={resumeData.certificate[0]?.certificateName || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "certificateName", e.target.value, "certificate")
                    }
                  />
                  <ResumeField
                    label="발급 기관"
                    placeholder="발급 기관 입력"
                    value={resumeData.certificate[0]?.issuingOrganization || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "issuingOrganization", e.target.value, "certificate")
                    }
                  />
                  <ResumeField
                    label="취득 연월 (YYYY-MM)"
                    placeholder="예: 2023-06"
                    value={resumeData.certificate[0]?.acquisitionDate || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "acquisitionDate", e.target.value, "certificate")
                    }
                  />
                </div>

                {/* 대외활동 섹션 */}
                <div className={style.resumeRegBox}>
                  <button className={style.accordionBtn}>
                    <h5 className={style.title}>대외활동</h5>
                  </button>
                  <div className={style.selectBox}>
                    <label>활동 유형</label>
                    <select
                      className={style.select}
                      value={resumeData.activity[0]?.activityType || ""}
                      onChange={(e) =>
                        handleFieldChange(0, "activityType", e.target.value, "activity")
                      }
                    >
                      <option value="" disabled>
                        활동 유형 선택
                      </option>
                      <option value="인턴">인턴</option>
                      <option value="봉사활동">봉사활동</option>
                      <option value="공모전">공모전</option>
                    </select>
                  </div>
                  <ResumeField
                    label="기관명"
                    placeholder="기관명 입력"
                    value={resumeData.activity[0]?.organizationName || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "organizationName", e.target.value, "activity")
                    }
                  />
                  <div className={style.regBox}>
                    <label>활동 기간</label>
                    <div className={style.regDateBox}>
                      <ResumeField
                        placeholder="시작일 (YYYY-MM)"
                        value={resumeData.activity[0]?.startDate || ""}
                        onChange={(e) =>
                          handleFieldChange(0, "startDate", e.target.value, "activity")
                        }
                      />
                      ~
                      <ResumeField
                        placeholder="종료일 (YYYY-MM 또는 재직중)"
                        value={resumeData.activity[0]?.endDate || ""}
                        onChange={(e) =>
                          handleFieldChange(0, "endDate", e.target.value, "activity")
                        }
                      />
                    </div>
                  </div>
                  <ResumeField
                    label="활동 내용"
                    placeholder="활동 내용 입력"
                    value={resumeData.activity[0]?.description || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "description", e.target.value, "activity")
                    }
                  />
                </div>

                {/* 경력 섹션 */}
                <div className={style.resumeRegBox}>
                  <button className={style.accordionBtn}>
                    <h5 className={style.title}>경력</h5>
                  </button>
                  <ResumeField
                    label="경력 타이틀"
                    placeholder="예: 주니어 개발자"
                    value={resumeData.career[0]?.careerTitle || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "careerTitle", e.target.value, "career")
                    }
                  />
                  <div className={style.regBox}>
                    <label>경력 기간</label>
                    <div className={style.regDateBox}>
                      <ResumeField
                        placeholder="시작일 (YYYY-MM)"
                        value={resumeData.career[0]?.startDate || ""}
                        onChange={(e) =>
                          handleFieldChange(0, "startDate", e.target.value, "career")
                        }
                      />
                      ~
                      <ResumeField
                        placeholder="종료일 (YYYY-MM 또는 재직중)"
                        value={resumeData.career[0]?.endDate || ""}
                        onChange={(e) =>
                          handleFieldChange(0, "endDate", e.target.value, "career")
                        }
                      />
                    </div>
                  </div>
                  <ResumeField
                    label="경력 상세 내용"
                    placeholder="프로젝트 경험, 역할 등 상세 설명"
                    value={resumeData.career[0]?.description || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "description", e.target.value, "career")
                    }
                  />
                </div>

                {/* 포트폴리오 섹션 */}
                <div className={style.resumeRegBox}>
                  <button className={style.accordionBtn}>
                    <h5 className={style.title}>포트폴리오</h5>
                  </button>
                  <ResumeField
                    label="포트폴리오명"
                    placeholder="포트폴리오명 입력"
                    value={resumeData.portfolio[0]?.portfolioName || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "portfolioName", e.target.value, "portfolio")
                    }
                  />
                  <ResumeField
                    label="URL"
                    placeholder="URL 입력"
                    value={resumeData.portfolio[0]?.url || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "url", e.target.value, "portfolio")
                    }
                  />
                  <ResumeField
                    label="포트폴리오 설명"
                    placeholder="포트폴리오 상세 설명 입력"
                    value={resumeData.portfolio[0]?.description || ""}
                    onChange={(e) =>
                      handleFieldChange(0, "description", e.target.value, "portfolio")
                    }
                  />
                  <div className={style.resumeRegBox}>
                    <label>파일첨부</label>
                    <div className={style.fileWrap}>
                      <label
                        htmlFor="portfolioFileInput"
                        className={style.fileUploadLeft}
                        aria-label="파일 선택"
                      >
                        <input
                          type="file"
                          id="portfolioFileInput"
                          accept="image/*,application/pdf"
                          onChange={handlePortfolioFileChange}
                          style={{ display: "none" }}
                        />
                        파일 선택
                      </label>
                      {resumeData.portfolio[0]?.filePath && (
                        <div className={style.fileUploadRight}>
                          <span className={style.fileName}>
                            {resumeData.portfolio[0].filePath}
                          </span>
                          <button
                            onClick={handlePortfolioFileDelete}
                            className={style.deleteBtn}
                          >
                            첨부파일 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button text="수정완료" onClick={handleSubmit} />
                <ArrowPrevButton
                  customClass={style.arrowPrevBtn}
                  href="/resume"
                  hiddenText="이력서 목록으로 돌아가기"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <CompletePopup
        isOpen={isCompleteOpen}
        message={completeMessage}
        error={completeError}
        onClose={handleCloseCompletePopup}
      />
    </Main>
  );
}
