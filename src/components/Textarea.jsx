import React from 'react';
import style from "./Textarea.module.css";

export default function Textarea({ id, value, onChange, placeholder, className, hiddenText }) {
  return (
    <>
      <label htmlFor={id} className="blind">
        {hiddenText}
      </label>
      <textarea
        className={`${className} ${style.textarea}`}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </>
  );
}
