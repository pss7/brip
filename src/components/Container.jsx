import style from './Container.module.css';

export default function Container({ className = '', page = false, children }) {
  const classNames = `${style.container} ${page ? style.page : ''
    } ${className}`;
  return <div className={classNames}>{children}</div>;
}