import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./Alarm.module.css";
import { getNotifications } from "../api/notifications/get";
import { markNotificationAsRead } from "../api/notifications/markRead";

export default function Alarm({ isalarmOpen, setIsAlarmOpen, className }) {

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    async function fetchNotifications() {
      setIsLoading(true);
      const response = await getNotifications();
      if (response && response.result === "success") {
        setNotifications(response.data);
      }
      setIsLoading(false);
    }

    if (isalarmOpen) {
      fetchNotifications();
    }

  }, [isalarmOpen]);

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

  return (
    <div className={`${className} ${style.alarmBox}  ${isalarmOpen ? `${style.active}` : ""}`}>

      <h3>알림</h3>

      <div className={style.alarmListBox}>
        <ul className={style.alarmList}>
          {isLoading ? (
            <li>로딩 중...</li>
          ) : notifications.length === 0 ? (
            <li>새로운 알림이 없습니다.</li>
          ) : (
            notifications.map((notification) => (
              <li key={notification.notification_id}>
                <Link
                  to={`/notification/${notification.notification_id}`}
                  className={notification.is_read ? `${style.read}` : ""}
                  onClick={() => handleMarkAsRead(notification.notification_id)}
                >
                  <p className={style.title}>{notification.title}</p>
                  <p className={style.content}>{notification.content}</p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>

      <button className={style.alarmChk}>
        <span>모두 읽음</span>
      </button>

      <button
        className={style.alarmClose}
        onClick={() => setIsAlarmOpen(false)}
      >
        <span className="blind">알림 닫기</span>
      </button>
    </div>
  );
}
