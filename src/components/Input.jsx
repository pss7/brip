import style from "./Input.module.css";

export default function Input({ label, id, type, placeholder, value, onChange, children }) {

  return (
    <>
      {

        label && <label htmlFor={id}>
          {label}
        </label>

      }

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {children}

    </>

  )

}