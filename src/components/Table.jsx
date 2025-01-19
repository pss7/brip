import { Link } from "react-router-dom";
import style from "./Table.module.css";

export default function Table({ caption, href, data, className, children, showStatus = false }) {

  return (
    <div className={style.tableBox}>
      <table className={style.table}>
        <caption className="blind">
          {caption}
        </caption>
        {children}
        <tbody>
          {
            data.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{data.id}</td>
                  <td>{data.category}</td>
                  <td>
                    <Link to={`${href}/${data.id}`} className={className}>
                      {data.title}
                    </Link>
                  </td>
                  {showStatus && <td><span className={`${style.status} ${data.status === "답변완료" ? `${style.complete}` : ""}`}>{data.status}</span></td>}
                  <td>{data.date}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )

}