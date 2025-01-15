import { Link } from "react-router-dom"
import Container from "../Container"
import style from "./Header.module.css"
import Logo from "../../assets/images/common/logo.svg";
import { useState } from "react";

export default function Header() {

  const [isMobileMenu, setIsMobileMenu] = useState(false);

  return (
    <header id={style.headerBox}>
      <Container>
        <div className={style.headerContent}>

          <div className={style.logoBox}>
            <h1>
              <Link to="/">
                <img src={Logo} alt="BRIP" />
              </Link>
            </h1>
          </div>

          <nav className={style.navBox}>
            <ul>
              <li>
                <Link>
                  홈
                </Link>
              </li>
              <li>
                <Link>
                  커리어
                </Link>
              </li>
              <li>
                <Link>
                  채용
                </Link>
              </li>
              <li>
                <Link>
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link>
                  고객지원
                </Link>
              </li>
            </ul>
          </nav>

          <div className={style.linkBox}>
            <div className={style.searchBox}>
              <button className={style.searchBtn}>
                <span className="blind">
                  검색
                </span>
              </button>

              <form>
              <div className={style.searchTextBox}>
                <div className={style.searchInputBox}>
                  <label htmlFor="search" className="blind">
                    검색
                  </label>
                  <input id="search" type="text" />
                </div>

                <div className={style.searchKeywordBox}>
                  <span className={style.keywordText}>
                    최근 검색 키워드
                  </span>
                  <ul className={style.keywordList}>
                    <li>
                      <span>
                        해운
                      </span>
                      <button className={style.keywordDelBtn}>
                        <span className="blind">키워드삭제</span>
                      </button>
                    </li>
                    <li>
                      <span>
                        여객
                      </span>
                      <button className={style.keywordDelBtn}>
                        <span className="blind">키워드삭제</span>
                      </button>
                    </li>
                    <li>
                      <span>
                        운송
                      </span>
                      <button className={style.keywordDelBtn}>
                        <span className="blind">키워드삭제</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </form>

            </div>

            <div className={style.alarmBox}>
              <button className={style.alarmBtn}>
                <span className="blind">
                  알림
                </span>
              </button>
            </div>

            <div className={style.loginBox}>
              <Link to="/signin" className={style.loginBtn}>
                로그인
              </Link>
            </div>
          </div>

          <button className={style.mobileMenuBtn} onClick={() => setIsMobileMenu(true)}>
            <em></em>
            <em></em>
            <span className="blind">모바일메뉴</span>
          </button>

        </div>
      </Container>

      <div className={`${style.mobileMenuBox} ${isMobileMenu ? `${style.active}` : ""}`}>

        <div className={style.mobileLogoBox}>
          <h1>
            <Link to="/">
              <img src={Logo} alt="BRIP" />
            </Link>
          </h1>
        </div>

        <nav className={style.mobileNav}>
          <ul>
            <li>
              <Link to="#">
                홈
              </Link>
            </li>
            <li>
              <Link to="#">
                커리어
              </Link>
            </li>
            <li>
              <Link to="#">
                채용
              </Link>
            </li>
            <li>
              <Link to="#">
                커뮤니티
              </Link>
            </li>
            <li>
              <Link to="#">
                고객지원
              </Link>
            </li>
          </ul>
        </nav>

        <div className={style.linkBox}>
          <div className={style.searchBox}>
            <button className={style.searchBtn}>
              <span className="blind">
                검색
              </span>
            </button>






 







          </div>

          <div className={style.alarmBox}>
            <button className={style.alarmBtn}>
              <span className="blind">
                알림
              </span>
            </button>
          </div>

          <div className={style.loginBox}>
            <Link to="/signin" className={style.loginBtn}>
              로그인
            </Link>
          </div>
        </div>

        <button className={style.mobileCloseBtn} onClick={() => setIsMobileMenu(false)}>
          <span className="blind">
            모바일 메뉴 닫기
          </span>
        </button>

      </div>

      <div className={`${style.bg} ${isMobileMenu ? `${style.active}` : ""}`}></div>

    </header >
  )

}