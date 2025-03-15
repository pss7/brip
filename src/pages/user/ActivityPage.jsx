import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import style from "./ActivityPage.module.css";
import { useAuthStore } from "../../store/useAuthStore";
import { getProfile } from "../../api/user";
import Loading from "../../components/Loading";
import ViewButton from "../../components/ViewButton"; // ✅ ViewButton 추가
import ConfirmPopup from "../../components/ConfirmPopup"; // ✅ ConfirmPopup 추가
import { getCommunityList } from "../../api/community/community";
import { deleteCommunityPost } from "../../api/community/community"; // ✅ 삭제 API 추가
import WriteUpdatePopup from "../../components/WriteUpdatePopup"; // ✅ 업데이트 팝업 컴포넌트 추가

export default function ActivityPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // 삭제 팝업 상태
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null); // 삭제할 게시글 ID 저장

  // 업데이트 팝업 상태
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [selectedPostForUpdate, setSelectedPostForUpdate] = useState(null);

  // 로그인 확인 후 프로필 & 활동 데이터 가져오기
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      fetchProfileAndPosts();
    }
  }, [token]);

  // 프로필을 가져온 후 활동 데이터 로드
  const fetchProfileAndPosts = async () => {
    setLoading(true);
    try {
      const profileResponse = await getProfile();
      setProfileData(profileResponse.data);

      if (profileResponse.data?.nickname) {
        fetchMyCommunityPosts(profileResponse.data.nickname);
      }
    } catch (error) {
      console.error("❌ 프로필 데이터 가져오기 오류:", error);
      setLoading(false);
    }
  };

  // 내가 쓴 글만 필터링하여 가져오기
  const fetchMyCommunityPosts = async (nickname) => {
    try {
      const response = await getCommunityList({ page: 1, pageSize: 10 });
      if (response?.data) {
        const myPosts = response.data
          .map((post) => ({
            ...post,
            isActionsVisible: false, // 각 글에 토글 상태 추가
          }))
          .filter((post) => post.author_nickname === nickname);
        setActivities(myPosts);
      }
    } catch (error) {
      console.error("❌ 내 활동 목록 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 수정/삭제 토글
  const handleToggle = (post_id) => {
    setActivities((prev) =>
      prev.map((post) =>
        post.post_id === post_id
          ? { ...post, isActionsVisible: !post.isActionsVisible }
          : post
      )
    );
  };

  // 수정 버튼 클릭 시 업데이트 팝업 오픈
  const handleEdit = (post_id) => {
    const postToEdit = activities.find((post) => post.post_id === post_id);
    if (postToEdit) {
      setSelectedPostForUpdate(postToEdit);
      setIsUpdatePopupOpen(true);
    }
  };

  // 삭제 버튼 클릭 시 → 컨펌 팝업 열기
  const handleDeleteClick = (post_id) => {
    setSelectedPostId(post_id);
    setPopupOpen(true);
  };

  // 삭제 최종 실행 (ConfirmPopup에서 확인 클릭 시 실행)
  const handleConfirmDelete = async () => {
    if (!selectedPostId) return;
    try {
      await deleteCommunityPost({ postId: selectedPostId });
      setActivities((prevActivities) =>
        prevActivities.filter((post) => post.post_id !== selectedPostId)
      );
      setPopupOpen(false);
    } catch (error) {
      console.error("❌ 게시글 삭제 오류:", error);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

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
                  <Loading center />
                ) : activities.length === 0 ? (
                  <p className={style.noData}>내 활동 내역이 없습니다.</p>
                ) : (
                  <ul className={style.activityList}>
                    {activities.map((post) => (
                      <li key={post.post_id}>
                        <div className={style.topBox}>
                          <span className={style.name}>{post.author_nickname}</span>
                          <span className={style.date}>
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <p className={style.content}>{post.content}</p>
                        <div className={style.imgBox}>
                          <img src={post.img_url} alt="" />
                        </div>

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

                        <ViewButton
                          handleToggle={handleToggle}
                          data={post}
                          className={style.viewBox}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
                          idKey="post_id" // post_id를 사용하도록 지정
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 삭제 컨펌 팝업 */}
      <ConfirmPopup
        isOpen={isPopupOpen}
        message="정말 삭제하시겠습니까?"
        subMessage="삭제된 내용은 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onClose={() => setPopupOpen(false)}
      />

      {/* 업데이트(수정) 팝업 */}
      {isUpdatePopupOpen && (
        <WriteUpdatePopup
          isOpen={isUpdatePopupOpen}
          closePopup={() => setIsUpdatePopupOpen(false)}
          onSuccess={() => {
            // 업데이트 성공 후 활동 데이터를 재조회
            fetchProfileAndPosts();
            setIsUpdatePopupOpen(false);
          }}
          initialData={selectedPostForUpdate}
        />
      )}
    </Main>
  );
}
