import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import { useState, useEffect, useRef } from "react";
import SubSearch from "../../components/SubSearch";
import {
  getEmploymentList,
  likeEmployment,
  applyEmployment,
  getResumes,
} from "../../api/employment/employment";
import { employmentTabData } from "../../data/employmentTabData";
import ConfirmPopup from "../../components/ConfirmPopup";
import CompletePopup from "../../components/CompletePopup";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../../components/Loading";

export default function EmploymentPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  // 토큰 체크
  useEffect(() => {
    if (!token) navigate("/signin");
  }, [token, navigate]);

  // 로딩 및 데이터 상태 관리
  const [loading, setLoading] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 탭 및 필터 상태 관리 (기술스택 추가)
  const [activeTab, setActiveTab] = useState("지역별");
  const [selectedFilters, setSelectedFilters] = useState({
    "지역별": [],
    "경력별": [],
    "근무형태": [],
    "기술스택": [],
  });
  const [activeRegion, setActiveRegion] = useState(null);
  const [activeSubRegions, setActiveSubRegions] = useState([]);

  // 이력서 관련 (즉시지원 시 필요)
  const [resumeId, setResumeId] = useState(null);

  // 즉시지원 모달 및 팝업 상태
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedEmployId, setSelectedEmployId] = useState(null);
  const [isCompletePopupOpen, setIsCompletePopupOpen] = useState(false);
  const [completePopupError, setCompletePopupError] = useState(false);
  const [completePopupMessage, setCompletePopupMessage] = useState("");

  // 무한 스크롤 관련 상태
  const [page, setPage] = useState(1);
  const size = 10;
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const closeCompletePopup = () => setIsCompletePopupOpen(false);

  // 이력서 API: 기본 이력서 또는 첫 번째 이력서를 선택
  useEffect(() => {
    getResumes()
      .then((data) => {
        if (data?.result === "success" && data.resumes.length > 0) {
          const defaultResume = data.resumes.find((r) => r.isDefault) || data.resumes[0];
          setResumeId(defaultResume.id);
        }
      })
      .catch((error) => console.error("이력서 API 에러:", error));
  }, []);

  // 채용공고 데이터 불러오기
  useEffect(() => {

    async function fetchEmployment() {

      setLoading(true);
      
      const params = {
        page,
        pageSize: size,
        keyword: searchTerm,
        regions:
          selectedFilters["지역별"].length > 0 ? selectedFilters["지역별"] : undefined,
        careers:
          selectedFilters["경력별"].length > 0 ? selectedFilters["경력별"] : undefined,
        workTypes:
          selectedFilters["근무형태"].length > 0 ? selectedFilters["근무형태"] : undefined,
        skills:
          selectedFilters["기술스택"].length > 0 ? selectedFilters["기술스택"] : undefined,
      };

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      );

      try {
        const data = await getEmploymentList(
          cleanParams.page,
          cleanParams.pageSize,
          cleanParams.keyword,
          cleanParams.regions,
          cleanParams.skills,
          cleanParams.careers,
          cleanParams.workTypes
        );
        if (data?.result === "success") {
          const normalized = data.employs.map((item) => ({
            id: item.id,
            company: item.company_name,
            title: item.title,
            experience: item.career,
            education: "",
            employmentType: item.work_type,
            regionMain: item.region_main,
            regionSub: item.region_sub,
            deadline: item.deadline,
            skills: item.skills, // 기술스택 정보 추가
            isApplied: item.application_status === "지원완료",
            isLiked: item.is_liked === 1,
          }));
          setJobPostings((prev) =>
            page === 1 ? normalized : [...prev, ...normalized]
          );
          setHasMore(data.employs.length >= size);
        }
      } catch (error) {
        console.error("채용공고 API 에러:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployment();
  }, [page, searchTerm, selectedFilters]);

  // 무한 스크롤: loader가 보이면 페이지 증가
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, loading]);

  // 필터링 로직: 부분 매칭
  const filteredJobPostings = jobPostings.filter((posting) => {
    const { 지역별: regionFilters, 경력별: careerFilters, 근무형태: workTypeFilters, 기술스택: skillFilters } =
      selectedFilters;

    const main = (posting.regionMain || "").toLowerCase();
    const sub = (posting.regionSub || "").toLowerCase();

    const regionMatch =
      regionFilters.length === 0 ||
      regionFilters.some((filter) => {
        const f = filter.toLowerCase();
        return main.includes(f) || sub.includes(f);
      });

    const careerMatch =
      careerFilters.length === 0 ||
      careerFilters.some((filter) =>
        posting.experience.toLowerCase().includes(filter.toLowerCase())
      );

    const workMatch =
      workTypeFilters.length === 0 ||
      workTypeFilters.some((filter) =>
        posting.employmentType.toLowerCase().includes(filter.toLowerCase())
      );

    const skillMatch =
      skillFilters.length === 0 ||
      (posting.skills &&
        skillFilters.some((filter) =>
          posting.skills.toLowerCase().includes(filter.toLowerCase())
        ));

    const searchMatch =
      searchTerm === "" ||
      posting.title.toLowerCase().includes(searchTerm.toLowerCase());

    return regionMatch && careerMatch && workMatch && skillMatch && searchMatch;
  });

  // 현재 활성 탭 필터 옵션
  const getFilterData = () => {
    const tab = employmentTabData.find((t) => t.id === activeTab);
    return tab ? tab.data : [];
  };

  // 탭 클릭 시
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setJobPostings([]);
  };

  // 정적 필터 선택/해제
  const handleFilterSelection = (filterType, filterId) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[filterType] || [];
      const newFilters = currentFilters.includes(filterId)
        ? currentFilters.filter((id) => id !== filterId)
        : [...currentFilters, filterId];
      return { ...prev, [filterType]: newFilters };
    });
    setPage(1);
  };

  // 대지역, 소지역 처리 (지역별 탭 전용)
  const handleRegionClick = (region) => {
    setActiveRegion(region);
    setActiveSubRegions([]);
    setSelectedFilters((prev) => ({ ...prev, "지역별": [] }));
  };

  const handleSubRegionSelection = (subId) => {
    if (!activeRegion) return;
    const allSubIds = activeRegion.subLocations.map((sub) => sub.id);
    setActiveSubRegions((prev) => {
      let newSubRegions;
      if (subId === "전체") {
        newSubRegions = prev.length === allSubIds.length ? [] : allSubIds;
      } else {
        newSubRegions = prev.includes(subId)
          ? prev.filter((id) => id !== subId)
          : [...prev, subId];
      }
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        "지역별": newSubRegions,
      }));
      return newSubRegions;
    });
  };

  // 검색어 업데이트
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
    setJobPostings([]);
  };

  // 선택 초기화
  const handleReset = () => {
    setSelectedFilters({
      "지역별": [],
      "경력별": [],
      "근무형태": [],
      "기술스택": [],
    });
    setActiveRegion(null);
    setActiveSubRegions([]);
    setSearchTerm("");
    setPage(1);
    setJobPostings([]);
  };

  // 좋아요 API 호출
  const handleLike = (id) => {
    likeEmployment(id)
      .then(() => {
        setJobPostings((prev) =>
          prev.map((posting) =>
            posting.id === id ? { ...posting, isLiked: !posting.isLiked } : posting
          )
        );
      })
      .catch((error) => console.error("좋아요 API 에러:", error));
  };

  // 즉시지원 모달
  const openApplyModal = (employId) => {
    setSelectedEmployId(employId);
    setIsApplyModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
    setSelectedEmployId(null);
  };

  // 즉시지원 확인 및 API 호출
  const confirmApply = () => {
    console.log("confirmApply called", selectedEmployId, resumeId);
    if (!resumeId) {
      setCompletePopupMessage("지원하기 전에 등록된 이력서가 없습니다. 이력서를 작성해 주세요.");
      setCompletePopupError(true);
      setIsCompletePopupOpen(true);
      return;
    }
    applyEmployment(selectedEmployId, resumeId)
      .then((res) => {
        if (res.result === "success") {
          setJobPostings((prev) =>
            prev.map((posting) =>
              posting.id === selectedEmployId ? { ...posting, isApplied: true } : posting
            )
          );
          closeApplyModal();
        } else {
          if (res.message === "이미 지원한 채용 공고입니다.") {
            setCompletePopupMessage("이미 지원한 기록이 있습니다. 지원취소 후 다시 지원해 주세요.");
            setCompletePopupError(true);
            setIsCompletePopupOpen(true);
            setJobPostings((prev) =>
              prev.map((posting) =>
                posting.id === selectedEmployId ? { ...posting, isApplied: true } : posting
              )
            );
          } else {
            setCompletePopupMessage(res.message);
            setCompletePopupError(true);
            setIsCompletePopupOpen(true);
          }
          closeApplyModal();
        }
      })
      .catch((error) => {
        console.error("즉시지원 API 에러:", error);
        setCompletePopupMessage("지원 도중 오류가 발생했습니다. 다시 시도해 주세요.");
        setCompletePopupError(true);
        setIsCompletePopupOpen(true);
      });
  };

  return (
    <Main className="subWrap">
      <div className="employmentBox">
        <div className="subBox">
          <h3>채용공고</h3>
          <p>최신 채용공고와 맞춤 커리어</p>
        </div>
        <div className="employmentContent">
          <Container className="container">
            <SubSearch onSearch={handleSearch} />

            {/* 탭 메뉴 */}
            <div className="tabContainer">
              <div className="tabBox">
                {employmentTabData.map((tab) => (
                  <div className="box" key={tab.id}>
                    <button
                      className={`tabBtn ${activeTab === tab.id ? "active" : ""}`}
                      onClick={() => handleTabClick(tab.id)}
                    >
                      {tab.id}
                    </button>
                  </div>
                ))}
              </div>

              {/* 탭 콘텐츠 */}
              <div className="tabContentBox">
                {activeTab === "지역별" ? (
                  <div className="tabContent">
                    <div className="regionBox">
                      <div className="regionList scroll">
                        {getFilterData().map((region) => (
                          <button
                            key={region.id}
                            className={`button ${activeRegion && activeRegion.id === region.id ? "active" : ""}`}
                            onClick={() => handleRegionClick(region)}
                          >
                            {region.name}
                          </button>
                        ))}
                      </div>
                      {activeRegion && activeRegion.subLocations && (
                        <div className="subRegionList">
                          <div className="subRegionBox">
                            <button
                              className={`button ${activeSubRegions.length === activeRegion.subLocations.length ? "active" : ""}`}
                              onClick={() => handleSubRegionSelection("전체")}
                            >
                              전체
                            </button>
                          </div>
                          {activeRegion.subLocations.map((sub) => {
                            const totalCount = activeRegion.subLocations.length;
                            let btnClass = "";
                            if (totalCount > 1) {
                              btnClass =
                                activeSubRegions.length === totalCount
                                  ? ""
                                  : activeSubRegions.includes(sub.id)
                                    ? "active"
                                    : "";
                            } else {
                              btnClass = activeSubRegions.includes(sub.id) ? "active" : "";
                            }
                            return (
                              <div key={sub.id} className="subRegionBox">
                                <button className={`button ${btnClass}`} onClick={() => handleSubRegionSelection(sub.id)}>
                                  {sub.name}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="tabContent">
                    <div className="box">
                      {getFilterData().map((filter) => (
                        <button
                          key={filter.id}
                          className={`button ${selectedFilters[activeTab]?.includes(filter.id) ? "active" : ""}`}
                          onClick={() => handleFilterSelection(activeTab, filter.id)}
                        >
                          {filter.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 선택 초기화 버튼 */}
            <div className="resetBtnBox">
              <button className="resetBtn" onClick={handleReset}>
                <span>선택 초기화</span>
              </button>
            </div>

            {/* 필터링된 채용공고 리스트 */}
            <div className="employmentList">
              {loading ? (
                <Loading center />
              ) : filteredJobPostings.length > 0 ? (
                filteredJobPostings.map((posting) => (
                  <div className="box" key={posting.id}>
                    <div className="companyBox">
                      <div className="company">{posting.company}</div>
                      <button
                        className={`likeBtn ${posting.isLiked ? "active" : ""}`}
                        onClick={() => handleLike(posting.id)}
                      >
                        <span className="blind">{posting.isLiked ? "좋아요 취소" : "좋아요"}</span>
                      </button>
                    </div>
                    <div className="titleBox">
                      <Link to={`/employment-detail/${posting.id}`}>
                        {posting.title}
                      </Link>
                      <ul className="infoList">
                        <li>{posting.experience}</li>
                        <li>{posting.skills}</li>
                        {/* <li>{posting.education}</li> */}
                        <li>{posting.employmentType}</li>
                        <li>{`${posting.regionMain} ${posting.regionSub}`}</li>
                        <li>{posting.deadline}</li>
                      </ul>
                    </div>
                    <button
                      className={`applyBtn ${posting.isApplied ? "complete" : ""}`}
                      onClick={() => {
                        if (!posting.isApplied) openApplyModal(posting.id);
                      }}
                    >
                      <span>{posting.isApplied ? "지원완료" : "즉시지원"}</span>
                    </button>
                  </div>
                ))
              ) : (
                <p className="infoText">검색된 채용공고가 없습니다.</p>
              )}
            </div>
          </Container>
        </div>
      </div>

      <ConfirmPopup
        isOpen={isApplyModalOpen}
        onClose={closeApplyModal}
        message="즉시지원 확인"
        subMessage="정말 지원하시겠습니까?"
        confirmText="지원하기"
        cancelText="취소"
        onConfirm={confirmApply}
      />

      <CompletePopup
        isOpen={isCompletePopupOpen}
        onClose={closeCompletePopup}
        message={completePopupMessage}
        error={completePopupError}
      />
    </Main>
  );
}
