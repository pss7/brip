import style from "./Button.module.css";
import { useNavigate } from "react-router-dom";

export default function Button({ type, text, customClass, href, onClick }) {

  const navigate = useNavigate();

  function handleClick() {

    if (onClick) {
      onClick();
    }

    if (href) {
      navigate(href);
    }

  }

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`${style.btn} ${customClass}`}
    >
      {text}
    </button>
  );
}
