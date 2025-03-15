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
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Loading from "../../components/Loading.jsx";

export default function ApplyPage() {

  dayjs.extend(utc);
  const navigate = useNavigate();
  const { token } = useAuthStore();

  // 오늘 날짜 & 한 달 전 날짜 기본값 설정
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(oneMonthAgo);
  const [endDate, setEndDate] = useState(today);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    applied: 0,
    viewed: 0,
    unviewed: 0,
    canceled: 0,
  });

  // 날짜 변경 시 API 호출
  useEffect(() => {

    const fetchApplications = async () => {
      try {
        setLoading(true);
        // endDate에 하루를 추가하여 해당 날짜의 전체를 포함하도록 함
        const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
        const formattedEndDate = dayjs(endDate).add(1, "day").format("YYYY-MM-DD");

        const response = await applyStatus(formattedStartDate, formattedEndDate, { status: "지원완료" });
        if (response.result === "success") {
          setFilteredList(response.applications);
          setStats(response.statusCounts);
        }
      } catch (error) {
        console.error("지원 내역 API 호출 오류:", error);
      } finally {
        setLoading(false);
      }
    };
    if (startDate && endDate) {
      fetchApplications();
    }

  }, [startDate, endDate]);

  // 지원 취소
  const handleCancel = async (applicationId) => {
    try {
      await cancelApplication(applicationId);
      setFilteredList((prev) => prev.filter((app) => app.applicationId !== applicationId));
    } catch (error) {
      console.error("❌ 지원 취소 오류:", error);
    }
  };

  if (!token) {
    navigate("/signin");
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
                <h4 className="title">지원 현황</h4>
                <p className="subTitle">내가 지원한 채용 공고 중 미열람된 내역을 확인하세요</p>

                {/* 날짜 선택 박스 */}
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

                {/* 지원 상태 카운트 */}
                <ul className={style.infoList}>
                  <li><span>지원완료</span><em>{stats.applied}</em></li>
                  <li><span>열람</span><em>{stats.viewed}</em></li>
                  <li><span>미열람</span><em>{stats.unviewed}</em></li>
                  <li><span>지원취소</span><em>{stats.canceled}</em></li>
                </ul>

                {/* 지원 내역 리스트 */}
                {loading ? (
                  <Loading center />
                ) : (
                  <>
                    {filteredList && filteredList.length > 0 ? (
                      <ul className={style.applyList}>
                        {filteredList.map(({ applicationId, employId, companyName, employTitle, appliedAt, status }) => (
                          <li key={applicationId}>
                            <Link to={`/employment-detail/${employId}`} className={style.topBox}>
                              <div className={style.textBox}>
                                <em>{companyName}</em>
                                <h5>{employTitle}</h5>
                              </div>
                            </Link>
                            <div className={style.dateBox}>
                              <span>지원일</span>
                              <em className={style.date}>
                                {dayjs(appliedAt).format("YYYY-MM-DD")}
                              </em>
                              <span className={style.viewingDate}>{status}</span>
                            </div>
                            <div className={style.buttonBox}>
                              <button className={style.delBtn} onClick={() => handleCancel(applicationId)}>
                                지원 취소
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={style.noData}>지원 내역이 없습니다.</p>
                    )}
                  </>
                )}

              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
