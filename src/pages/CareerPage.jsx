import { Link } from "react-router-dom";
import Main from "../components/section/Main";
import Container from "../components/Container";
import Pagination from "../components/Pagination";

export default function CareerPage() {

  return (
    <Main className="subWrap">

      <div className="careerBox">

        <div className="subBox">
          <h3>
            커리어탐색
          </h3>
          <p>
            커리어 성장을 위한 직무 정보와 맞춤형 가이드
          </p>
        </div>

        <Container className="container">
          <div className="careerBoxContent">
            <div className="comSearchBox">
              <form>
                <div className="inputBox">
                  <label htmlFor="search" className="blind">
                    검색
                  </label>
                  <input id="search" type="text" placeholder="직무를 검색해주세요." />
                </div>
              </form>
            </div>

            <div className="tabBox">
              <div className="comTabMenu">
                <ul className="list">
                  <li>
                    <Link to="#" className="active">
                      해운산업
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      항만산업
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      항만연관산업
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      물류산업
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="comTabContent">
                <ul className="list">
                  <li>
                    <Link to="#">
                      전체
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      선박 운항 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      선박 운항 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      선박 운항 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      해상 화물 운송 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      해상 화물 운송 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      해상 화물 운송 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      해상 화물 운송 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      항로 계획 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      항로 계획 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      항로 계획 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      항로 계획 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#"  className="active">
                      선박 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      선박 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      선박 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      선박 관리자
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      선박 엔지니어
                    </Link>
                  </li>
                  <li>
                    <Link to="#"  className="active">
                      선박 엔지니어
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      선박 엔지니어
                    </Link>
                  </li>
                </ul>
              </div>

              <button className="resetBtn">
                <span>
                  선택 초기화
                </span>
              </button>
            </div>
          </div>

          <div className="selectBox">
            <span className="length">
              총 3,452건
            </span>
            <label htmlFor="select" className="blind">
              선택
            </label>
            <select id="select" className="select">
              <option>
                가나다순
              </option>
            </select>
          </div>

          <div className="tableBox">
            <table className="table">
              <caption className="blind">
                직무정보
              </caption>
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
                  <th>
                    NO
                  </th>
                  <th>
                    산업
                  </th>
                  <th>
                    직무명
                  </th>
                  <th>
                    직무정보
                  </th>
                  <th>
                    평균연봉
                  </th>
                  <th>
                    시장전망
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    7
                  </td>
                  <td>
                    해운산업
                  </td>
                  <td>
                    선박운항관리자
                  </td>
                  <td className="textLeft title">
                    <Link to="/careerdetail">
                      선박의 안전한 운항을 계획하고 관리하며 항로와 일정 조율을 담당
                    </Link>
                  </td>
                  <td>
                    4000만원
                  </td>
                  <td>
                    <span className="veryGood">
                      매우좋음
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    6
                  </td>
                  <td>
                    항만산업
                  </td>
                  <td>
                    하역전문가
                  </td>
                  <td className="textLeft title">
                    <Link to="/careerdetail">
                      화물의 적재와 하역 작업을 안전하고 효율적으로 수행하고 감독
                    </Link>
                  </td>
                  <td>
                    4000만원
                  </td>
                  <td>
                    <span className="veryGood">
                      매우좋음
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    5
                  </td>
                  <td>
                    항만연관산업
                  </td>
                  <td>
                    선용품공급업
                  </td>
                  <td className="textLeft title">
                    <Link to="/careerdetail">
                      선박에 필요한 연료, 자재, 장비 등을 공급하며 품질과 물류를 관리
                    </Link>
                  </td>
                  <td>
                    4000만원
                  </td>
                  <td>
                    <span className="good">
                      좋음
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    4
                  </td>
                  <td>
                    물류산업
                  </td>
                  <td>
                    SCM(공급망 관리) 전문가
                  </td>
                  <td className="textLeft title">
                    <Link to="/careerdetail">
                      공급망의 모든 흐름을 계획하고 최적화하여 물류 비용과 시간을 효율화
                    </Link>
                  </td>
                  <td>
                    4000만원
                  </td>
                  <td>
                    <span className="good">
                      좋음
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    3
                  </td>
                  <td>
                    해운산업
                  </td>
                  <td>
                    해상화물운송관리자
                  </td>
                  <td className="textLeft title">
                    <Link to="/careerdetail">
                      해상 화물의 운송 일정, 경로, 안전을 조율하며 운송 계약을 관리
                    </Link>
                  </td>
                  <td>
                    4000만원
                  </td>
                  <td>
                    <span className="commonly">
                      보통
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    2
                  </td>
                  <td>
                    해운산업
                  </td>
                  <td>
                    항로계획관리자
                  </td>
                  <td className="textLeft title">
                    <Link to="/careerdetail">
                      선박 운항의 최적 항로를 설계하고, 연료 효율성과 안전을 최우선으로 고려
                    </Link>
                  </td>
                  <td>
                    4000만원
                  </td>
                  <td>
                    <span className="commonly">
                      보통
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    1
                  </td>
                  <td>
                    해운산업
                  </td>
                  <td>
                    선박엔지니어
                  </td>
                  <td className="textLeft title">
                    <Link to="/careerdetail">
                      선박의 엔진, 전기 및 기계 시스템을 유지보수하고 기술적 문제를 해결
                    </Link>
                  </td>
                  <td>
                    4000만원
                  </td>
                  <td>
                    <span className="veryGood">
                      매우좋음
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pageSelectBox">
            <label htmlFor="pageSelect" className="blind">
              페이지수 조정
            </label>
            <select id="pageSelect" className="pageSelect">
              <option>
                10
              </option>
            </select>
          </div>

          <Pagination />

        </Container>
      </div>

    </Main >
  )

}