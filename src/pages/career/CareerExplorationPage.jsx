import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Main from "../../components/layout/Main";
import Container from "../../components/Container";
import Pagination from "../../components/Pagination";
import SubSearch from "../../components/SubSearch";
import style from "./CareerExplorationPage.module.css";
import { getJopList } from "../../api/career/career";

export default function CareerExplorationPage() {

  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("조선사업");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [sortOption, setSortOption] = useState("가나다순");
  const [jobsPerPage, setJobsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalJobs, setTotalJobs] = useState(0);
  const [industries, setIndustries] = useState([]);
  const [industryJobs, setIndustryJobs] = useState({});

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await getJopList();
        if (response && response.result === "success") {
          setJobs(response.careers);
          setTotalJobs(response.totalCount);

          const industryList = [...new Set(response.careers.map(job => job.industry).filter(Boolean))];
          setIndustries(industryList);
          if (industryList.length > 0) setActiveTab(industryList[0]);

          const jobMap = {};
          response.careers.forEach(job => {
            if (!job.industry) return;
            if (!jobMap[job.industry]) jobMap[job.industry] = new Map();
            if (!jobMap[job.industry].has(job.name)) {
              jobMap[job.industry].set(job.name, { id: job.id, name: job.name });
            }
          });

          const formattedJobMap = {};
          for (const industry in jobMap) {
            formattedJobMap[industry] = Array.from(jobMap[industry].values());
          }

          setIndustryJobs(formattedJobMap);
        }
      } catch (error) {
        console.error("직무 목록을 불러오는 중 오류 발생", error);
      }
    }
    fetchJobs();
  }, []);

  const handleTabClick = (tab) => setActiveTab(tab);
  const handleResetSelection = () => {
    setSelectedJobs([]);
    setSearchKeyword("");
    setActiveTab(industries.length > 0 ? industries[0] : "");
    setSortOption("가나다순");
    setJobsPerPage(10);
    setCurrentPage(1);
  };

  const filteredJobs = jobs
    .filter((job) => job.industry === activeTab)
    .filter((job) => searchKeyword === "" || job.name.toLowerCase().includes(searchKeyword.toLowerCase()))
    .filter((job) => selectedJobs.length === 0 || selectedJobs.includes(job.id)); // ✅ 추가된 필터링

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <Main className="subWrap">
      <div className="careerBox">
        <div className="subBox">
          <h3>커리어탐색</h3>
          <p>커리어 성장을 위한 직무 정보와 맞춤형 가이드</p>
        </div>
        <Container className="container">
          <SubSearch onSearch={setSearchKeyword} />

          {/* 탭 메뉴 */}
          <div className="tabContainer">
            <div className="tabBox">
              {industries.map((tab) => (
                <div className="box" key={tab}>
                  <button className={`tabBtn ${activeTab === tab ? "active" : ""}`} onClick={() => handleTabClick(tab)}>
                    {tab}
                  </button>
                </div>
              ))}
            </div>

            {/* 탭 콘텐츠 */}
            <div className="tabContentBox">
              <div className="tabContent">
                <div className="box">
                  {(industryJobs[activeTab] || []).map((job) => (
                    <button
                      key={job.id}
                      className={`button ${selectedJobs.includes(job.id) ? "active" : ""}`}
                      onClick={() => setSelectedJobs(prev => prev.includes(job.id) ? prev.filter(j => j !== job.id) : [...prev, job.id])}
                    >
                      {job.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 선택 초기화 버튼 */}
          <div className="resetBtnBox">
            <button className="resetBtn" onClick={handleResetSelection}>
              <span>선택 초기화</span>
            </button>
          </div>

          {/* 리스트 건수 표시 및 정렬 옵션 */}
          <div className={style.selectBox}>
            <span className={style.length}>총 {totalJobs}건</span>
            <label htmlFor="select" className="blind">
              정렬
            </label>
            <select id="select" className={style.select} onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
              <option value="가나다순">가나다순</option>
              <option value="연봉높은순">연봉 높은 순</option>
              <option value="연봉낮은순">연봉 낮은 순</option>
            </select>
          </div>

          {/* 테이블 */}
          <div className={style.tableBox}>
            <table className={style.table}>
              <caption className="blind">직무정보</caption>
              <colgroup>
                <col style={{ width: "70px" }} />
                <col style={{ width: "90px" }} />
                <col style={{ width: "180px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "100px" }} />
                <col style={{ width: "100px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>NO</th>
                  <th>산업</th>
                  <th>직무명</th>
                  <th>직무정보</th>
                  <th>평균연봉</th>
                  <th>시장전망</th>
                </tr>
              </thead>
              <tbody>
                {currentJobs.length > 0 ? (
                  currentJobs.map((job, index) => (
                    <tr key={job.id}>
                      <td>{index + 1}</td>
                      <td>{job.industry || "미정"}</td>
                      <td>{job.name}</td>
                      <td>
                        <Link to={`/careerexploration-detail/${job.id}`}>
                          {job.description || "정보 없음"}
                        </Link>
                      </td>
                      <td>{job.salary ? `${job.salary}만원` : "정보 없음"}</td>
                      <td>데이터없음</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>검색결과가 없습니다</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지 수 조정 드롭다운 */}
          <div className={style.pageSelectBox}>
            <label htmlFor="pageSelect" className="blind">
              페이지수 조정
            </label>
            <select id="pageSelect" className={style.pageSelect} onChange={(e) => setJobsPerPage(Number(e.target.value))} value={jobsPerPage}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          {/* 페이지네이션 */}
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />

        </Container>
      </div>
    </Main>
  );
}
