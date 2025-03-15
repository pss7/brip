import { useEffect, useState } from "react";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import { getCommunityList, reportCommunity, toggleLike } from "../../api/community/community";
import Loading from "../../components/Loading";
import { useLoadingStore } from "../../store/useLoadingStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileImg from "../../assets/images/common/Profile_Img.svg";
import { getProfile } from "../../api/user";
import { useAuthStore } from "../../store/useAuthStore";
import { format } from "date-fns";
import CompletePopup from "../../components/CompletePopup";
import WritePopup from "../../components/WritePopup";
import AddPopup from "../../components/AddPopup";
import RoomList from "./RoomList"; // 실시간 채팅방 목록 컴포넌트

export default function CommunityPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  if (!token) {
    navigate("/signin");
  }

  // 기존 커뮤니티 관련 상태
  const [communityPopupOpen, setCommunityPopupOpen] = useState(false);
  const [communityData, setCommunityData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const { isLoading, setLoading } = useLoadingStore();
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupError, setPopupError] = useState(false);

  // 카테고리 관리
  const categories = ["노하우&Q&A", "실시간채팅", "업종별/연차별", "정보공유"];
  const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || "노하우&Q&A");
  const filteredData = communityData.filter((data) => data.category === selectedCategory);

  // 추가된 실시간 채팅 관련 상태
  const [addPopupOpen, setAddPopupOpen] = useState(false); // 채팅방 생성 팝업
  const [roomList, setRoomList] = useState([]); // 실시간 채팅방 목록
  const [socket, setSocket] = useState(null); // WebSocket 연결 상태

  // WebSocket 연결 (마운트 시 한 번 실행)
  useEffect(() => {
    const ws = new WebSocket('wss://api.spl-itm.com/ws');

    ws.onopen = () => {
      console.log("WebSocket 연결됨");
      ws.send(JSON.stringify({ protocol: "REQUEST_ROOM_LIST" }));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.protocol) {
        case "ROOM_LIST":
          setRoomList(data.rooms);
          break;
        case "ROOM_CREATED":
          setRoomList((prevList) => [...prevList, data.room]);
          break;
        case "ROOM_DELETED":
          setRoomList((prevList) =>
            prevList.filter((room) => room.roomId !== data.roomId)
          );
          break;
        default:
          break;
      }
    };
    ws.onerror = (error) => console.error("WebSocket 에러:", error);
    ws.onclose = () => console.log("WebSocket 연결 종료");
    setSocket(ws);
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // 커뮤니티 목록 가져오기
  const fetchCommunity = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchCommunity();
  }, [selectedCategory]);

  // 프로필 가져오기
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
    if (reason === null) return; // 취소 시 아무 동작도 하지 않음

    try {
      const response = await reportCommunity(post_id, reason);

      // API 응답 예시: { result: "fail", message: "이미 신고한 게시물입니다." }
      if (response.result === "fail") {
        setPopupMessage("이미 신고한 게시물입니다.");
        setPopupError(true);
      } else if (response.result === "success") {
        setPopupMessage("신고가 접수되었습니다.");
        setPopupError(false);
      } else {
        // 그 외의 경우
        setPopupMessage("신고 중 오류가 발생했습니다.");
        setPopupError(true);
      }
    } catch (error) {
      console.error("서버 오류:", error);
      setPopupMessage("서버 오류가 발생했습니다.");
      setPopupError(true);
    }
    setPopupOpen(true);
  }

  // 글쓰기 팝업 등록 성공 시
  const handlePostSuccess = () => {
    setCommunityPopupOpen(false);
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
                  {/* 채팅방 생성 버튼 (실시간채팅 기능) */}
                  <button
                    className="addBtn chatBtn"
                    onClick={() => {
                      setSelectedCategory("실시간채팅"); // 실시간 채팅 탭으로 변경
                    }}
                  >
                    <span>실시간채팅</span>
                  </button>
                  <button
                    className="addBtn writeBtn"
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
                {selectedCategory === "실시간채팅" ? (
                  // 실시간채팅 탭 선택 시 채팅방 목록을 표시
                  <RoomList roomList={roomList} />
                ) : (
                  // 나머지 카테고리는 기존 커뮤니티 게시글 표시
                  <div className="communityListContainer">
                    {isLoading ? (
                      <Loading center />
                    ) : filteredData.length > 0 ? (
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
                            <div className="communityImgBox">
                              <img src={data.img_url} alt="" />
                            </div>
                          </div>
                          {/* 좋아요, 댓글 수, 신고 기능 */}
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
                      <p className="infoText">
                        현재 "{selectedCategory}" 게시물이 없습니다.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 커뮤니티 글쓰기 팝업 */}
      {communityPopupOpen && (
        <WritePopup
          isOpen={communityPopupOpen}
          closePopup={() => setCommunityPopupOpen(false)}
          onSuccess={handlePostSuccess}
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

      {/* 채팅방 생성 팝업 (실시간채팅 기능) */}
      <AddPopup
        isOpen={addPopupOpen}
        closePopup={() => setAddPopupOpen(false)}
        socket={socket}
        updateRoomList={(newRoom) => setRoomList((prevList) => [...prevList, newRoom])}
      />
    </Main>
  );
}
