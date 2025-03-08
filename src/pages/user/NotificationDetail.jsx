import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import style from "./NotificationDetail.module.css";
import { getNotifications } from "../../api/notifications/notifications";

export default function NotificationDetail() {

  const { notificationId } = useParams();
  const [notification, setNotification] = useState(null);

  useEffect(() => {

    async function fetchNotificationDetail() {

      try {
        const response = await getNotifications();

        if (response && response.result === "success") {
          const notificationDetail = response.data.find(
            (notif) => notif.notification_id === parseInt(notificationId)
          );
          setNotification(notificationDetail);
        }
      } catch (error) {
        console.error("error", error);
      }
    }

    fetchNotificationDetail();
    
  }, [notificationId]);

  if (!notification) {
    return <p>알림을 찾을 수 없습니다.</p>;
  }

  return (
    <div className={style.notificationDetailBox}>
      <h2 className={style.notificationTitle}>{notification.title}</h2>
      <p className={style.notificationContent}>{notification.content}</p>
      <p className={style.notificationDate}>
        {new Date(notification.created_at).toLocaleString()}
      </p>
      <p className={style.readStatus}>
        {notification.is_read ? "읽은 알림" : "읽지 않은 알림"}
      </p>
    </div>
  );
}
