import style from "./Select.module.css";

export default function Select({
  className,
  id,
  hiddenText,
  options = [],
  defaultOption = "선택하세요",
  value = "",
  onChange
}) {

  // value를 직접 상태로 관리하지 않고, 부모가 전달하는 값만 사용
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <>
      <label htmlFor={id} className="blind">
        {hiddenText}
      </label>
      <select
        className={`${className} ${style.select}`}
        id={id}
        value={value} // 🔥 상태를 내부에서 관리하지 않고 외부 값만 사용
        onChange={handleChange}
      >
        <option value="" disabled>
          {defaultOption}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}
