import style from "./Button.module.css";

export default function Button({ text, customClass, href, type }) {

  function handleClick() {

    if (href) {
      window.location.href = href
    }

  }

  return (
    <button onClick={handleClick} className={`${style.btn} ${customClass}`} type={type}>
      {text}
    </button>
  )

}