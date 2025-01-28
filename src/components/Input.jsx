import "./Input.module.css";

export default function Input({ title, label, id, type, placeholder, value, onChange, children, className }) {

  return (
    <>
      {

        label && <label htmlFor={id} className={className}>
          {label}
        </label>

      }

      <input
        title={title}
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