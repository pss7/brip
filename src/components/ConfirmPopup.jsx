import { useState, useEffect } from "react";
import style from "./ConfirmPopup.module.css";

export default function ConfirmPopup({
  message,
  subMessage,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
  isOpen
}) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isOpen) {

      setShowPopup(true);
    } else {

      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className={`${style.popupWrap} ${showPopup ? style.active : ""}`}>
      <div className={style.popupContent}>
        <div className={style.popupTop}>
          <p className={style.title}>{message}</p>
          <p className={style.subText}>{subMessage}</p>
        </div>
        <div className={style.popupBottom}>
          <div className={style.btnBox}>
            <button className={style.btn} onClick={onClose}>
              {cancelText}
            </button>
            <button
              className={`${style.btn} ${style.confirmBtn}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
        <button className={style.closeBtn} onClick={onClose}>
          <span className="blind">팝업닫기</span>
        </button>
      </div>
    </div>
  );
}
