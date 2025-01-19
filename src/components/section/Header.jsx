import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import Container from "../Container"
import style from "./Header.module.css"
import Logo from "../../assets/images/common/logo.svg";
import Alarm from "../Alarm";

export default function Header() {

  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isalarmOpen, setIsAlarmOpen] = useState(false);
  const [user] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const getActiveClass = (path) => {
    return location.pathname === path ? `${style.active}` : '';
  };

  // 최근 검색어 목록 로딩
  const loadRecentSearches = () => {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    return recentSearches;
  };

  // 검색어 추가
  const addRecentSearch = (newSearch) => {
    let recentSearches = loadRecentSearches();

    // 검색어가 이미 목록에 있으면 제거하고 다시 추가
    recentSearches = recentSearches.filter(search => search !== newSearch);
    recentSearches.unshift(newSearch);

    // 최근 검색어가 최대 5개까지만 저장되도록 설정
    if (recentSearches.length > 5) {
      recentSearches = recentSearches.slice(0, 5);
    }

    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  };

  // 최근 검색어 삭제
  const handleKeywordDelete = (keyword) => {
    let recentSearches = loadRecentSearches();
    recentSearches = recentSearches.filter(search => search !== keyword);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  };


  // 검색어 입력 시 상태 변경
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 엔터키 입력 시 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      if (searchQuery.trim()) {
        addRecentSearch(searchQuery.trim());
        navigate(`/search?query=${searchQuery}`);
      }
    }
  };

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
                <Link to="/" className={getActiveClass('/')}>
                  홈
                </Link>
              </li>
              <li>
                <Link to="#" className={getActiveClass('/career')}>
                  커리어
                </Link>
              </li>
              <li>
                <Link to="/employment" className={getActiveClass('/employment')}>
                  채용
                </Link>
              </li>
              <li>
                <Link to="#" className={getActiveClass('/community')}>
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link to="/notice" className={getActiveClass('/notice')}>
                  고객지원
                </Link>
              </li>
            </ul>
          </nav>

          <div className={style.linkBox}>
            <div className={`${style.searchBox} ${isSearchOpen ? `${style.active}` : ""}`}>
              <Link to="#" className={style.searchBtn} onClick={() => setIsSearchOpen(true)}>
                <span className="blind">
                  검색
                </span>
              </Link>


              <div className={`${style.searchTextBox} ${isSearchOpen ? `${style.active}` : ""}`}>
                <div
                  className={style.searchInputBox}
                >
                  <label htmlFor="search" className="blind">
                    검색
                  </label>
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown} // 엔터키 눌렀을 때 검색 실행
                  />

                  <button
                    className={`${style.searchTextDel} 
                    ${searchQuery.length > 0 ? `${style.active}` : ""}`}
                    type="button"
                    onClick={() => { setSearchQuery('') }}
                  >
                    <span className="blind">
                      입력삭제
                    </span>
                  </button>
                </div>

                <div className={style.searchKeywordBox}>
                  <span className={style.keywordText}>최근 검색 키워드</span>
                  <ul className={style.keywordList}>
                    {loadRecentSearches().map((keyword, index) => (
                      <li key={index}>
                        <span>{keyword}</span>
                        <button
                          className={style.keywordDelBtn}
                          onClick={() => handleKeywordDelete(keyword)}
                        >
                          <span className="blind">키워드삭제</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className={style.alarmBox}>
              <button
                className={style.alarmBtn}
                onClick={() => setIsAlarmOpen(true)}
              >
                <span className="blind">
                  알림
                </span>
              </button>

              <Alarm isalarmOpen={isalarmOpen} setIsAlarmOpen={setIsAlarmOpen} />

            </div>

            <div className={style.loginBox}>
              {user ? (
                <Link to="/mypage">
                  <img src={user.profileImg} alt="" />
                </Link>  // 사용자 정보가 있으면 마이페이지 링크
              ) : (
                <Link to="/signin" className={style.loginBtn}>로그인</Link>  // 없으면 로그인 버튼
              )}
            </div>

          </div>

          <button className={style.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(true)}>
            <em></em>
            <em></em>
            <span className="blind">모바일메뉴</span>
          </button>

        </div>
      </Container>

      <div className={`${style.mobileMenuBox} ${isMobileMenuOpen ? `${style.active}` : ""}`}>

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
              <Link to="/" className={getActiveClass('/')}>
                홈
              </Link>
            </li>
            <li>
              <Link to="#" className={getActiveClass('/career')}>
                커리어
              </Link>
            </li>
            <li>
              <Link to="/employment" className={getActiveClass('/employment')}>
                채용
              </Link>
            </li>
            <li>
              <Link to="#" className={getActiveClass('/community')}>
                커뮤니티
              </Link>
            </li>
            <li>
              <Link to="/notice" className={getActiveClass('/notice')}>
                고객지원
              </Link>
            </li>
          </ul>
        </nav>

        <div className={style.linkBox}>
          <div className={style.searchBox}>
            <Link to="#" className={style.searchBtn} onClick={() => setIsSearchOpen(true)}>
              <span className="blind">
                검색
              </span>
            </Link>
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

        <div className={`${style.searchTextBox} ${isSearchOpen ? `${style.active}` : ""}`}>
          <div
            className={style.searchInputBox}
          >
            <label htmlFor="search" className="blind">
              검색
            </label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // 엔터키 눌렀을 때 검색 실행
            />
          </div>
        </div>

        <button className={style.mobileCloseBtn} onClick={() => setIsMobileMenuOpen(false)}>
          <span className="blind">
            모바일 메뉴 닫기
          </span>
        </button>

      </div>

      <div className={`${style.bg} ${isMobileMenuOpen ? `${style.active}` : ""}`}></div>

    </header >
  )

}