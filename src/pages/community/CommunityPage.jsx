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

  //경로
  const navigate = useNavigate();

  //토큰
  const { token } = useAuthStore();

  const categories = ["노하우&Q&A", "실시간채팅", "업종별/연차별", "정보공유"];
  const [category, setCategory] = useState("노하우&Q&A");
  const [selectedCategory, setSelectedCategory] = useState("노하우&Q&A");

  //팝업 상태 관리
  const [communityPopupOpen, setCommunityPopupOpen] = useState(false);

  //커뮤니티 데이터 상태 관리
  const [communityData, setCommunityData] = useState([]);

  //프로필 데이터 상태 관리
  const [profileData, setProfileData] = useState([]);

  //로딩 상태 관리
  const { isLoading, setLoading } = useLoadingStore();

  //팝업 상태 관리
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupError, setPopupError] = useState(false);

  //데이터 필터
  const filteredData = communityData.filter((data) => data.category === selectedCategory);

  // 좋아요 버튼 클릭 시 실행할 함수
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

  //신고 접수 함수
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

  //커뮤니티 데이터 불러오기
  useEffect(() => {
    async function fetchCommunity() {
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
    }

    fetchCommunity();
  }, [selectedCategory]);

  //프로필 데이터 불러오기
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
  }, []);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!token) {
    navigate("/signin");
  }

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
                  {categories.map((category, index) => (
                    <li key={index}>
                      <button
                        className={`tabBtn ${selectedCategory === category ? "active" : ""}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
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
                          <span className="date">{format(new Date(data.created_at), "MM/dd HH:mm")}</span>
                        </div>

                        <div className="communityContentBox">
                          <Link to={`/community-detail/${data.post_id}`} className="contentText">{data.content}</Link>
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

                        <button
                          className="declarationBtn"
                          onClick={() => handleReport(data.post_id)}
                        >
                          신고
                        </button>

                      </div>
                    ))
                  ) : (
                    <p style={{ marginTop: "30px" }}>현재 "{selectedCategory}" 게시물이 없습니다.</p>
                  )}

                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {communityPopupOpen && (
        <WritePopup
          isOpen={communityPopupOpen}
          closePopup={() => setCommunityPopupOpen(false)}
        />
      )}

      {
        popupOpen &&
        <CompletePopup
          isOpen={popupOpen}
          message={popupMessage}
          error={popupError}
          onClose={() => setPopupOpen(false)}
        />
      }

    </Main>
  );
}
