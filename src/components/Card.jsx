import { Link } from "react-router-dom";
import style from "./Card.module.css";


export default function Card({ title, text, imgSrc, subText, children, className }) {

  return (
    <Link to="#" className={`${style.cardBox} ${className ? style[className] : ''}`}>
      <div className={style.imgBox}>
        <div className={style.img}>
          <img src={imgSrc} alt="" />
          {children}
        </div>
      </div>
      <div className={style.textBox}>
        <span className={style.text01}>
          {text}
        </span>
        <h4>
          {title}
        </h4>
        <em className={style.text02}>
          {subText}
        </em>
      </div>
    </Link>
  )

}