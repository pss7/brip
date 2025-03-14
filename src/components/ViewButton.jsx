import style from "./ViewButton.module.css";

export default function ViewButton({ handleToggle, data, className, onEdit, onDelete, idKey = "resume_id" }) {
  return (
    <div className={`${className} ${style.viewBox}`}>
      <button
        className={style.viewBtn}
        onClick={() => handleToggle(data[idKey])}
      >
        <span className="blind">수정, 삭제 더보기 버튼</span>
      </button>

      {data.isActionsVisible && (
        <div className={style.btnBox}>
          <button className={style.editBtn} onClick={() => onEdit(data[idKey])}>
            수정
          </button>
          <button className={style.delbtn} onClick={() => onDelete(data[idKey])}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
