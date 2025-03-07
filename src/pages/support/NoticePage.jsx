// NoticePage.jsx
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import Table from "../../components/Table";
import { useEffect, useState } from "react";
import style from "./NoticePage.module.css";
import { getNotice } from "../../api/support/notice";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../../components/Loading";
import { useLoadingStore } from "../../store/useLoadingStore";

export default function NoticePage() {

  const navigate = useNavigate();
  const { token } = useAuthStore();

  //로딩 상태 관리
  const { isLoading, setLoading } = useLoadingStore();

  //데이터 상태관리
  const [noticeData, setNoticeData] = useState([]);
  console.log(noticeData);

  //정렬 상태 관리
  const [sortOrder, setSortOrder] = useState("최신순");

  //검색 상태 관리
  const [searchKeyword, setSearchKeyword] = useState("");

  //데이터 불러오기
  useEffect(() => {

    async function fetchNotice() {

      setLoading(true);

      try {

        const mappedSort = sortOrder === "최신순" ? "newest" : "oldest";

        const response = await getNotice({
          page: 0,
          size: 10,
          sort: mappedSort,
          search: searchKeyword,
        });

        if (response) {

          setNoticeData(response.data);

        }

      } catch (error) {

        console.error("error :", error);

      } finally {

        setLoading(false);

      }
    }

    fetchNotice();

  }, [sortOrder]);

  // 검색어 업데이트 함수
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 정렬 선택 업데이트 함수
  const handleSelectChange = (e) => {
    setSortOrder(e.target.value);
  };

  //실시간 검색
  const filteredData = noticeData.filter((item) =>
    item.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  //최신순, 오래된 순
  const sortedData = filteredData.sort((a, b) => {
    if (sortOrder === "최신순") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      return new Date(a.created_at) - new Date(b.created_at);
    }
  });

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!token) {
    navigate("/signin");
  }

  return (
    <Main className="subWrap bg">
      <div className="noticeBox">
        <Container className="lnbContainer">
          <div className="noticeContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice" className="active">
                  <span>공지사항</span>
                </Link>
                <Link to="/faq">
                  <span>FAQ</span>
                </Link>
                <Link to="/inquiry">
                  <span>1:1 문의</span>
                </Link>
                <Link to="/terms">
                  <span>이용약관</span>
                </Link>
                <Link to="/policy">
                  <span>개인정보처리방침</span>
                </Link>
              </aside>

              <div className="content">
                <div className="topBox">
                  <h4>공지사항</h4>
                  <div className="searchBox">
                    <div className="search">
                      <label htmlFor="search" className="blind">검색</label>
                      <input
                        id="search"
                        placeholder="키워드를 검색해주세요."
                        value={searchKeyword}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <div className="selectBox">
                      <label htmlFor="select" className="blind">최신순, 오래된 순 선택</label>
                      <select
                        id="select"
                        className="select"
                        value={sortOrder}
                        onChange={handleSelectChange}
                      >
                        <option value="최신순">최신순</option>
                        <option value="오래된 순">오래된 순</option>
                      </select>
                    </div>
                  </div>
                </div>

                {sortedData.length === 0 ? (
                  "검색결과가 없습니다."
                ) : (
                  <Table
                    href="/noticedetail"
                    filteredData={sortedData}
                    className={`${style.tableBox}`}
                    textClassName="textLeft ellipsisText"
                    columns={["NO.", "구분", "제목", "등록일"]}
                    colgroup={
                      <>
                        <col style={{ width: "90px" }} />
                        <col style={{ width: "100px" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "150px" }} />
                      </>
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
