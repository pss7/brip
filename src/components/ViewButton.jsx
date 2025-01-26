import style from "./ViewButton.module.css";

export default function ViewButton({ handleToggle, data, className }) {

  return (
    <div className={`${className} ${style.viewBox}`}>
      <button
        className={style.viewBtn}
        onClick={() => handleToggle(data.id)}
      >
        <span className="blind">
          수정, 삭제 더보기 버튼
        </span>
      </button>
      {
        data.isActionsVisible && (
          <div className={style.btnBox}>
            <button className={style.editBtn}>
              수정
            </button>
            <button className={style.delbtn}>
              삭제
            </button>
          </div>
        )
      }
    </div>
  )

}