import style from "./SubSearch.module.css";

export default function SubSearch() {

  return (
    <div className={style.subSearchBox}>
      <form>
        <div className="inputBox">
          <label htmlFor="search" className="blind">
            검색
          </label>
          <input id="search" type="text" placeholder="직무를 검색해주세요." />
        </div>
      </form>
    </div>
  )

}