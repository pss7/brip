import style from "./Button.module.css";
import { useNavigate } from "react-router-dom";

export default function Button({ text, customClass, href }) {
  
  const navigate = useNavigate();

  function handleClick() {

    navigate(href); 


  }
  return (
    <button onClick={handleClick} className={`${style.btn} ${customClass}`}>
      {text}
    </button>
  )

}