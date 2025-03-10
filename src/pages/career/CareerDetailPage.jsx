import ArrowPrevButton from "../../components/ArrowPrevButton";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import Career_Img01 from "../../assets/images/sub/Career_Img01.jpg";
import InstructorImg from "../../assets/images/sub/instructor_img.png";
import style from "./CareerDetailPage.module.css";
import Button from "../../components/Button";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCareerDetailCourses } from "../../api/career/career";
import Loading from "../../components/Loading";

export default function CareerDetailPage() {

  const { career_Id } = useParams();
  console.log(career_Id);
  const [courseData, setCourseData] = useState(null);
  const [benefitsData, setBenefitsData] = useState([]);
  const [lecturesData, setLecturesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 강의 상세 데이터 불러오기
  useEffect(() => {
    async function fetchCareerDetailCourses() {
      try {
        setLoading(true);
        const response = await getCareerDetailCourses(career_Id);
        if (response.result === "success") {
          setCourseData(response.course);
          setBenefitsData(response.benefits);
          setLecturesData(response.lectures);
        } else {
          setCourseData(null);
          setBenefitsData([]);
          setLecturesData([]);
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCareerDetailCourses();
  }, [career_Id]);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!courseData) {
    return <p>강의 정보를 불러올 수 없습니다.</p>;
  }

  //리스트 형태로 변환하는 함수
  function parseInstructorCareer(careerString) {
    if (!careerString) return [];

    const careerList = careerString.split("\n").map(line => line.trim()).filter(Boolean);
    const structuredCareers = [];
    let currentCareer = null;

    careerList.forEach((line) => {
      if (/(\d{4}~\d{4}|\d{4})/.test(line) || line.includes("현재:")) {
        // 새로운 직책 추가
        currentCareer = { title: line, details: [] };
        structuredCareers.push(currentCareer);
      } else if (currentCareer) {
        // 기존 직책(부모)의 상세 내용(자식) 추가
        currentCareer.details.push(line);
      }
    });

    return structuredCareers;
  }

  //데이터 변환
  const structuredCareers = parseInstructorCareer(courseData.instructor_career);

  return (
    <Main className="subWrap">
      <div className={`careerBox ${style.careerDetailBox}`}>
        <Container className="container">
          <div className="careerContent">
            <div className={style.careerDetailTop}>
              <div className={style.imgBox}>
                <img src={Career_Img01} alt="강의 대표 이미지" />
              </div>
              <p className={style.infoText}>
                {courseData.institute_name} | {courseData.job_category}
              </p>
              <h3>
                {courseData.title}
                <span>{courseData.category}</span>
              </h3>
              <span className={style.date}>
                {courseData.start_date} ~ {courseData.end_date}
              </span>
              <ArrowPrevButton
                customClass={style.arrowPrevBtn}
                href="/career"
                hiddenText="커리어교육 화면으로 이동"
              />
            </div>

            <div className={style.layoutBox}>
              <div className={style.careerDetailContent}>
                {/* 과정 소개 */}
                <div className={`${style.box} ${style.procedureBox}`}>
                  <h4>과정소개</h4>
                  <p className={style.procedureDes}>{courseData.description}</p>

                  <h5>강의가 제공하는 <strong>주요 혜택</strong></h5>
                  <ul className={style.procedureList}>
                    {benefitsData.map((data, index) => (
                      <li key={index}>{data.benefit_text}</li>
                    ))}
                  </ul>
                </div>

                {/* 강사 소개 */}
                <div className={`${style.box} ${style.instructorBox}`}>
                  <h4>강사소개</h4>
                  <div className={style.instructorDetailbox}>
                    <div className={style.top}>
                      <div className={style.textBox}>
                        <h5>{courseData.instructor_name} 강사</h5>
                        <ul className={style.historyList}>
                          {courseData.instructor_education.split("\n").map((data, index) => (
                            <li key={index}>{data}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={style.imgBox}>
                        <img src={InstructorImg} alt="강사 이미지" />
                      </div>
                    </div>

                    {/* 강사 경력 목록 */}
                    <ul className={style.historyDetailList01}>
                      {structuredCareers.map((data, index) => (
                        <li key={index}>
                          <strong>{data.title}</strong>
                          {data.details.length > 0 && (
                            <ul className={style.historyDetailList02}>
                              {data.details.map((detail, detailIndex) => (
                                <li key={detailIndex}>{detail}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 커리큘럼 */}
                <div className={`${style.box} ${style.curriculumBox}`}>
                  <h4>커리큘럼</h4>
                  <ul className={style.curriculumList}>
                    {lecturesData.map((data, index) => (
                      <li key={index}>
                        <span>{index + 1}강</span>
                        <h5>{data.title}</h5>
                        <em className={style.time}>{data.duration}</em>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={style.linkBox}>
                <a
                  target="_blank"
                  title="새 창 이동"
                  rel="noopener noreferrer"
                  aria-label="강의바로가기 (새 창 열림)"
                  href={courseData.external_course_url}
                  className={style.link}>
                  강의바로가기
                </a>
                <Link
                  to="#"
                  className={style.aiInfoBox}
                >
                  <p>
                    이력서를 작성하면 <br />
                    AI가 <strong>채용공고를 추천</strong>해줘요!
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
