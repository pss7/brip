import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import Table from "../../components/Table";
import { useEffect, useState, useRef } from "react";
import style from "./NoticePage.module.css";
import { getNotice } from "../../api/support/notice";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../../components/Loading";
import { useLoadingStore } from "../../store/useLoadingStore";

export default function NoticePage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { isLoading, setLoading } = useLoadingStore();

  // 데이터 상태관리
  const [noticeData, setNoticeData] = useState([]);
  // 페이지, 사이즈, 추가 데이터 존재 여부
  const [page, setPage] = useState(0);
  const size = 10;
  const [hasMore, setHasMore] = useState(true);

  // 정렬 및 검색 상태관리
  const [sortOrder, setSortOrder] = useState("최신순");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 스크롤 감지를 위한 ref
  const loaderRef = useRef(null);

  // 로그인 체크: 토큰 없으면 signin 페이지로 이동
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  // 데이터 불러오기: page, sortOrder, searchKeyword가 변경될 때마다 호출
  useEffect(() => {
    async function fetchNotice() {
      setLoading(true);
      try {
        const mappedSort = sortOrder === "최신순" ? "newest" : "oldest";
        const response = await getNotice({
          page,
          size,
          sort: mappedSort,
          search: searchKeyword,
        });

        if (response) {
          // page가 0이면 기존 데이터를 교체, 아니면 기존 데이터에 추가
          if (page === 0) {
            setNoticeData(response.data);
          } else {
            setNoticeData((prev) => [...prev, ...response.data]);
          }
          // 받아온 데이터 수가 size보다 작으면 더 불러올 데이터가 없다고 판단
          if (response.data.length < size) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      } catch (error) {
        console.error("error :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotice();
  }, [page, sortOrder, searchKeyword, setLoading]);

  // 검색어 변경 시: 페이지와 데이터 초기화
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(0);
    setNoticeData([]);
    setHasMore(true);
  };

  // 정렬 변경 시: 페이지와 데이터 초기화
  const handleSelectChange = (e) => {
    setSortOrder(e.target.value);
    setPage(0);
    setNoticeData([]);
    setHasMore(true);
  };

  // 무한 스크롤: loader 영역이 보이면 다음 페이지 로드 (추가 데이터가 있고, 현재 로딩 중이 아닐 때)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, isLoading]);

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
                      <label htmlFor="search" className="blind">
                        검색
                      </label>
                      <input
                        id="search"
                        placeholder="키워드를 검색해주세요."
                        value={searchKeyword}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <div className="selectBox">
                      <label htmlFor="select" className="blind">
                        최신순, 오래된 순 선택
                      </label>
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

                {isLoading ? (
                  <Loading center />
                ) : noticeData.length === 0 ? (
                  "검색결과가 없습니다."
                ) : (
                  <Table
                    href="/noticedetail"
                    filteredData={noticeData}
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

                {/* 스크롤 감지 영역: 추가 데이터가 있을 때 로딩 스패너 노출 */}
                <div ref={loaderRef}>
                  {hasMore && !isLoading && <Loading />}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
