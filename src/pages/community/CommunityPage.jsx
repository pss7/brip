import { useEffect, useState } from "react";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import { getCommunityList, reportCommunity, toggleLike } from "../../api/community/community";
import Loading from "../../components/Loading";
import { useLoadingStore } from "../../store/useLoadingStore";
import { Link, useNavigate } from "react-router-dom";
import ProfileImg from "../../assets/images/common/Profile_Img.svg";
import { getProfile } from "../../api/user";
import { useAuthStore } from "../../store/useAuthStore";
import { format } from "date-fns";
import CompletePopup from "../../components/CompletePopup";
import WritePopup from "../../components/WritePopup";

export default function CommunityPage() {
  
  // 경로 이동
  const navigate = useNavigate();

  // 토큰 검사
  const { token } = useAuthStore();
  if (!token) {
    navigate("/signin");
  }

  // 카테고리들
  const categories = ["노하우&Q&A", "실시간채팅", "업종별/연차별", "정보공유"];
  const [selectedCategory, setSelectedCategory] = useState("노하우&Q&A");

  // 팝업 상태
  const [communityPopupOpen, setCommunityPopupOpen] = useState(false);

  // 커뮤니티 데이터, 프로필 데이터
  const [communityData, setCommunityData] = useState([]);
  const [profileData, setProfileData] = useState([]);

  // 로딩 상태
  const { isLoading, setLoading } = useLoadingStore();

  // 신고/완료 팝업
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupError, setPopupError] = useState(false);

  // 카테고리에 맞춰 필터링된 목록
  const filteredData = communityData.filter((data) => data.category === selectedCategory);

  // 1) 커뮤니티 목록 불러오기
  const fetchCommunity = async () => {
    setLoading(true);
    try {
      const response = await getCommunityList({
        page: 0,
        size: 10,
        category: selectedCategory,
      });
      if (response) {
        setCommunityData(response.data);
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };

  // 2) 마운트 + selectedCategory 변경 시 fetch
  useEffect(() => {
    fetchCommunity();
  }, [selectedCategory]);

  // 프로필 불러오기
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const response = await getProfile();
        setProfileData(response.data);
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [setLoading]);

  // 좋아요 토글
  async function handleLike(post_id) {
    const response = await toggleLike(post_id);
    if (response) {
      setCommunityData((prevData) =>
        prevData.map((post) =>
          post.post_id === post_id
            ? {
              ...post,
              heart_count: post.isLiked ? post.heart_count - 1 : post.heart_count + 1,
              isLiked: !post.isLiked,
            }
            : post
        )
      );
    }
  }

  // 신고
  async function handleReport(post_id) {
    const reason = prompt("신고 사유를 입력하세요:");
    if (!reason) {
      setPopupMessage("신고 사유를 입력해야 합니다.");
      setPopupError(true);
      setPopupOpen(true);
      return;
    }

    const response = await reportCommunity(post_id, reason);
    if (response) {
      setPopupMessage("신고가 접수되었습니다.");
      setPopupError(false);
    } else {
      setPopupMessage("신고 처리 중 오류가 발생했습니다.");
      setPopupError(true);
    }

    setPopupOpen(true);
  }

  // 로딩 처리
  if (isLoading) {
    return <Loading fullScreen />;
  }

  // 글쓰기 팝업 등록 성공 시 콜백
  const handlePostSuccess = () => {
    // 팝업 닫기
    setCommunityPopupOpen(false);
    // 다시 목록 fetch → 즉시 갱신
    fetchCommunity();
  };

  return (
    <Main className="subWrap">
      <div className="communityBox">
        <Container className="lnbContainer">
          <div className="communityContent">
            <div className="lnbLayoutBox">
              <aside>
                <div className="infoBox">
                  <div className="imgBox">
                    <img src={ProfileImg} alt="프로필이미지" />
                  </div>
                  <div className="textBox">
                    <p className="nickname">{profileData.nickname}</p>
                    <span className="name">{profileData.name}</span>
                  </div>
                </div>
                <div className="addBtnBox">
                  <button className="addBtn">
                    <span>채팅방 생성</span>
                  </button>
                  <button
                    className="addBtn communityWrite"
                    onClick={() => setCommunityPopupOpen(true)}
                  >
                    <span>커뮤니티 글쓰기</span>
                  </button>
                </div>
              </aside>

              <div className="content">
                <ul className="communityTab">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`tabBtn ${selectedCategory === cat ? "active" : ""}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="shareBox">
                  <div className="imgBox">
                    <img src={ProfileImg} alt="프로필이미지" />
                  </div>
                  <p>나누고 싶은 이야기를 공유해보세요!</p>
                </div>

                <div className="communityListContainer">
                  {filteredData.length > 0 ? (
                    filteredData.map((data) => (
                      <div key={data.post_id} className="communityListBox">
                        <div className="communityInfoBox">
                          <span className="nickname">{data.author_nickname}</span>
                          <span className="date">
                            {format(new Date(data.created_at), "MM/dd HH:mm")}
                          </span>
                        </div>

                        <div className="communityContentBox">
                          <Link to={`/community-detail/${data.post_id}`} className="contentText">
                            {data.content}
                          </Link>
                        </div>

                        <div className="communityCommentBox">
                          <div className="communityLikeBox">
                            <button
                              className={`likeBtn ${data.isLiked ? "active" : ""}`}
                              onClick={() => handleLike(data.post_id)}
                            >
                              <span className="blind">좋아요 버튼</span>
                            </button>
                            <span>{data.heart_count}</span>
                          </div>
                          <span className="commentText">{data.comment_count}</span>
                        </div>

                        <button className="declarationBtn" onClick={() => handleReport(data.post_id)}>
                          신고
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{ marginTop: "30px" }}>
                      현재 "{selectedCategory}" 게시물이 없습니다.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 글쓰기 팝업 */}
      {communityPopupOpen && (
        <WritePopup
          isOpen={communityPopupOpen}
          closePopup={() => setCommunityPopupOpen(false)}
          onSuccess={handlePostSuccess} // ← 등록 성공 시 호출
        />
      )}

      {/* 신고/완료 팝업 */}
      {popupOpen && (
        <CompletePopup
          isOpen={popupOpen}
          message={popupMessage}
          error={popupError}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </Main>
  );
}
