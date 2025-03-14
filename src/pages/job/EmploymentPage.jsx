import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import { useState, useEffect } from "react";
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

export default function EmploymentPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  const [activeTab, setActiveTab] = useState("지역별");
  const [selectedFilters, setSelectedFilters] = useState({
    "지역별": [],
    "직무별": [],
    "경력별": [],
    "근무형태": [],
  });
  const [jobPostings, setJobPostings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 지역별: 대지역/소지역 상태
  const [activeRegion, setActiveRegion] = useState(null);
  const [activeSubRegions, setActiveSubRegions] = useState([]);

  // 이력서 관련
  const [resumeId, setResumeId] = useState(null);

  // 즉시지원 모달
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedEmployId, setSelectedEmployId] = useState(null);

  // CompletePopup
  const [isCompletePopupOpen, setIsCompletePopupOpen] = useState(false);
  const [completePopupError, setCompletePopupError] = useState(false);
  const [completePopupMessage, setCompletePopupMessage] = useState("");

  const closeCompletePopup = () => {
    setIsCompletePopupOpen(false);
  };

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

  // 채용공고 목록 API
  useEffect(() => {
    const params = {
      page: 1,
      pageSize: 10,
      keyword: searchTerm,
      regions: selectedFilters["지역별"].length > 0 ? selectedFilters["지역별"] : undefined,
      careers: selectedFilters["경력별"].length > 0 ? selectedFilters["경력별"] : undefined,
      workTypes: selectedFilters["근무형태"].length > 0 ? selectedFilters["근무형태"] : undefined,
      skills: selectedFilters["직무별"].length > 0 ? selectedFilters["직무별"] : undefined,
    };

    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    getEmploymentList(
      cleanParams.page,
      cleanParams.pageSize,
      cleanParams.keyword,
      cleanParams.regions,
      cleanParams.skills,
      cleanParams.careers,
      cleanParams.workTypes
    )
      .then((data) => {
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
            isApplied: item.is_applied === 1,
            isLiked: item.is_liked === 1,
          }));
          setJobPostings(normalized);
        }
      })
      .catch((error) => console.error("채용공고 API 에러:", error));
  }, [searchTerm, selectedFilters]);

  // 현재 활성 탭의 필터 옵션
  const getFilterData = () => {
    const tab = employmentTabData.find((t) => t.id === activeTab);
    return tab ? tab.data : [];
  };

  // 탭 클릭 시
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 정적 필터 선택/해제 (직무별, 경력별, 근무형태 등)
  const handleFilterSelection = (filterType, filterId) => {
    setSelectedFilters((prev) => {
      const newFilters = prev[filterType].includes(filterId)
        ? prev[filterType].filter((id) => id !== filterId)
        : [...prev[filterType], filterId];
      return { ...prev, [filterType]: newFilters };
    });
  };

  // 대지역 클릭: 대지역 클릭 시 소지역은 보여주지만 필터는 적용하지 않음.
  const handleRegionClick = (region) => {
    setActiveRegion(region);
    setActiveSubRegions([]);
    // 대지역 자체는 필터에 반영하지 않음.
    setSelectedFilters((prev) => ({
      ...prev,
      "지역별": [],
    }));
  };

  // 소지역 클릭: "전체" 옵션 포함, 소지역 선택 시 필터에 반영
  const handleSubRegionSelection = (subId) => {
    if (!activeRegion) return; // 활성 지역이 없으면 종료

    const allSubIds = activeRegion.subLocations.map((sub) => sub.id);

    setActiveSubRegions((prev) => {
      let newSubRegions;

      if (subId === "전체") {
        // "전체" 버튼이 클릭되었을 때
        if (prev.length === allSubIds.length) {
          // 모든 선택 해제
          newSubRegions = [];
        } else {
          // 전체 선택
          newSubRegions = allSubIds;
        }
      } else {
        // 개별 소지역 선택/해제
        if (prev.includes(subId)) {
          newSubRegions = prev.filter((id) => id !== subId);
        } else {
          newSubRegions = [...prev, subId];
        }
      }

      // "전체" 버튼은 모든 소지역이 선택되었을 때만 활성화
      const isAllSelected = newSubRegions.length === allSubIds.length;

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
  };

  // 선택 초기화
  const handleReset = () => {
    setSelectedFilters({
      "지역별": [],
      "직무별": [],
      "경력별": [],
      "근무형태": [],
    });
    setActiveRegion(null);
    setActiveSubRegions([]);
    setSearchTerm("");
  };

  // 필터링 로직: 부분 매칭
  const filteredJobPostings = jobPostings.filter((posting) => {
    const regionFilters = selectedFilters["지역별"];
    const jobFilters = selectedFilters["직무별"];
    const careerFilters = selectedFilters["경력별"];
    const workTypeFilters = selectedFilters["근무형태"];

    const main = (posting.regionMain || "").toLowerCase();
    const sub = (posting.regionSub || "").toLowerCase();

    const regionMatch =
      regionFilters.length === 0 ||
      regionFilters.some((filter) => {
        const f = filter.toLowerCase();
        return main.includes(f) || sub.includes(f);
      });

    const jobMatch =
      jobFilters.length === 0 ||
      jobFilters.some((filter) =>
        posting.title.toLowerCase().includes(filter.toLowerCase())
      );

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

    const searchMatch =
      searchTerm === "" ||
      posting.title.toLowerCase().includes(searchTerm.toLowerCase());

    return regionMatch && jobMatch && careerMatch && workMatch && searchMatch;
  });

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

  // 즉시지원 모달 열기
  const openApplyModal = (employId) => {
    setSelectedEmployId(employId);
    setIsApplyModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
    setSelectedEmployId(null);
  };

  const confirmApply = () => {
    if (!resumeId) {
      setCompletePopupMessage("지원하기 전에 등록된 이력서가 없습니다. 이력서를 작성해 주세요.");
      setCompletePopupError(true);
      setIsCompletePopupOpen(true);
      return;
    }
    applyEmployment(selectedEmployId, resumeId)
      .then(() => {
        setJobPostings((prev) =>
          prev.map((posting) =>
            posting.id === selectedEmployId ? { ...posting, isApplied: true } : posting
          )
        );
        closeApplyModal();
      })
      .catch((error) => console.error("즉시지원 API 에러:", error));
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
                      {/* 대지역 버튼 */}
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
                      {/* 소지역 버튼 (상단에 "전체" 버튼 추가) */}

                      {activeRegion && activeRegion.subLocations && (
                        <div className="subRegionList">
                          {/* 전체 버튼 */}
                          <div className="subRegionBox">
                            <button
                              className={`button ${activeSubRegions.length === activeRegion.subLocations.length
                                ? "active"
                                : ""
                                }`}
                              onClick={() => handleSubRegionSelection("전체")}
                            >
                              전체
                            </button>
                          </div>
                          {/* 개별 소지역 버튼 */}
                          {activeRegion.subLocations.map((sub) => {
                            const totalCount = activeRegion.subLocations.length;
                            let btnClass = "";
                            // 소지역이 여러 개인 경우, 전체가 선택되었다면 개별 버튼은 active 클래스를 제거
                            if (totalCount > 1) {
                              btnClass =
                                activeSubRegions.length === totalCount
                                  ? ""
                                  : activeSubRegions.includes(sub.id)
                                    ? "active"
                                    : "";
                            } else {
                              // 소지역이 1개인 경우
                              btnClass = activeSubRegions.includes(sub.id) ? "active" : "";
                            }
                            return (
                              <div key={sub.id} className="subRegionBox">
                                <button
                                  className={`button ${btnClass}`}
                                  onClick={() => handleSubRegionSelection(sub.id)}
                                >
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
                          className={`button ${selectedFilters[activeTab].includes(filter.id) ? "active" : ""}`}
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
              {filteredJobPostings.length > 0 ? (
                filteredJobPostings.map((posting) => (
                  <div className="box" key={posting.id}>
                    <div className="companyBox">
                      <div className="company">{posting.company}</div>
                      <button
                        className={`likeBtn ${posting.isLiked ? "active" : ""}`}
                        onClick={() => handleLike(posting.id)}
                      >
                        <span className="blind">
                          {posting.isLiked ? "좋아요 취소" : "좋아요"}
                        </span>
                      </button>
                    </div>
                    <div className="titleBox">
                      <Link to={`/employment-detail/${posting.id}`}>
                        <h4>{posting.title}</h4>
                      </Link>
                      <ul className="infoList">
                        <li>{posting.experience}</li>
                        <li>{posting.education}</li>
                        <li>{posting.employmentType}</li>
                        <li>{`${posting.regionMain} ${posting.regionSub}`}</li>
                        <li>{posting.deadline}</li>
                      </ul>
                    </div>
                    <button
                      className={`applyBtn ${posting.isApplied ? "complete" : ""}`}
                      onClick={() => {
                        if (!posting.isApplied) {
                          openApplyModal(posting.id);
                        }
                      }}
                    >
                      <span>{posting.isApplied ? "지원완료" : "즉시지원"}</span>
                    </button>
                  </div>
                ))
              ) : (
                <p>검색된 채용공고가 없습니다.</p>
              )}
            </div>
          </Container>
        </div>
      </div>

      {/* 즉시지원 확인 모달 */}
      <ConfirmPopup
        isOpen={isApplyModalOpen}
        onClose={closeApplyModal}
        message="즉시지원 확인"
        subMessage="정말 지원하시겠습니까?"
        confirmText="지원하기"
        cancelText="취소"
        onConfirm={confirmApply}
      />

      {/* CompletePopup: 이력서가 등록되지 않았거나 오류 시 사용 */}
      <CompletePopup
        isOpen={isCompletePopupOpen}
        onClose={closeCompletePopup}
        message={completePopupMessage}
        error={completePopupError}
      />
    </Main>
  );
}
