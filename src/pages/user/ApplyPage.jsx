import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../assets/images/sub/Calendar_Icon.svg";
import style from "./ApplyPage.module.css";
import { applyStatus, cancelApplication, deleteApplication } from "../../api/user/applystatus/applyStatus .js";

export default function ApplyPage() {

  const navigate = useNavigate();

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(oneMonthAgo);
  const [endDate, setEndDate] = useState(today);
  const [filteredList, setFilteredList] = useState([]);
  const [stats, setStats] = useState({
    applied: 0,
    viewed: 0,
    unviewed: 0,
    canceled: 0,
  });

  const fetchApplications = async () => {
    const data = await applyStatus(startDate, endDate);
    if (data?.result === "success") {
      setFilteredList(data.applications.slice(0, 5));
      setStats(data.statusCounts);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [startDate, endDate]);

  const handleCancel = async (applicationId) => {
    await cancelApplication(applicationId);
    fetchApplications();
  };

  const handleDelete = async (applicationId) => {
    await deleteApplication(applicationId);
    fetchApplications();
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

                <div className="datepickerBox">
                  <div className="box">
                    <label htmlFor="datepicker01">
                      <DatePicker
                        id="datepicker01"
                        selected={startDate}
                        onChange={setStartDate}
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
                        onChange={setEndDate}
                        minDate={startDate}
                      />
                      <img src={CalendarIcon} alt="달력아이콘" />
                    </label>
                  </div>
                </div>

                <ul className={style.infoList}>
                  <li><span>지원완료</span><em>{stats.applied}</em></li>
                  <li><span>열람</span><em>{stats.viewed}</em></li>
                  <li><span>미열람</span><em>{stats.unviewed}</em></li>
                  <li><span>지원취소</span><em>{stats.canceled}</em></li>
                </ul>

                <ul className={style.applyList}>
                  {filteredList.map(({ applicationId, employId, companyName, employTitle, deadline, appliedAt, status }) => (
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
                        <em className={style.date}>{new Date(appliedAt).toLocaleDateString()}</em>
                        <span className={style.viewingDate}>{status}</span>
                      </div>
                      <div className={style.buttonBox}>
                        <button className={style.delBtn} onClick={() => handleCancel(applicationId)}>지원 취소</button>
                        {/* <button className={style.delBtn} onClick={() => handleDelete(applicationId)}>삭제</button> */}
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