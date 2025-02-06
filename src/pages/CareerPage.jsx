import { Link } from "react-router-dom";
import Main from "../components/layout/Main";
import Container from "../components/Container";
import Pagination from "../components/Pagination";
import SubSearch from "../components/SubSearch";
import style from "./CareerPage.module.css";
import { shippingIndustryData } from "../data/shippingIndustryData";
import { useState } from "react";

export default function CareerPage() {
  const [activeTab, setActiveTab] = useState("해운산업"); // 활성 탭 상태 관리

  // 탭 클릭 시 해당 탭 활성화`
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 탭 클릭 시 해당 산업의 직무 목록을 필터링
  const selectedIndustryData = shippingIndustryData.find(
    (industry) => industry.id === activeTab
  );

  return (
    <Main className="subWrap">
      <div className="careerBox">
        <div className="subBox">
          <h3>커리어탐색</h3>
          <p>커리어 성장을 위한 직무 정보와 맞춤형 가이드</p>
        </div>

        <Container className="container">
          <div className="careerBoxContent">
            <SubSearch />

            {/* 탭 메뉴 */}
            <div className="tabContainer">
              <div className="tabBox">
                {
                  shippingIndustryData.map((tab) => {
                    return (
                      <div className="box" key={tab.id}>
                        <button
                          className={`tabBtn ${activeTab === tab.id ? "active" : ""}`}
                          onClick={() => handleTabClick(tab.id)} // 탭 클릭 시 활성화
                        >
                          {tab.id}
                        </button>
                      </div>
                    )
                  })
                }
              </div>

              {/* 탭 콘텐츠 */}
              <div className="tabContentBox">
                {activeTab === "해운산업" && (
                  <div className="tabContent">
                    <div className="box">
                      {/* 선택된 산업의 직무 리스트만 출력 */}
                      {selectedIndustryData && selectedIndustryData.jobs.map((job) => (
                        <button key={job.id} className="button">
                          {job.name} {/* 직무 이름 */}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "항만산업" && (
                  <div className="tabContent">
                    <div className="box">
                      {/* 선택된 산업의 직무 리스트만 출력 */}
                      {selectedIndustryData && selectedIndustryData.jobs.map((job) => (
                        <button key={job.id} className="button">
                          {job.name} {/* 직무 이름 */}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "항만연관산업" && (
                  <div className="tabContent">
                    <div className="box">
                      {/* 선택된 산업의 직무 리스트만 출력 */}
                      {selectedIndustryData && selectedIndustryData.jobs.map((job) => (
                        <button key={job.id} className="button">
                          {job.name} {/* 직무 이름 */}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "물류산업" && (
                  <div className="tabContent">
                    <div className="box">
                      {/* 선택된 산업의 직무 리스트만 출력 */}
                      {selectedIndustryData && selectedIndustryData.jobs.map((job) => (
                        <button key={job.id} className="button">
                          {job.name} {/* 직무 이름 */}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>


            <div className={style.selectBox}>
              <span className={style.length}>총 3,452건</span>
              <label htmlFor="select" className="blind">
                선택
              </label>
              <select id="select" className={style.select}>
                <option>가나다순</option>
              </select>
            </div>

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
                  <tr>
                    <td>7</td>
                    <td>해운산업</td>
                    <td>선박운항관리자</td>
                    <td className="textLeft title">
                      <Link to="/careerdetail">선박의 안전한 운항을 계획하고 관리하며 항로와 일정 조율을 담당</Link>
                    </td>
                    <td>4000만원</td>
                    <td>
                      <span className="veryGood">매우좋음</span>
                    </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>항만산업</td>
                    <td>하역전문가</td>
                    <td className="textLeft title">
                      <Link to="/careerdetail">화물의 적재와 하역 작업을 안전하고 효율적으로 수행하고 감독</Link>
                    </td>
                    <td>4000만원</td>
                    <td>
                      <span className="veryGood">매우좋음</span>
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>항만연관산업</td>
                    <td>선용품공급업</td>
                    <td className="textLeft title">
                      <Link to="/careerdetail">선박에 필요한 연료, 자재, 장비 등을 공급하며 품질과 물류를 관리</Link>
                    </td>
                    <td>4000만원</td>
                    <td>
                      <span className="good">좋음</span>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>물류산업</td>
                    <td>SCM(공급망 관리) 전문가</td>
                    <td className="textLeft title">
                      <Link to="/careerdetail">공급망의 모든 흐름을 계획하고 최적화하여 물류 비용과 시간을 효율화</Link>
                    </td>
                    <td>4000만원</td>
                    <td>
                      <span className="good">좋음</span>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>해운산업</td>
                    <td>해상화물운송관리자</td>
                    <td className="textLeft title">
                      <Link to="/careerdetail">해상 화물의 운송 일정, 경로, 안전을 조율하며 운송 계약을 관리</Link>
                    </td>
                    <td>4000만원</td>
                    <td>
                      <span className="commonly">보통</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={style.pageSelectBox}>
              <label htmlFor="pageSelect" className="blind">
                페이지수 조정
              </label>
              <select id="pageSelect" className={style.pageSelect}>
                <option>10</option>
              </select>
            </div>

          </div>
          <Pagination />
        </Container>
      </div>
    </Main>
  );
}
