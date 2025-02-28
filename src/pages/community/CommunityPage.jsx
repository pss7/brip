import { useEffect, useState } from "react";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import { getCommunity, reportPost, toggleLike } from "../../api/community/community"; // 좋아요 API 임포트
import Loading from "../../components/Loading";
import { useLoadingStore } from "../../store/useLoadingStore";
import { useNavigate } from "react-router-dom";
import ProfileImg from "../../assets/images/common/Profile_Img.svg";
import { getProfile } from "../../api/user";
import { useAuthStore } from "../../store/useAuthStore";
import { format } from "date-fns";

export default function CommunityPage() {

  const navigate = useNavigate();

  const categories = ["노하우&Q&A", "실시간채팅", "업종별/연차별", "정보공유"];

  const [category, setCategory] = useState("노하우&Q&A");

  const [communityData, setCommunityData] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("노하우&Q&A");

  const [profileData, setProfileData] = useState([]);

  const { token } = useAuthStore();

  const { isLoading, setLoading } = useLoadingStore();

  useEffect(() => {
    async function fetchCommunity() {
      setLoading(true);
      try {
        const response = await getCommunity({
          page: 0,
          size: 10,
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
  }, [category]);

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

  async function handleReport(post_id) {
    const reason = prompt("신고 사유를 입력하세요:");

    if (!reason) {
      alert("🚨 신고 사유를 입력해야 합니다.");
      return;
    }

    const response = await reportPost(post_id, reason);

    if (response) {
      alert("✅ 신고가 접수되었습니다.");
    } else {
      alert("❌ 신고 처리 중 오류가 발생했습니다.");
    }
  }

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
      <div className="communityBox communityQABox">
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
                  <button className="addBtn communityWrite">
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
                  {communityData && communityData.length > 0 ? (
                    communityData.map((data) => (
                      <div key={data.post_id} className="communityListBox">
                        <div className="communityInfoBox">
                          <span className="nickname">{data.author_nickname}</span>
                          <span className="date">
                            {format(new Date(data.created_at), "MM/dd HH:mm")}
                          </span>
                        </div>

                        <div className="communityContentBox">
                          <p className="contentText">{data.content}</p>
                        </div>

                        <div className="communityCommentBox">
                          <div className="likeBox">
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
                    <p>현재 노하우 글이 없습니다.</p>
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
