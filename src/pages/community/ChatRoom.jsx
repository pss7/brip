import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProfileImg from "../../assets/images/common/Profile_Img.svg";
import Main from '../../components/layout/Main';
import Container from '../../components/Container';
import { useAuthStore } from '../../store/useAuthStore';
import { getProfile } from '../../api/user';
import WritePopup from '../../components/WritePopup';

const ChatRoom = () => {

  const { token } = useAuthStore();

  //프로필 데이터 상태 관리
  const [profileData, setProfileData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();
  // WebSocket 인스턴스를 useRef로 관리하여 항상 최신 상태를 참조합니다.
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const myCuid = localStorage.getItem('cuid');

  const closePopup = () => {
    setShowPopup(false);
  };

  function openWritePopup() {
    console.log("📌 커뮤니티 글쓰기 버튼 클릭됨!");
    setShowPopup(true);
  }

  // 프로필 데이터 불러오기
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getProfile();
        if (response) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("error", error);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return;
    }

    const ws = new WebSocket('wss://light-dolls-repair.loca.lt/ws');
    socketRef.current = ws; // WebSocket 인스턴스를 ref에 저장합니다.

    ws.onopen = () => {
      console.log("WebSocket 연결됨");
      setIsConnected(true);
      // 연결 직후 인증
      ws.send(JSON.stringify({
        protocol: 'AUTH',
        cuid: localStorage.getItem('cuid'),
        token: localStorage.getItem('token'),
        nickname: localStorage.getItem('nickname')
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Parsed data:", data);

      switch (data.protocol) {
        case 'CONNECTION_SUCCESS':
          ws.send(JSON.stringify({
            protocol: 'JOIN_ROOM',
            roomId: roomId
          }));
          break;

        case 'JOIN_ROOM_SUCCESS':
          console.log("방 입장 성공");
          if (data.chatHistory) {
            const formattedHistory = data.chatHistory.map(msg => ({
              content: msg.content,
              senderCuid: msg.sender_cuid,
              senderNickname: msg.sender_nickname,
              time: msg.created_at
            }));
            setMessages(formattedHistory);
          }
          break;

        case 'CHAT':
          setMessages(prev => [...prev, {
            content: data.content,
            senderCuid: data.senderCuid,
            senderNickname: data.senderNickname,
            time: data.time
          }]);
          break;

        default:
          break;
      }
    };

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          protocol: 'LEAVE_ROOM',
          roomId: roomId
        }));
        ws.close();
      }
    };
  }, [roomId, navigate]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const ws = socketRef.current;
    // WebSocket의 readyState가 OPEN 인지 확인합니다.
    if (ws && ws.readyState === WebSocket.OPEN) {
      // 즉시 UI에 반영할 메시지 객체 생성
      const newMessage = {
        content: inputMessage,
        senderCuid: myCuid,
        senderNickname: localStorage.getItem('nickname'),
        time: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, newMessage]);

      ws.send(JSON.stringify({
        protocol: 'CHAT',
        roomId: roomId,
        content: inputMessage
      }));
      setInputMessage('');
    } else {
      console.error("WebSocket이 아직 연결되지 않았습니다. 연결 후 다시 시도해주세요.");
    }
  };

  return (

    <Main className="subWrap">
      <div className="communityBox communityChatBox">
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
                  <button
                    className="addBtn chatBtn"
                    onClick={() => navigate("/community", { state: { selectedCategory: "실시간채팅" } })}
                  >
                    <span>실시간채팅</span>
                  </button>
                  <button className="addBtn writeBtn" onClick={openWritePopup}>
                    <span>커뮤니티 글쓰기</span>
                  </button>
                </div>
              </aside>

              <div className="content flexColumn">
                <div className="header">
                  <Link to="/community" className="link">
                    <span className="blind">채팅리스트 화면으로 이동</span>
                  </Link>
                </div>

                <div className="chatMessageWrap">

                  {
                    messages.map((message, index) => {

                      const isMyMessage = message.senderCuid === myCuid;
                      return (
                        <div key={index} className="chatMessage">

                          <div className="imgBox">
                            <img src={ProfileImg} alt="프로필이미지" />

                          </div>

                          <div className="textBox">
                            {!isMyMessage && (
                              <div className="text-sm font-semibold mb-1 ml-2">
                                {message.senderNickname}
                              </div>
                            )}
                            <div className="messageContentBox">
                              <div className='messageNickname'>
                                {profileData.nickname}
                              </div>
                              <div className='layoutBox'>
                                <div className="messageContent">{message.content}</div>
                                <div className="messageTime">
                                  {message.time}
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      );

                    })}
                </div>

                <form onSubmit={sendMessage} className="messageBox">
                  <div className="layoutBox">
                    <div className="imgBox">
                      <img src={ProfileImg} alt="" />
                    </div>
                    <div className="inputBox">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="messageInput"
                        placeholder="메세지를 입력해주세요."
                      />
                    </div>
                  </div>
                  <button type="submit" className="messageBtn" disabled={!isConnected}>
                    전송
                  </button>
                </form>

              </div>
            </div>
          </div>
        </Container>
      </div>

      {showPopup && <WritePopup isOpen={showPopup} closePopup={closePopup} />}

    </Main>

  );
};

export default ChatRoom;
