import style from "./Message.module.css";
import ProfileImg from "../assets/images/common/Profile_Img.svg";

export default function Message({ id, hiddenText, placeholder, onChange, onClick, onEnter }) {

  return (
    <div className={style.messageInput}>
      <div className={style.layoutBox}>
        <div className={style.imgBox}>
          <img src={ProfileImg} alt="" />
        </div>
        <div className={style.textareaBox}>
          <label htmlFor={id} className="blind">{hiddenText}</label>
          <textarea
            id={id}
            onChange={onChange}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (onEnter) onEnter();
              }
            }}
          />
        </div>
      </div>

      <button
        className={style.messageBtn}
        onClick={onClick}

      >
        <span className="blind">
          전송
        </span>
      </button>
    </div>
  )

}