import { Link } from "react-router-dom";
import style from "./Pagination.module.css";

export default function Pagination() {

  return (
    <div className={style.paginationBox}>
      <Link to="#" className={`${style.pageLink} ${style.pageLinkPrev}`}>
        <span className="blind">1페이지 뒤로 이동</span>
      </Link>
      <Link to="#" className={`${style.pageLink} ${style.active}`} >
        1
      </Link>
      <Link to="#" className={style.pageLink}>
        2
      </Link>
      <Link to="#" className={style.pageLink}>
        3
      </Link>
      <Link to="#" className={style.pageLink}>
        4
      </Link>
      <Link to="#" className={style.pageLink}>
        5
      </Link>
      <Link to="#" className={`${style.pageLink} ${style.pageLinkNext}  ${style.on}`}>
        <span className="blind">1페이지 앞으로 이동</span>
      </Link>
    </div>
  )

}