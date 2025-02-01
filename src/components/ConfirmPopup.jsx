import style from "./ConfirmPopup.module.css";

export default function ConfirmPopup({
  message,
  subMessage,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}) {
  return (
    <div className={style.popupWrap}>
      <div className={style.popupContent}>
        <div className={style.popupTop}>
          <p className={style.title}>{message}</p>
          <p className={style.subText}>{subMessage}</p>
        </div>
        <div className={style.popupBottom}>
          <div className={style.btnBox}>
            <button className={style.btn} onClick={onCancel}>
              {cancelText}
            </button>
            <button className={`${style.btn} ${style.confirmBtn}`} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
        <button className={style.closeBtn} onClick={onCancel}>
          <span className="blind">팝업닫기</span>
        </button>
      </div>
    </div>
  );
}
