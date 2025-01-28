import style from "./Select.module.css";

export default function Select({ className, id, hiddenText }) {

  return (
    <>
      <label htmlFor={id} className="blind">
        {hiddenText}
      </label>
      <select className={`${className} ${style.select}`} id={id}>
        <option>선택</option>
        <option></option>
        <option></option>
      </select>
    </>
  )

}