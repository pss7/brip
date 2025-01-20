import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import style from "./EmploymentPage.module.css"
import { jobPostingsData } from "../data/jobPostingsData";
import { useState } from "react";

export default function EmploymentPage() {

  const [postings, setPostings] = useState(jobPostingsData);

  function ToggleLike(index) {
    setPostings((prevPostings) => {
      return (
        prevPostings.map((posting, i) => {
          return (
            i === index ? { ...posting, isLiked: !posting.isLiked } : posting
          )
        }
        )
      )
    }
    );
  }

  function ToggleApply(index) {
    setPostings((prevPostings) => {
      return (
        prevPostings.map((posting, i) => {
          return (
            i === index ? { ...posting, isApplied: !posting.isApplied } : posting
          )
        }
        )
      )
    }
    );
  }

  return (
    <Main className={`subWrap ${style.subWrap}`}>

      <div className="employmentBox">

        <div className="subBox">
          <h3>
            채용공고
          </h3>
          <p>
            최신 채용공고와 맞춤 커리어
          </p>
        </div>

        <div className="employmentContent">
          <Container className={style.container}>

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

            <div className="employmentInfoList">
              <div className="comTabMenu">
                <ul className="list">
                  <li>
                    <Link to="#" className="active">
                      지역별
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      직무별
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      경력별
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      근무형태
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="comTabContent">

                <ul className="list">
                  <li>
                    <Link to="#"  className="active">
                      전체
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      서울시
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      경기도
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      인천광역시
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      대전광역시
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      강원특별자치도
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      부산광역시
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      대구광역시
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      울산광역시
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      광주광역시
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      충청북도
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      충청남도
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      전라북도
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      전라남도
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      경상북도
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      경상남도
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      제주특별자치도
                    </Link>
                  </li>
                </ul>

                <ul className="list list02">
                  <li>
                    <Link to="#"  className="active">
                      전체
                    </Link>
                  </li>
                  <li>
                    <Link to="#" >
                      동구
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      중구
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      강화군
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      부평구
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      계양구
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      서구
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      미추홀구
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      연수구
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      남동구
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      옹진구
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

            <ul className="employmentApplyList">

              {
                postings.map((data, index) => {
                  return (
                    <li key={index}>
                      <div className="companyBox">
                        <span className="company">
                          {data.company}
                        </span>
                        <button
                          className={`likeBtn ${data.isLiked ? "active" : ""}`}
                          onClick={() => ToggleLike(index)}
                        >
                          <span className="blind">
                            {data.isLiked ? "좋아요 취소" : "좋아요"}
                          </span>
                        </button>
                      </div>
                      <div className="titleBox">
                        <Link to="/employmentdetail">
                          <h4>
                            {data.title}
                          </h4>
                        </Link>
                        <p className="condition">
                          {data.condition}
                        </p>
                      </div>
                      <button
                        className={`applyBtn ${data.isApplied ? "complete" : ""}`}
                        onClick={() => ToggleApply(index)}
                      >
                        <span>
                          {data.isApplied ? "지원완료" : "즉시지원"}
                        </span>
                      </button>

                    </li>
                  )
                })
              }
            </ul>
          </Container>
        </div>
      </div>

    </Main >
  )

}