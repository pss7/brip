import style from "./ViewButton.module.css";

export default function ViewButton({ handleToggle, data, className, onEdit, onDelete }) {
  return (
    <div className={`${className} ${style.viewBox}`}>
      <button
        className={style.viewBtn}
        onClick={() => handleToggle(data.resume_id)} // ✅ resume_id 직접 사용
      >
        <span className="blind">수정, 삭제 더보기 버튼</span>
      </button>

      {data.isActionsVisible && (
        <div className={style.btnBox}>
          <button className={style.editBtn} onClick={() => onEdit(data.resume_id)}>
            수정
          </button>
          <button className={style.delbtn} onClick={() => onDelete(data.resume_id)}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
