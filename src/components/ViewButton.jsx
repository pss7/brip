import style from "./ViewButton.module.css";

export default function ViewButton({ handleToggle, data, className, onEdit, onDelete }) {
  return (
    <div className={`${className} ${style.viewBox}`}>
      <button
        className={style.viewBtn}
        onClick={() => handleToggle(data.id)} // 보기 버튼 클릭 시, 상태 토글
      >
        <span className="blind">수정, 삭제 더보기 버튼</span>
      </button>

      {data.isActionsVisible && (
        <div className={style.btnBox}>
          {/* 수정 버튼 클릭 시 onEdit 함수 호출 */}
          <button className={style.editBtn} onClick={() => onEdit(data.id)}>
            수정
          </button>
          {/* 삭제 버튼 클릭 시 onDelete 함수 호출 */}
          <button className={style.delbtn} onClick={() => onDelete(data.id)}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
