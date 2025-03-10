import ReactDOM from "react-dom";
import { useEffect, useState } from "react";

export default function AlarmPopup({ data, onClose }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (data) {
      setTimeout(() => setIsActive(true), 10);
    } else {
      setIsActive(false);
    }
  }, [data]);

  if (!data) return null;

  return ReactDOM.createPortal(
    <div className={`alarmPopupWrap ${isActive ? "active" : ""}`} onClick={onClose}>
      <div className="alarmPopupBox" onClick={(e) => e.stopPropagation()}>
        <h4>제목 : {data.title}</h4>
        <p className="content">내용 : {data.content}</p>
        <p className="date">날짜 : {new Date(data.created_at).toLocaleDateString("ko-KR")}</p> {/* 날짜만 출력 */}
        <button className="closeBtn" onClick={onClose}>
          <span className="blind">닫기</span>
        </button>
      </div>
    </div>,
    document.body
  );
}
