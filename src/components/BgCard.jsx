import { Link } from "react-router-dom";
import style from "./BgCard.module.css"

export default function BgCard({ title, imgSrc, bg, imgBg }) {

  return (
    <Link to="#" className={`cardBox ${style.link}`} style={bg}>
      <div className={style.imgBox} style={imgBg}>
        <img src={imgSrc} alt="" />
      </div>
      <h4>
        {title}
      </h4>
    </Link>
  )


}