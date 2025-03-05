import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../assets/images/sub/Calendar_Icon.svg";
import style from "./ApplyPage.module.css";
import { useAuthStore } from "../../store/useAuthStore.js";
import { applyStatus } from "../../api/user/applystatus/applyStatus .js";

export default function ApplyPage() {

  const navigate = useNavigate();
  const { token } = useAuthStore();

  // 오늘 날짜 & 한 달 전 날짜 기본값 설정
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(oneMonthAgo);
  const [endDate, setEndDate] = useState(today);
  const [selectedStatus, setSelectedStatus] = useState("지원완료"); // 기본 상태: 지원완료
  const [filteredList, setFilteredList] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    viewed: 0,
    notViewed: 0,
    cancelled: 0,
  });

  // API에서 지원 내역 가져오기 (선택된 상태 반영)
  const fetchApplications = async () => {
    if (!token) return;

    const data = await applyStatus(token, startDate, endDate, selectedStatus);
    if (data && data.result === "success") {
      setFilteredList(data.applications.slice(0, 5)); // 최대 5개 표시
    }
  };

  // 날짜 또는 상태 변경 시 API 호출
  useEffect(() => {
    fetchApplications();
  }, [startDate, endDate, selectedStatus, token]);

  // 지원 상태별 카운트 계산
  useEffect(() => {
    const counts = { completed: 0, viewed: 0, notViewed: 0, cancelled: 0 };
    filteredList.forEach((item) => {
      switch (item.applicationStatus) {
        case "지원완료":
          counts.completed++;
          break;
        case "열람":
          counts.viewed++;
          break;
        case "미열람":
          counts.notViewed++;
          break;
        case "지원취소":
          counts.cancelled++;
          break;
        default:
          break;
      }
    });

    setStats(counts);
  }, [filteredList]);

  if (!token) {
    navigate("/signin");
    return null;
  }

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

                {/* 날짜 선택기 */}
                <div className="datepickerBox">
                  <div className="box">
                    <label htmlFor="datepicker01">
                      <DatePicker
                        id="datepicker01"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
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
                        onChange={(date) => setEndDate(date)}
                        minDate={startDate}
                      />
                      <img src={CalendarIcon} alt="달력아이콘" />
                    </label>
                  </div>
                </div>

                {/* 상태 카운트 */}
                <ul className={style.infoList}>
                  <li><span>지원완료</span><em>{stats.completed}</em></li>
                  <li><span>열람</span><em>{stats.viewed}</em></li>
                  <li><span>미열람</span><em>{stats.notViewed}</em></li>
                  <li><span>지원취소</span><em>{stats.cancelled}</em></li>
                </ul>

                {/* 지원 리스트 */}
                <ul className={style.applyList}>
                  {filteredList.map((item) => (
                    <li key={item.id}>
                      <Link to={`/employmentdetail/${item.employmentId}`} className={style.topBox}>
                        <span className={style.receipt}>접수마감</span>
                        <div className={style.textBox}>
                          <em>{item.companyName}</em>
                          <h5>{item.jobTitle}</h5>
                        </div>
                      </Link>
                      <div className={style.dateBox}>
                        <span>지원일</span>
                        <em className={style.date}>{item.applicationDate}</em>
                        <span className={style.viewingDate}>
                          {item.viewDate ? `열람 ${item.viewDate}` : "열람 안함"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
