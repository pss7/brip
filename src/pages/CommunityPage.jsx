import { useEffect, useState } from "react";
import Container from "../components/Container";
import Main from "../components/layout/Main";
import { getKnowhow } from "../api/community/knowhow";
import Loading from "../components/Loading";
import { useLoadingStore } from "../store/useLoadingStore";
import { Link, useNavigate } from "react-router-dom";
import ProfileImg from "../assets/images/common/Profile_Img.svg";
import { useAuthStore } from "../store/useAuthStore";

export default function CommunityPage() {

  const navigate = useNavigate();

  //토큰 불러오기
  const { token } = useAuthStore();

  // 로딩 상태 관리
  const { isLoading, setLoading } = useLoadingStore();

  // 데이터 상태 관리
  const [knowhowData, setKnowhowData] = useState([]);

  useEffect(() => {
    async function fetchKnowhow() {
      
      setLoading(true);

      try {
        const response = await getKnowhow();
        if (response) {
          setKnowhowData(response);
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    }

    fetchKnowhow();
  }, [setLoading]);

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
                    <p className="nickname">닉네임</p>
                    <span className="name">사용자 이름</span>
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
                <div className="knowhowPostList">
                  {knowhowData && knowhowData.length > 0 ? (
                    knowhowData.map((post, index) => (
                      <div key={index} className="postItem">
                        <div className="postHeader">
                          <span className="postAuthor">{post.author_nickname}</span>
                          <span className="postDate">{post.created_at}</span>
                        </div>
                        <Link to={`/community/${post.id}`} className="postContent">
                          {post.title}
                        </Link>
                        <div className="postFooter">
                          <span>댓글 {post.comments_count}</span>
                          <span>좋아요 {post.likes_count}</span>
                        </div>
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
