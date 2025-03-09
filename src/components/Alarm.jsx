import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./Alarm.module.css";
import Loading from "./Loading";
import { 
  getNotifications, 
  markAllNotificationsAsRead, 
  markNotificationAsRead,
  getNotificationDetail
} from "../api/notifications/notifications";

export default function Alarm({ alarmOpen, setAlarmOpen, className }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
            // 새로운 알림이 위에 추가됨
            return [...newNotifications, ...prevNotifications];
          });
        }
      } catch (error) {
        console.error("error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // 최초 실행
    fetchNotifications();

    // 주기적으로 알림 확인 (예: 10초마다)
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // 알림 클릭 시 읽음 처리 및 상세 페이지로 이동
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
      setAlarmOpen(false); // 알림 모달 닫기 (옵션)
      // 상세 데이터를 state로 전달하며 상세 페이지로 이동
      navigate(`/notification/${notificationId}`, { state: { detail: detailResponse.data } });
    }
  };

  // "모두 읽음" 버튼 클릭 시 전체 알림 읽음 처리
  const handleMarkAllAsRead = async () => {
    const response = await markAllNotificationsAsRead();
    if (response && response.result === "success") {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    }
  };

  return (
    <div className={`${className} ${style.alarmWrap} ${alarmOpen ? style.active : ""}`}>
      <h3>알림</h3>
      <div className={style.alarmListBox}>
        <div className={style.alarmList}>
          {isLoading ? (
            <Loading />
          ) : notifications.length === 0 ? (
            <p className={style.infoText}>새로운 알림이 없습니다.</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.notification_id} className={style.alarmBox}>
                <Link
                  to={`/notification/${notification.notification_id}`}
                  className={notification.is_read ? "" : style.noRead}
                  onClick={(e) =>
                    handleNotificationClick(e, notification.notification_id)
                  }
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
  );
}
