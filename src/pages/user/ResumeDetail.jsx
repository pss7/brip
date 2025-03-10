import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import style from "./ResumeRegpage.module.css"; // 등록 페이지 스타일 재사용
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import ArrowPrevButton from "../../components/ArrowPrevButton";
import { getResumeDetail } from "../../api/user/resume/resume";
import FileImg from "../../assets/images/sub/file_img.svg";

// 읽기 전용 필드 컴포넌트
const ResumeField = ({ label, value }) => (
  <div className={style.inputBox}>
    {label && <label>{label}</label>}
    <div className={style.readOnlyField}>{value || "미등록"}</div>
  </div>
);

export default function ResumeDetail() {
  const { resume_Id } = useParams();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    async function fetchResumeDetail() {
      try {
        setLoading(true);
        const response = await getResumeDetail(resume_Id);
        console.log("API 응답 데이터:", response);
        if (response) {
          setResumeData(response);
          setProfileImage(response.resume_photo || "");
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
    fetchResumeDetail();
  }, [resume_Id, navigate]);

  if (loading) return <Loading fullScreen />;
  if (!resumeData) return <p>이력서 정보를 불러올 수 없습니다.</p>;

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
                {/* 이력서 제목 */}
                <h4 className={style.userGreeting}>{resumeData.resume_title}</h4>

                {/* 프로필 이미지 */}
                <div className={style.imgFileBox}>
                  {profileImage ? (
                    <img src={profileImage} alt="프로필 이미지" className={style.profileImg} />
                  ) : (
                    <img src={FileImg} alt="기본 프로필 이미지" className={style.profileImg} />
                  )}
                </div>

                {/* 인적사항 */}
                <h5 className={style.title}>인적사항</h5>
                <ResumeField label="이름" value={resumeData.name} />
                <ResumeField label="이메일" value={resumeData.email} />
                <ResumeField label="휴대폰번호" value={resumeData.phone} />
                <ResumeField label="생년월일" value={resumeData.birth_date} />

                {/* 학력 */}
                {resumeData.education?.length > 0 && (
                  <div className={style.resumeRegBox}>
                    <h5 className={style.title}>학력</h5>
                    <div className={style.accordionBox}>
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className={style.dataItem}>
                          <ResumeField label="학교명" value={edu.school_name} />
                          <ResumeField label="전공" value={edu.major} />
                          <ResumeField label="입학 연월" value={edu.admission_date} />
                          <ResumeField label="졸업 연월" value={edu.graduation_date} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 언어 능력 */}
                {resumeData.languageSkill?.length > 0 && (
                  <div className={style.resumeRegBox}>
                    <h5 className={style.title}>언어 능력</h5>
                    <div className={style.accordionBox}>
                      {resumeData.languageSkill.map((lang, index) => (
                        <div key={index} className={style.dataItem}>
                          <ResumeField label="언어명" value={lang.language_name} />
                          <ResumeField label="회화능력" value={lang.speaking_level} />
                          <ResumeField label="시험명" value={lang.test_name} />
                          <ResumeField label="점수" value={lang.score} />
                          <ResumeField label="취득 연월" value={lang.acquisition_date} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 자격증 */}
                {resumeData.certificate?.length > 0 && (
                  <div className={style.resumeRegBox}>
                    <h5 className={style.title}>자격증</h5>
                    <div className={style.accordionBox}>
                      {resumeData.certificate.map((cert, index) => (
                        <div key={index} className={style.dataItem}>
                          <ResumeField label="자격증명" value={cert.certificate_name} />
                          <ResumeField label="발급기관" value={cert.issuing_organization} />
                          <ResumeField label="취득 연월" value={cert.acquisition_date} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 대외활동 */}
                {resumeData.activity?.length > 0 && (
                  <div className={style.resumeRegBox}>
                    <h5 className={style.title}>대외활동</h5>
                    <div className={style.accordionBox}>
                      {resumeData.activity.map((act, index) => (
                        <div key={index} className={style.dataItem}>
                          <ResumeField label="활동명" value={act.organization_name} />
                          <ResumeField label="활동 기간" value={`${act.start_date} ~ ${act.end_date}`} />
                          <ResumeField label="활동 내용" value={act.description} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 경력 */}
                {resumeData.career?.length > 0 && (
                  <div className={style.resumeRegBox}>
                    <h5 className={style.title}>경력</h5>
                    <div className={style.accordionBox}>
                      {resumeData.career.map((career, index) => (
                        <div key={index} className={style.dataItem}>
                          <ResumeField label="경력 타이틀" value={career.career_title} />
                          <ResumeField label="기간" value={`${career.start_date} ~ ${career.end_date}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 포트폴리오 */}
                {resumeData.portfolio?.length > 0 && (
                  <div className={style.resumeRegBox}>
                    <h5 className={style.title}>포트폴리오</h5>
                    <div className={style.accordionBox}>
                      {resumeData.portfolio.map((port, index) => (
                        <div key={index} className={style.dataItem}>
                          <ResumeField label="포트폴리오명" value={port.portfolio_name} />
                          <ResumeField
                            label="URL"
                            value={
                              port.url ? (
                                <a href={port.url} target="_blank" rel="noopener noreferrer">
                                  {port.url}
                                </a>
                              ) : (
                                "미등록"
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button href="/resume" text="목록으로" />
                <ArrowPrevButton customClass={style.arrowPrevBtn} href="/resume" hiddenText="이력서 목록으로 이동" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
