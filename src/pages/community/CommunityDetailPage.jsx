import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import ProfileImg from "../../assets/images/common/Profile_Img.svg";
import WritePopup from "../../components/WritePopup";
import { getCommentList, getCommunityDetail, getReplyList, postComment, postCommentLike, postReply, reportCommunity, toggleLike } from "../../api/community/community";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../../components/Loading";
import { useLoadingStore } from "../../store/useLoadingStore";
import { getProfile } from "../../api/user";
import CompletePopup from "../../components/CompletePopup";
import Message from "../../components/Message";
import { use } from "react";

export default function CommunityDetailPage() {

  const navigate = useNavigate();

  const { community_Id } = useParams();
  const communityId = Number(community_Id);


  //강제 리렌더링 트리거
  const [forceRender, setForceRender] = useState(false);

  // 토큰
  const { token } = useAuthStore();
  if (!token) {
    navigate("/signin");
  }

  const [replyList, setReplyList] = useState({});
  const [replyInput, setReplyInput] = useState({});
  const [openReplies, setOpenReplies] = useState({});

  // 게시글 상세 + 댓글 상태
  const [communityDetail, setCommunityDetail] = useState({});
  const [commentList, setCommentList] = useState([]);

  // 작성 중인 댓글 내용
  const [commentInput, setCommentInput] = useState("");

  // 팝업 상태
  const [communityPopupOpen, setCommunityPopupOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupError, setPopupError] = useState(false);

  // 프로필
  const [profileData, setProfileData] = useState({});

  // 로딩
  const { isLoading, setLoading } = useLoadingStore();

  // 1) 좋아요 (메인 게시글)
  async function handleLike(post_id) {
    const response = await toggleLike(post_id);
    if (response) {
      // isLiked 토글 + heart_count 증감
      setCommunityDetail((prev) => ({
        ...prev,
        heart_count: prev.isLiked ? prev.heart_count - 1 : prev.heart_count + 1,
        isLiked: !prev.isLiked,
      }));
    }
  }

  // 2) 신고
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

  // 3) 댓글 작성
  async function handleComment(post_id) {
    try {
      const response = await postComment(post_id, commentInput);
      if (response?.result === "success") {
        // 댓글 등록 후, 댓글 목록 재조회
        fetchCommentList();
        // 입력창 비우기
        setCommentInput("");
      }
    } catch (error) {
      console.error("댓글 등록 오류:", error);
    }
  }

  // 4) 댓글 목록 API 호출
  async function fetchCommentList() {
    if (!communityDetail?.post_id) return;
    try {
      const response = await getCommentList(
        0,            // page
        10,           // size
        communityDetail.category,   // category
        communityDetail.post_id     // post_id
      );
      if (response?.result === "success") {
        setCommentList(response.data);
      }
    } catch (error) {
      console.error("댓글 목록 불러오기 오류:", error);
    }
  }

  // 5) 프로필, 게시글, 댓글 목록 로드
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
  async function fetchCommunityDetail() {
    setLoading(true);
    try {
      const response = await getCommunityDetail(communityId);
      if (response) {
        setCommunityDetail(response.data);
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  }

  //댓글 좋아요 함수
  async function handleCommentLike(commentId) {
    try {
      const response = await postCommentLike(commentId);

      if (response.result === "success") {
        console.log("댓글 좋아요");

        //1) 즉시 UI 업데이트
        setCommentList((prevComments) =>
          prevComments.map((comment) =>
            comment.comment_id === commentId
              ? {
                ...comment,
                likes_count: comment.isLiked
                  ? comment.likes_count - 1
                  : comment.likes_count + 1,
                isLiked: !comment.isLiked,
              }
              : comment
          )
        );

        //2) 강제 리렌더링 트리거
        setForceRender((prev) => !prev);
      }
    } catch (error) {
      console.error("좋아요 처리 오류:", error);
    }
  }

  //강제 리렌더링 시 최신 데이터 반영
  useEffect(() => {
    fetchCommentList();
  }, [forceRender]);

  useEffect(() => {
    fetchProfile();
  }, [communityId]);

  useEffect(() => {
    fetchCommunityDetail();
  }, [communityId]);

  useEffect(() => {
    fetchCommentList();
  }, [communityDetail.category, communityDetail.post_id]);

  // ✅ 대댓글 등록 API 호출
  async function handleReplySubmit(commentId) {
    const content = replyInput[commentId];

    if (!content) {
      console.error("❌ 대댓글 내용이 비어 있습니다.");
      return;
    }

    try {
      const response = await postReply({
        postId: communityId,  // ✅ 현재 게시글 ID 전달
        parentId: commentId,  // ✅ 부모 댓글 ID 전달
        content: content,     // ✅ 입력된 대댓글 내용 전달
      });

      if (response?.result === "success") {
        console.log("✅ 대댓글 등록 성공!");

        // 대댓글 목록 다시 불러오기
        fetchReplyList(commentId);

        // 입력창 초기화
        setReplyInput((prev) => ({ ...prev, [commentId]: "" }));
      } else {
        console.error("❌ 대댓글 등록 실패:", response);
      }
    } catch (error) {
      console.error("❌ 대댓글 등록 중 오류 발생:", error);
    }
  }


  // ✅ 대댓글 목록 불러오기
  async function fetchReplyList(commentId) {
    try {
      const response = await getReplyList(commentId);
      if (response?.result === "success") {
        setReplyList((prev) => ({ ...prev, [commentId]: response.data }));
      }
    } catch (error) {
      console.error("대댓글 목록 불러오기 오류:", error);
    }
  }


  // ✅ 답글 버튼 클릭 시 대댓글 조회
  function toggleReplyBox(commentId) {
    setOpenReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    if (!openReplies[commentId]) {
      fetchReplyList(commentId);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchCommunityDetail();
    fetchCommentList();
  }, [communityId, forceRender]);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <Main className="subWrap">
      <div className="communityBox communityDetailBox">
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

              <div className="content flexColumn">
                <div className="communityListContainer">
                  <div className="communityTopBox">
                    <Link to="/community" className="link">
                      <span className="blind">
                        노하우Q&A리스트 화면으로 이동
                      </span>
                    </Link>
                    <h4>{communityDetail.category || "노하우 Q&A"}</h4>
                  </div>

                  {/* 메인 게시글 박스 */}
                  <div className="communityListBox">
                    <div className="communityInfoBox">
                      <span className="nickname">
                        {communityDetail?.author_nickname || "작성자 없음"}
                      </span>

                      {/* 날짜: 상대 시간으로 (like '4일 전') */}
                      <span className="date">
                        {communityDetail?.created_at
                          ? formatDistanceToNow(new Date(communityDetail.created_at), {
                            addSuffix: true,
                            locale: ko,
                          })
                          : "날짜 없음"}
                      </span>
                    </div>

                    <div className="communityContentBox">
                      <p className="contentText">{communityDetail.content}</p>
                    </div>

                    <div className="communityCommentBox">
                      <div className="communityLikeBox">
                        <div className="btnBox">
                          <button
                            className={`likeBtn ${communityDetail.isLiked ? "active" : ""}`}
                            onClick={() => handleLike(communityDetail.post_id)}
                          >
                            <span className="blind">좋아요 버튼</span>
                          </button>
                          <span>{communityDetail.heart_count}</span>
                        </div>
                      </div>
                      <span className="commentText">{communityDetail.comment_count}</span>
                    </div>

                    <button
                      className="declarationBtn"
                      onClick={() => handleReport(communityDetail.post_id)}
                    >
                      신고
                    </button>
                  </div>

                  {/* 댓글 목록 */}
                  <div className="commentWrap">
                    {commentList.length > 0 ? (
                      commentList.map((item, index) => {
                        const commentTimeAgo = formatDistanceToNow(new Date(item.created_at), {
                          addSuffix: true,
                          locale: ko,
                        });

                        return (
                          <div className="commentBox" key={index}>
                            <span className="commentNumber">댓글 {item.reply_count}</span>

                            <div className="commentAuthor">
                              <span className="commentName">{item.user_name}</span>
                              <span className="commentDay">{commentTimeAgo}</span>
                            </div>

                            <p className="commentContent">{item.content}</p>

                            <div className="replyBox">
                              <div className="likeBox">
                                <button className="likeBtn" onClick={() => handleCommentLike(item.comment_id)}>
                                  <span className="blind">좋아요버튼</span>
                                </button>
                                <span>{item.likes_count}</span>
                              </div>

                              <button className="replyBtn" onClick={() => toggleReplyBox(item.comment_id)}>
                                {openReplies[item.comment_id] ? "답글 숨기기" : "답글쓰기"}
                              </button>
                            </div>

                            {/* ✅ 대댓글 입력창 */}
                            {openReplies[item.comment_id] && (
                              <div className="replyInputBox">
                                <input
                                  type="text"
                                  placeholder="답글을 입력하세요."
                                  value={replyInput[item.comment_id] || ""}
                                  onChange={(e) => setReplyInput((prev) => ({ ...prev, [item.comment_id]: e.target.value }))}
                                />
                                <button className="submitReplyBtn" onClick={() => handleReplySubmit(item.comment_id)}>
                                  등록
                                </button>
                              </div>
                            )}

                            {/* ✅ 대댓글 목록 표시 */}
                            {openReplies[item.comment_id] && replyList[item.comment_id] && (
                              <div className="replyList">
                                {replyList[item.comment_id].map((reply) => (
                                  <div key={reply.comment_id} className="replyItem">
                                    <span className="replyName">{reply.user_name}</span>
                                    <span className="replyTime">
                                      {formatDistanceToNow(new Date(reply.created_at), {
                                        addSuffix: true,
                                        locale: ko,
                                      })}
                                    </span>
                                    <p className="replyContent">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="infoText">댓글을 남겨주세요.</p>
                    )}
                  </div>

                </div>

                {/* 댓글 작성 input */}
                <Message
                  id="message"
                  hiddenText="댓글입력"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="댓글을 남겨주세요."
                  onClick={() => handleComment(communityDetail.post_id)}
                  onEnter={() => handleComment(communityDetail.post_id)}
                />

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
