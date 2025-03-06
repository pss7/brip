import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import style from "./ActivityPage.module.css";
import { getCommunityList } from "../../api/community/community";
import { useAuthStore } from "../../store/useAuthStore";
import { getProfile } from "../../api/user";
import Loading from "../../components/Loading";

export default function ActivityPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore(); // 현재 로그인한 유저 정보 가져오기
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // ✅ 로그인 확인 후 프로필 & 활동 데이터 가져오기
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      fetchProfileAndPosts(); // 프로필 데이터를 먼저 가져온 후 활동 데이터 가져오기
    }
  }, [token]);

  // ✅ 프로필을 가져온 후 활동 데이터 로드
  const fetchProfileAndPosts = async () => {
    setLoading(true);
    try {
      const profileResponse = await getProfile();
      setProfileData(profileResponse.data);

      // 🔹 프로필이 성공적으로 로드된 후에만 활동 데이터를 가져옴
      if (profileResponse.data?.nickname) {
        fetchMyCommunityPosts(profileResponse.data.nickname);
      }
    } catch (error) {
      console.error("❌ 프로필 데이터 가져오기 오류:", error);
      setLoading(false);
    }
  };

  // ✅ 내가 쓴 글만 필터링하여 가져오기
  const fetchMyCommunityPosts = async (nickname) => {
    try {
      const response = await getCommunityList({
        page: 1,
        pageSize: 10,
      });

      if (response?.data) {
        // 🔹 프로필에서 가져온 닉네임과 일치하는 글만 필터링
        const myPosts = response.data.filter((post) => post.author_nickname === nickname);
        setActivities(myPosts);
      }
    } catch (error) {
      console.error("❌ 내 활동 목록 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main className="subWrap bg">
      <div className="mypageBox">
        <Container className="lnbContainer">
          <div className="mypageContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/mypage">
                  <span>프로필</span>
                </Link>
                <Link to="/interest">
                  <span>관심공고</span>
                </Link>
                <Link to="/resume">
                  <span>이력서관리</span>
                </Link>
                <Link to="/apply">
                  <span>지원현황</span>
                </Link>
                <Link to="/activity" className="active">
                  <span>내 활동</span>
                </Link>
              </aside>

              <div className="content">
                <h4 className="title">내 활동</h4>
                <p className="subTitle">내가 작성한 게시물을 확인할 수 있습니다.</p>

                {loading ? (
                  <Loading />
                ) : activities.length === 0 ? (
                  <p className={style.noData}>내 활동 내역이 없습니다.</p>
                ) : (
                  <ul className={style.activityList}>
                    {activities.map((post) => (
                      <li key={post.post_id}>
                        <div className={style.topBox}>
                          <span className={style.name}>{post.author_nickname}</span>
                          <span className={style.date}>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>

                        <p className={style.content}>{post.content}</p>

                        <div className={style.btnWrap}>
                          <div className={style.btnBox}>
                            <p className={style.likeText}>
                              <span className="blind">좋아요</span>
                            </p>
                            <span className={style.number}>{post.heart_count}</span>
                          </div>

                          <div className={style.btnBox}>
                            <p className={style.commentText}>
                              <span className="blind">댓글</span>
                            </p>
                            <span className={style.number}>{post.comment_count}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
