import { Link } from "react-router-dom";
import style from "./ArrowPrevButton.module.css";

export default function ArrowPrevButton({ href, hiddenText }) {

  return (
    <>
      <Link to={href} className={style.linkbtn}>
        <span className="blind">
          {hiddenText}
        </span>
      </Link>
    </>
  )

}