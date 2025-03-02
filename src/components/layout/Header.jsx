import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import Container from "../Container"
import style from "./Header.module.css"
import Logo from "../../assets/images/common/logo.svg";
import ProfileImg from "../../assets/images/common/Profile_Img.svg";
import Alarm from "../Alarm";
import { useAuthStore } from "../../store/useAuthStore";
import { logout } from "../../api/auth";

export default function Header() {

  //유저정보 불러오기
  const { token } = useAuthStore((state) => {
    return (
      state
    )
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [isHeaderAnimation, isSetHeaderAnimation] = useState(false);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isalarmOpen, setIsAlarmOpen] = useState(false);

  //마이페이지 모달 상태 관리
  const [mypageOpen, setMypageOpen] = useState(false);

  //로그아웃 함수
  async function handleLogout() {
    try {
      const response = await logout();
      if (response) {
        console.log("로그아웃 성공");
        // 새로고침
        window.location.reload();
      } else {
        console.log("로그아웃 실패");
      }
    } catch (error) {
      console.error('error:', error);
    }
  }

  function getActiveClass(path) {
    return location.pathname === path ? `${style.active}` : '';
  };

  // 로컬 스토리지에서 최근 검색어 목록 불러오기
  function loadRecentSearches() {
    return JSON.parse(localStorage.getItem('recentSearches')) || [];
  }

  // 최근 검색어 목록 업데이트
  function updateRecentSearches(newSearches) {
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    setRecentSearches(newSearches);
  };

  // 검색어 추가
  function addRecentSearch(newSearch) {
    let updatedSearches = recentSearches.filter(search => search !== newSearch);
    updatedSearches.unshift(newSearch);

    // 최대 5개까지만 저장
    if (updatedSearches.length > 5) {
      updatedSearches = updatedSearches.slice(0, 5);
    }

    updateRecentSearches(updatedSearches);
  };

  // 최근 검색어 삭제
  function handleKeywordDelete(keyword) {
    const updatedSearches = recentSearches.filter(search => search !== keyword);
    updateRecentSearches(updatedSearches);
  };

  // 검색어 입력 시 상태 변경
  function handleChange(e) {
    setSearchQuery(e.target.value);
  };

  // 엔터키 입력 시 검색 실행
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      if (searchQuery.trim()) {
        addRecentSearch(searchQuery.trim());
        navigate(`/search?query=${searchQuery}`);
      }
    }
  };

  useEffect(() => {

    isSetHeaderAnimation(true);

  }, [])

  return (
    <header id={style.headerBox} className={isHeaderAnimation && `${style.active}`}>
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
                <Link to="/career" className={getActiveClass('/career')}>
                  커리어
                </Link>
              </li>
              <li>
                <Link to="/employment" className={getActiveClass('/employment')}>
                  채용
                </Link>
              </li>
              <li>
                <Link to="/community" className={getActiveClass('/community')}>
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
              <Link className={style.searchBtn} onClick={() => setIsSearchOpen(!isSearchOpen)}>
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
              {token ? (

                <>
                  <button
                    className={style.mypageBtn}
                    onClick={() => setMypageOpen(true)}
                  >
                    <img src={ProfileImg} alt="프로필이미지" />
                  </button>
                  <div className={`${style.mypageBox} ${mypageOpen ? `${style.active}` : ""}`}>
                    <h3>
                      My Page
                    </h3>
                    <div className={style.userInfo}>
                      <p className={style.name}>
                        홍길동좌
                      </p>
                      <span className={style.email}>qwer12@naver.com</span>
                    </div>

                    <ul className={style.mypageLinkList}>
                      <li>
                        <Link to="/mypage">
                          내 계정정보
                        </Link>
                      </li>

                      <li>
                        <Link to="/interest">
                          관심공고
                        </Link>
                      </li>

                      <li>
                        <Link to="/resume">
                          이력서 관리
                        </Link>
                      </li>

                      <li>
                        <Link to="/apply">
                          지원현황
                        </Link>
                      </li>
                      <li>
                        <Link to="/activity">
                          내 활동
                        </Link>
                      </li>
                    </ul>

                    <button
                      className={style.logout}
                      onClick={handleLogout}
                    >
                      로그아웃
                    </button>

                    <button
                      className={style.closeBtn}
                      onClick={() => setMypageOpen(false)}
                    >
                      <span className="blind">
                        Mypage 닫기
                      </span>
                    </button>
                  </div>
                </>

              ) : (
                <Link to="/signin" className={style.loginBtn}>로그인</Link>
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
              <Link to="/career" className={getActiveClass('/career')}>
                커리어
              </Link>
            </li>
            <li>
              <Link to="/employment" className={getActiveClass('/employment')}>
                채용
              </Link>
            </li>
            <li>
              <Link to="/community" className={getActiveClass('/community')}>
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
            <Link
              to="#"
              className={style.searchBtn}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
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
            {token ? (
              <Link to="/mypage">
                <img src={ProfileImg} alt="프로필이미지" />
              </Link>
            ) : (
              <Link
                to="/signin"
                className={style.loginBtn}>
                로그인
              </Link>
            )}
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