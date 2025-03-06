import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../assets/images/sub/Calendar_Icon.svg";
import style from "./ApplyPage.module.css";
import { applyStatus, cancelApplication } from "../../api/user/applystatus/applyStatus.js";
import { useAuthStore } from "../../store/useAuthStore.js";

export default function ApplyPage() {

  const navigate = useNavigate();
  const { token } = useAuthStore();

  //로그인 체크
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  //날짜 변환 함수 (YYYY-MM-DD)
  const formatDateLocal = (date) => {
    if (!(date instanceof Date)) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //오늘 날짜 & 한 달 전 날짜
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  //날짜 상태 (항상 `Date` 객체 유지)
  const [startDate, setStartDate] = useState(new Date(oneMonthAgo));
  const [endDate, setEndDate] = useState(new Date(today));

  //지원 내역 및 상태
  const [filteredList, setFilteredList] = useState([]);
  const [stats, setStats] = useState({
    applied: 0,
    viewed: 0,
    unviewed: 0,
    canceled: 0,
  });

  //API 호출 (미열람 지원 내역만 가져오기)
  const fetchApplications = async () => {
    const formattedStart = formatDateLocal(startDate);
    const formattedEnd = formatDateLocal(endDate);

    console.log("📌 요청 startDate:", formattedStart);
    console.log("📌 요청 endDate:", formattedEnd);

    try {
      // 미열람 상태만 요청
      const data = await applyStatus(formattedStart, formattedEnd, "미열람");
      console.log("📌 API 응답 데이터:", data);

      if (data && Array.isArray(data.applications)) {
        setFilteredList(data.applications);
        setStats(data.statusCounts || { applied: 0, viewed: 0, unviewed: 0, canceled: 0 });
      } else {
        console.warn("⚠️ 지원 내역 데이터가 없습니다.");
        setFilteredList([]);
        setStats({ applied: 0, viewed: 0, unviewed: 0, canceled: 0 });
      }
    } catch (error) {
      console.error("❌ 지원 내역 API 호출 오류:", error);
    }
  };

  //날짜 변경 시 API 호출
  useEffect(() => {
    if (startDate && endDate) {
      fetchApplications();
    }
  }, [startDate, endDate]);

  //지원 취소
  const handleCancel = async (applicationId) => {
    try {
      await cancelApplication(applicationId);
      fetchApplications();
    } catch (error) {
      console.error("지원 취소 오류:", error);
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
                <h4 className="title">지원 현황</h4>
                <p className="subTitle">내가 지원한 채용 공고 중 미열람된 내역을 확인하세요</p>

                {/* 📌 날짜 선택 박스 */}
                <div className="datepickerBox">
                  <div className="box">
                    <label htmlFor="datepicker01">
                      <DatePicker
                        id="datepicker01"
                        selected={startDate}
                        onChange={(date) => date && setStartDate(date)}
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
                        onChange={(date) => date && setEndDate(date)}
                        minDate={startDate}
                      />
                      <img src={CalendarIcon} alt="달력아이콘" />
                    </label>
                  </div>
                </div>

                {/* 📌 지원 상태 카운트 */}
                <ul className={style.infoList}>
                  <li><span>지원완료</span><em>{stats.applied}</em></li>
                  <li><span>열람</span><em>{stats.viewed}</em></li>
                  <li><span>미열람</span><em>{stats.unviewed}</em></li>
                  <li><span>지원취소</span><em>{stats.canceled}</em></li>
                </ul>

                {/* 📌 지원 내역 리스트 */}
                <ul className={style.applyList}>
                  {filteredList.length > 0 ? (
                    filteredList.map(({ applicationId, employId, companyName, employTitle, appliedAt, status }) => (
                      <li key={applicationId}>
                        <Link to={`/employment-detail/${employId}`} className={style.topBox}>
                          <span className={style.receipt}>접수마감</span>
                          <div className={style.textBox}>
                            <em>{companyName}</em>
                            <h5>{employTitle}</h5>
                          </div>
                        </Link>
                        <div className={style.dateBox}>
                          <span>지원일</span>
                          <em className={style.date}>{new Date(appliedAt).toLocaleDateString()}</em>
                          <span className={style.viewingDate}>{status}</span>
                        </div>
                        <div className={style.buttonBox}>
                          <button className={style.delBtn} onClick={() => handleCancel(applicationId)}>
                            지원 취소
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className={style.noData}>미열람된 지원 내역이 없습니다.</p>
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
