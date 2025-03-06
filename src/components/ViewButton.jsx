import style from "./ViewButton.module.css";

export default function ViewButton({ handleToggle, data, idKey, className, onEdit, onDelete }) {
  return (
    <div className={`${className} ${style.viewBox}`}>
      <button
        className={style.viewBtn}
        onClick={() => handleToggle(data[idKey])} // ✅ resume_id 또는 post_id 동적으로 사용
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
