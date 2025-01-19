export default function Input({ id, type, placeholder, hiddenText, value, onChange }) {

  return (
    <>
      <label htmlFor={id}>
        <span className="blind">
          {hiddenText}
        </span>
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  )

}