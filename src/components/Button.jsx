import style from "./Button.module.css";

export default function Button({ text, customClass }) {

  return (
    <button className={`${style.btn} ${customClass}`}>
      {text}
    </button>
  )

}