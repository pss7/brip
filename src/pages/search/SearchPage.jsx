import Card from "../../components/Card";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import style from "./SearchPage.module.css";
import "../../styles/style.css";
import Guide02 from "../../assets/images/main/Guide_Icon02.svg";
import Guide03 from "../../assets/images/main/Guide_Icon03.svg";
import Guide04 from "../../assets/images/main/Guide_Icon04.svg";
import BgCard from "../../components/BgCard";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getEmploymentList } from "../../api/employment/employment";
import { getCareerCourses } from "../../api/career/career";

export default function SearchPage() {
  const defaultImage = "/assets/images/main/Card_Img01.png";

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [employmentData, setEmploymentData] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query'); // 쿼리 파라미터에서 검색어 가져오기
    if (query) {
      setSearchQuery(query);
      fetchEmploymentData(query);
      fetchCourses(query);
    }
  }, [location.search]);

  // ✅ 채용 공고 데이터 가져오기
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

  // ✅ 커리어 강의 데이터 가져오기
  const fetchCourses = async (query) => {
    try {
      const response = await getCareerCourses({
        page: 0,
        size: 10,
        category: "오프라인",
        keyword: query,
        jobCategory: ""
      });

      if (response.result === "success") {
        setCourses(response.courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("error", error);
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

            {/* 직무 결과 (고정 데이터 유지) */}
            <div className={style.searchResultBox}>
              <em className={style.searchResultText}>
                직무 <span>4</span>
              </em>
              <div className={`cardContainer cardContainerSt ${style.searchResultList}`}>
                <BgCard
                  bg={{ backgroundColor: '#FFD3EB' }}
                  imgBg={{ backgroundColor: '#CCE7FE' }}
                  imgSrc={Guide03}
                  title="해상 여객운송 관리자"
                />
                <BgCard
                  bg={{ backgroundColor: '#CCE7FE' }}
                  imgBg={{ backgroundColor: '#F6F0B3' }}
                  imgSrc={Guide02}
                  title="해상 여객운송 관리자"
                />
                <BgCard
                  bg={{ backgroundColor: '#FFD3EB' }}
                  imgBg={{ backgroundColor: '#CCE7FE' }}
                  imgSrc={Guide03}
                  title="해상 여객운송 관리자"
                />
                <BgCard
                  bg={{ backgroundColor: '#FFEEA6' }}
                  imgBg={{ backgroundColor: '#5E5C5C' }}
                  imgSrc={Guide04}
                  title="해상 여객운송 관리자"
                />
              </div>
            </div>

          </div>
        </Container>
      </div>
    </Main>
  );
}
