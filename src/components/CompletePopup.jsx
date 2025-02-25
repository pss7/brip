import style from "./CompletePopup.module.css";
import CompleteIcon from "../assets/images/common/CompleteIcon.svg";
import ErrorIcon from "../assets/images/common/ErrorIcon.svg";
import { useEffect, useState } from "react";

export default function CompletePopup({ isOpen, message, error, onClose }) {

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
        {
          error ?
            <div className={style.imgBox}>
              <img src={ErrorIcon} alt="" />
            </div>
            :
            <div className={style.imgBox}>
              <img src={CompleteIcon} alt="" />
            </div>
        }
        <p>
          {message}
        </p>
        <div className={style.btnBox}>
          <button className={style.btn} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  )

}