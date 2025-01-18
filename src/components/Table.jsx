import { Link } from "react-router-dom";
import style from "./Table.module.css";

export default function Table({ href, data, className }) {

  return (
    <div className={style.tableBox}>
      <table className={style.table}>
        <caption className="blind">
          공지사항
        </caption>
        <colgroup>
          <col style={{ width: "100px" }} />
          <col style={{ width: "90px" }} />
          <col style={{ width: "auto" }} />
          <col style={{ width: "150px" }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              NO.
            </th>
            <th>
              구분
            </th>
            <th>
              제목
            </th>
            <th>
              등록일
            </th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((noticeData, index) => {
              return (
                <tr key={index}>
                  <td>
                    {noticeData.id}
                  </td>
                  <td>
                    {noticeData.category}
                  </td>
                  <td>
                    <Link to={`${href}/${noticeData.id}`} className={className}>
                      {noticeData.title}
                    </Link>
                  </td>
                  <td>
                    {noticeData.date}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )

}