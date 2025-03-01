import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import Message from "../../components/Message";
import { format } from "date-fns";
import ProfileImg from "../../assets/images/common/Profile_Img.svg";
import WritePopup from "../../components/WritePopup";
import AddPopup from "../../components/AddPopup";
import { getCommentList, getCommunityDetail, postComment, reportCommunity, toggleLike } from "../../api/community/community";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../../components/Loading";
import { useLoadingStore } from "../../store/useLoadingStore";
import { getProfile } from "../../api/user";
import CompletePopup from "../../components/CompletePopup";


export default function CommunityDetailPage() {

  const { community_Id } = useParams();
  const communityId = Number(community_Id);

  //토큰
  const { token } = useAuthStore();
  const [communityDetail, setCommunityDetail] = useState({});

  //댓글 상태 관리
  const [commnet, setComment] = useState({});

  //팝업 상태 관리
  const [communityPopupOpen, setCommunityPopupOpen] = useState(false);

  const [completePopupOpen, setCompletePopupOpen] = useState(false);
  const [completePopupMessage, setCompletePopupMessage] = useState("");
  const [completePopupError, setCompletePopupError] = useState(false);

  //팝업 상태 관리
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupError, setPopupError] = useState(false);

  //프로필 데이터 상태 관리
  const [profileData, setProfileData] = useState({});

  //로딩 상태 관리
  const { isLoading, setLoading } = useLoadingStore();

  // 좋아요 버튼 클릭 시 실행할 함수
  async function handleLike(post_id) {
    const response = await toggleLike(post_id);

    if (response) {
      setCommunityDetail((prevData) => ({
        ...prevData,
        heart_count: prevData.isLiked ? prevData.heart_count - 1 : prevData.heart_count + 1,
        isLiked: !prevData.isLiked,
      }));
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

  //댓글 등록 함수
  async function handleComment(post_id) {

    try {
      const response = await postComment(post_id, commnet);
      if (response) {
        console.log("댓글 등록 완료");
      }
    } catch (error) {
      console.error("error:", error);
    }

  }

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

  //커뮤니티 상세 데이터 불러오기
  useEffect(() => {

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

    fetchCommunityDetail();

  }, [communityId])

  //댓글 목록 데이터 불러오기
  useEffect(() => {

    async function fetchComment() {

      try {
        const response = await getCommentList(0, 10, communityDetail.category);
        if (response) {
          setComment(response);
        }
      } catch (error) {
        console.error("error:", error);
      }

    }

    fetchComment();

  }, [communityDetail.category])

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!token) {
    navigate("/signin");
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
                    <img src={ProfileImg} alt="" />
                  </div>
                  <div className="textBox">
                    <p className="nickname">{profileData.nickname}</p>
                    <span className="name">{profileData.name}</span>
                  </div>
                </div>
                <div className="addBtnBox">
                  <button
                    className="addBtn"
                  // onClick={openAddPopup}
                  >
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
                    <h4>노하우 Q&A</h4>
                  </div>
                  <div className="communityListBox">
                    <div className="communityInfoBox">
                      <span className="nickname">{communityDetail?.author_nickname || "작성자 없음"}</span>
                      <span className="date">
                        {communityDetail?.created_at
                          ? format(new Date(communityDetail.created_at), "MM/dd HH:mm")
                          : "날짜 없음"}
                      </span>
                    </div>

                    <div className="communityContentBox">
                      <p className="contentText">{communityDetail.content}</p>
                    </div>

                    <div className="communityCommentBox">
                      <div className="communityLikeBox">
                        <dlv className="btnBox">
                          <button
                            className={`likeBtn ${communityDetail.isLiked ? "active" : ""}`}
                            onClick={() => handleLike(communityDetail.post_id)}
                          >
                            <span className="blind">좋아요 버튼</span>
                          </button>
                          <span>{communityDetail.heart_count}</span>
                        </dlv>
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

                  <div className="commentBox">
                    <span className="commentNumber">
                      댓글 4
                    </span>

                    <div className="commentAuthor">
                      <span className="commentName">
                        홍길동
                      </span>
                      <span className="commentDay">
                        4일 전
                      </span>
                    </div>

                    <p className="commentContent">
                      안녕하세요! 저도 물류관리사 시험 준비할 때 물류 및 유통관리 과목이 어려웠어요.
                    </p>

                    <div className="replyBox">
                      <div className="likeBox">
                        <button className="likeBtn">
                          <span className="blind">
                            좋아요버튼
                          </span>
                        </button>
                        <span>
                          1
                        </span>
                      </div>

                      <button className="replyBtn">
                        답글쓰기
                      </button>
                    </div>
                  </div>
                </div>

                <Message
                  id="message"
                  hiddenText="댓글입력"
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="댓글을 남겨주세요."
                  onClick={() => { handleComment(communityDetail.post_id) }}
                  onEnter={() => handleComment(communityDetail.post_id)}
                />

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

      {/* {
        addPopupShowPopup && <AddPopup closePopup={closePopup} />
      } */}

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
