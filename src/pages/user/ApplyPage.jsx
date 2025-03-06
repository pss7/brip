import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../assets/images/sub/Calendar_Icon.svg";
import style from "./ApplyPage.module.css";

// ✅ API 함수들 import
import { applyStatus, cancelApplication, deleteApplication } from "../../api/user/applystatus/applyStatus.js";

export default function ApplyPage() {
  // (예시) 로그인 체크가 필요하면 useNavigate 사용
  const navigate = useNavigate();

  // 📌 오늘 날짜 & 한 달 전 날짜
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  // ⏰ 날짜 상태
  const [startDate, setStartDate] = useState(() => new Date(oneMonthAgo));
  const [endDate, setEndDate] = useState(() => new Date(today));

  // 🔎 지원 내역 & 상태
  const [filteredList, setFilteredList] = useState([]);
  console.log(filteredList);
  const [stats, setStats] = useState({
    applied: 0,
    viewed: 0,
    unviewed: 0,
    canceled: 0,
  });

  // ✅ 지원 내역 가져오기
  const fetchApplications = async () => {
    try {
      // API 호출 (startDate, endDate 전달)
      const data = await applyStatus(startDate, endDate);
      console.log("📌 API 응답 데이터:", data);

      if (data?.result === "success") {
        // 최대 5개만 표시하는 로직 (필요하면 수정 가능)
        setFilteredList(data.applications.slice(0, 5));
        setStats(data.statusCounts);
      } else {
        // 실패 처리나 에러 메시지 표시 등을 할 수 있음
        console.warn("지원 내역 데이터가 없습니다.");
      }
    } catch (error) {
      console.error("❌ 지원 내역 불러오기 오류:", error);
    }
  };

  // 📌 날짜 변경 시마다 API 재호출
  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // ✅ 지원 취소
  const handleCancel = async (applicationId) => {
    try {
      await cancelApplication(applicationId);
      fetchApplications(); // 취소 후 다시 갱신
    } catch (error) {
      console.error("지원 취소 오류:", error);
    }
  };

  // ✅ 지원 삭제
  const handleDelete = async (applicationId) => {
    try {
      await deleteApplication(applicationId);
      fetchApplications(); // 삭제 후 다시 갱신
    } catch (error) {
      console.error("지원 삭제 오류:", error);
    }
  };

  return (
    <Main className="subWrap bg">
      <div className="mypageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/mypage"><span>프로필</span></Link>
                <Link to="/interest"><span>관심공고</span></Link>
                <Link to="/resume"><span>이력서관리</span></Link>
                <Link to="/apply" className="active"><span>지원현황</span></Link>
                <Link to="/activity"><span>내 활동</span></Link>
              </aside>
              <div className="content">
                <h4 className="title">지원현황</h4>
                <p className="subTitle">내가 지원한 채용 공고의 진행 상황을 한눈에 확인하세요</p>

                {/* 날짜 선택 박스 */}
                <div className="datepickerBox">
                  <div className="box">
                    <label htmlFor="datepicker01">
                      <DatePicker
                        id="datepicker01"
                        selected={startDate}
                        onChange={(date) => setStartDate(new Date(date))}
                        maxDate={endDate}
                      />
                      <img src={CalendarIcon} alt="달력아이콘" />
                    </label>
                  </div>
                  <span>~</span>
                  <div className="box">
                    <label htmlFor="datepicker02">
                      <DatePicker
                        id="datepicker02"
                        selected={endDate}
                        onChange={(date) => setEndDate(new Date(date))}
                        minDate={startDate}
                      />
                      <img src={CalendarIcon} alt="달력아이콘" />
                    </label>
                  </div>
                </div>

                {/* 지원 상태 카운트 */}
                <ul className={style.infoList}>
                  <li><span>지원완료</span><em>{stats.applied}</em></li>
                  <li><span>열람</span><em>{stats.viewed}</em></li>
                  <li><span>미열람</span><em>{stats.unviewed}</em></li>
                  <li><span>지원취소</span><em>{stats.canceled}</em></li>
                </ul>

                {/* 지원 내역 리스트 */}
                <ul className={style.applyList}>
                  {filteredList.length > 0 ? (
                    filteredList.map(({ applicationId, employId, companyName, employTitle, deadline, appliedAt, status }) => (
                      <li key={applicationId}>
                        <Link to={`/employmentdetail/${employId}`} className={style.topBox}>
                          <span className={style.receipt}>접수마감</span>
                          <div className={style.textBox}>
                            <em>{companyName}</em>
                            <h5>{employTitle}</h5>
                          </div>
                        </Link>
                        <div className={style.dateBox}>
                          <span>지원일</span>
                          <em className={style.date}>
                            {new Date(appliedAt).toLocaleDateString()}
                          </em>
                          <span className={style.viewingDate}>{status}</span>
                        </div>
                        <div className={style.buttonBox}>
                          <button
                            className={style.delBtn}
                            onClick={() => handleCancel(applicationId)}
                          >
                            지원 취소
                          </button>
                          {/* 삭제 버튼이 필요하다면 주석 해제
                          <button
                            className={style.delBtn}
                            onClick={() => handleDelete(applicationId)}
                          >
                            삭제
                          </button>
                          */}
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className={style.noData}>지원 내역이 없습니다.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
