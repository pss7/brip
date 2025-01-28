import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import style from "./Table.module.css";
import Loading from "./Loading";

export default function Table({ filteredData, caption, href, className, children, showStatus = false }) {
  const [visibleData, setVisibleData] = useState(filteredData.slice(0, 10)); // 처음 10개 항목만 표시
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 스크롤 이벤트 핸들러
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading && visibleData.length < filteredData.length) {
      loadMoreData();
    }
  };

  // 데이터를 추가로 불러오는 함수
  const loadMoreData = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleData((prevData) => [
        ...prevData,
        ...filteredData.slice(prevData.length, prevData.length + 10), // 10개씩 데이터 추가
      ]);
      setLoading(false);
    }, 1000); // 1초 딜레이 (로딩 상태를 보기 위한 시간)
  };

  useEffect(() => {
    // 필터된 데이터가 변경되면 처음부터 10개 데이터를 보여줌
    setVisibleData(filteredData.slice(0, 10));
  }, [filteredData]);

  return (
    <div className={style.tableBox} onScroll={handleScroll}>
      <table className={style.table}>
        <caption className="blind">{caption}</caption>
        {children}
        <tbody>
          {visibleData.map((data, index) => {
            return (
              <tr key={index}>
                <td>{data.id}</td>
                <td>{data.category}</td>
                <td>
                  <Link to={`${href}/${data.id}`} className={className}>
                    {data.title}
                  </Link>
                </td>
                {showStatus && (
                  <td>
                    <span
                      className={`${style.status} ${data.status === "답변완료" ? `${style.complete}` : ""
                        }`}
                    >
                      {data.status}
                    </span>
                  </td>
                )}
                <td>{data.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {loading && <Loading />}
    </div>
  );
}
