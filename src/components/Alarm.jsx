import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./Alarm.module.css";
import Loading from "./Loading";
import AlarmPopup from "./AlarmPopup"; // 팝업 컴포넌트 추가
import { 
  getNotifications, 
  markAllNotificationsAsRead, 
  markNotificationAsRead,
  getNotificationDetail
} from "../api/notifications/notifications";

export default function Alarm({ alarmOpen, setAlarmOpen, className }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [popupData, setPopupData] = useState(null); // 팝업 데이터 관리
  const [popupActive, setPopupActive] = useState(""); // active 클래스 상태

  // 알림 데이터 불러오기
  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true);
      try {
        const response = await getNotifications();
        if (response && response.result === "success") {
          setNotifications((prevNotifications) => {
            const newNotifications = response.data.filter(
              (newNotification) =>
                !prevNotifications.some(
                  (oldNotification) =>
                    oldNotification.notification_id === newNotification.notification_id
                )
            );
            return [...newNotifications, ...prevNotifications];
          });
        }
      } catch (error) {
        console.error("error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // 알림 클릭 시 팝업 열기 (active 클래스 추가)
  const handleNotificationClick = async (e, notificationId) => {
    e.preventDefault();
  
    // 알림 읽음 처리
    const markResponse = await markNotificationAsRead(notificationId);
    if (markResponse && markResponse.result === "success") {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    }
  
    // 알림 상세 데이터 조회
    const detailResponse = await getNotificationDetail(notificationId);
    if (detailResponse && detailResponse.result === "success") {
      console.log("알림 상세 데이터:", detailResponse.data); // 디버깅용 로그 추가
      setPopupData(detailResponse.data);
      setPopupActive("active"); // 팝업 활성화
    }
  };
  
  // 팝업 닫기 함수 추가
  const handleClosePopup = () => {
    setPopupData(null);
    setPopupActive(""); // 팝업 비활성화
  };

  // "모두 읽음" 버튼 클릭 시 전체 알림 읽음 처리
  const handleMarkAllAsRead = async () => {
    const response = await markAllNotificationsAsRead();
    if (response && response.result === "success") {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, is_read: true }))
      );
    }
  };

  return (
    <>
      {/* 🔹 **팝업을 최상위에서 렌더링 (active 적용)** */}
      {popupData && <AlarmPopup data={popupData} onClose={handleClosePopup} activeClass={popupActive} />}

      <div className={`${className} ${style.alarmWrap} ${alarmOpen ? style.active : ""}`}>
        <h3>알림</h3>
        <div className={style.alarmListBox}>
          <div className={style.alarmList}>
            {isLoading ? (
              <Loading center />
            ) : notifications.length === 0 ? (
              <p className={style.infoText}>새로운 알림이 없습니다.</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.notification_id} className={style.alarmBox}>
                  <Link
                    to="#"
                    className={notification.is_read ? "" : style.noRead}
                    onClick={(e) => handleNotificationClick(e, notification.notification_id)}
                  >
                    <p className={style.title}>{notification.title}</p>
                    <p className={style.content}>{notification.content}</p>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
        <button className={style.alarmChk} onClick={handleMarkAllAsRead}>
          <span>모두 읽음</span>
        </button>
        <button className={style.alarmClose} onClick={() => setAlarmOpen(false)}>
          <span className="blind">알림 닫기</span>
        </button>
      </div>
    </>
  );
}
