import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Main from "../../components/layout/Main";
import Container from "../../components/Container";
import Card from "../../components/Card";
import BgCard from "../../components/BgCard";
import style from "./SearchPage.module.css";
import "../../styles/style.css";
import Guide02 from "../../assets/images/main/Guide_Icon02.svg";
import Guide03 from "../../assets/images/main/Guide_Icon03.svg";
import Guide04 from "../../assets/images/main/Guide_Icon04.svg";
import { getEmploymentList } from "../../api/employment/employment";
import { getCareerCourses, getJopList } from "../../api/career/career";

export default function SearchPage() {
  const defaultImage = "/assets/images/main/Card_Img01.png";

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [employmentData, setEmploymentData] = useState([]);
  const [jobList, setJobList] = useState([]);

  // 기본으로 사용할 가이드 이미지 및 색상 배열
  const defaultGuideImages = [Guide02, Guide03, Guide04];
  const defaultBgColors = ["#EDC2F6", "#CCE7FE", "#FFD3EB", "#FFEEA6"];
  const defaultImgBgColors = ["#C6FFD0", "#F6F0B3", "#CCE7FE", "#5E5C5C"];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query"); // 쿼리 파라미터에서 검색어 가져오기
    if (query) {
      setSearchQuery(query);
      fetchEmploymentData(query);
      fetchCourses(query);
      fetchJobList(query);
    }
  }, [location.search]);

  // 채용 공고 데이터 가져오기
  const fetchEmploymentData = async (query) => {
    try {
      const result = await getEmploymentList(1, 6, query); // 검색어 전달
      if (result?.result === "success" && result.employs) {
        setEmploymentData(result.employs);
      } else {
        setEmploymentData([]);
      }
    } catch (error) {
      console.error("채용공고 목록 불러오기 에러:", error);
    }
  };

  // 커리어 강의 데이터 가져오기
  const fetchCourses = async (query) => {
    try {
      const response = await getCareerCourses({
        page: 0,
        size: 10,
        category: "오프라인",
        keyword: query,
        jobCategory: "",
      });
      if (response.result === "success") {
        setCourses(response.courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("커리어 강의 불러오기 에러:", error);
    }
  };

  // 직무 데이터 가져오기
  const fetchJobList = async (query) => {
    try {
      const data = await getJopList();
      if (data && data.careers) {
        // 검색어가 있을 경우 필터링
        const filtered = data.careers.filter((job) =>
          job.name.toLowerCase().includes(query.toLowerCase())
        );
        setJobList(filtered);
      } else {
        setJobList([]);
      }
    } catch (error) {
      console.error("직무 목록 불러오기 에러:", error);
    }
  };

  return (
    <Main className="subWrap">
      <div className={style.searchBox}>
        <Container>
          <div className={style.searchContent}>
            <div className={style.searchTop}>
              <h3>검색결과</h3>
              <p>
                <strong>"{searchQuery}"</strong>에 대한 검색결과입니다.
              </p>
            </div>

            {/* 채용 공고 결과 */}
            <div className={style.searchResultBox}>
              <em className={style.searchResultText}>
                채용 <span>{employmentData.length}</span>
              </em>
              <div className={`cardContainer ${style.searchResultList}`}>
                {employmentData.length > 0 ? (
                  employmentData.map((job) => (
                    <Card
                      key={job.id}
                      href={`/employment-detail/${job.id}`}
                      className="cardType"
                      text={job.company_name || "회사명 미등록"}
                      imgSrc={defaultImage}
                      title={job.title || "공고 제목 미등록"}
                      date={`마감일: ${job.deadline || "미정"}`}
                    />
                  ))
                ) : (
                  <p className="infoText">검색 결과가 없습니다.</p>
                )}
              </div>
            </div>

            {/* 커리어 과정 결과 */}
            <div className={style.searchResultBox}>
              <em className={style.searchResultText}>
                커리어 <span>{courses.length}</span>
              </em>
              <div className={`cardContainer ${style.searchResultList}`}>
                {courses.length > 0 ? (
                  courses.map((course, index) => (
                    <Card
                      href={`/career-detail/${course.id}`}
                      key={index}
                      text={course.job_category}
                      title={course.title}
                      imgSrc={defaultImage}
                      subText={course.institute_name}
                    />
                  ))
                ) : (
                  <p className="infoText">검색 결과가 없습니다.</p>
                )}
              </div>
            </div>

            {/* 직무 결과 */}
            <div className={style.searchResultBox}>
              <em className={style.searchResultText}>
                직무 <span>{jobList.length}</span>
              </em>
              <div
                className={`cardContainer cardContainerSt ${style.searchResultList}`}
              >
                {jobList.length > 0 ? (
                  jobList.map((job, index) => (
                    <BgCard
                      key={job.id}
                      bg={{
                        backgroundColor:
                          job.bgColor ||
                          defaultBgColors[index % defaultBgColors.length],
                      }}
                      imgBg={{
                        backgroundColor:
                          job.imgBgColor ||
                          defaultImgBgColors[index % defaultImgBgColors.length],
                      }}
                      imgSrc={
                        job.imgSrc ||
                        defaultGuideImages[index % defaultGuideImages.length]
                      }
                      title={job.name}
                    />
                  ))
                ) : (
                  <p className="infoText">검색 결과가 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
