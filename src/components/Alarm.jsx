import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./Alarm.module.css";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../api/notifications/notifications";
import Loading from "./Loading";

export default function Alarm({ alarmOpen, setAlarmOpen, className }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
            return [...newNotifications, ...prevNotifications]; // 새로운 알림이 위에 추가됨
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
  
    // 주기적으로 알림을 확인 (예: 10초마다)
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000); // 10초마다 실행
  
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);
  

  // 알림 클릭 시 읽음 처리 함수
  const handleMarkAsRead = async (notificationId) => {
    const response = await markNotificationAsRead(notificationId);
    if (response && response.result === "success") {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
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
                  onClick={() => {
                    handleMarkAsRead(notification.notification_id);
                    setAlarmOpen(false); // 알림 클릭 후 모달 닫기 (옵션)
                  }}
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
