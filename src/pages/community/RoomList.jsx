import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRoomModal from './CreateRoomModal.JSX';
import Loading from '../../components/Loading';

const RoomList = () => {
  const [roomList, setRoomList] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const navigate = useNavigate();

  // 방 생성 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoinRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  const handleDeleteRoom = (e, roomId) => {
    e.stopPropagation(); // 버블링 방지
    if (window.confirm('정말 삭제하시겠습니까?')) {
      socket.send(
        JSON.stringify({
          protocol: 'DELETE_ROOM',
          roomId: roomId,
        })
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const ws = new WebSocket('wss://light-dolls-repair.loca.lt/ws');

    // WebSocket 이벤트 핸들러 설정
    ws.onopen = () => {
      console.log('WebSocket 연결됨');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('data:', data);
      switch (data.protocol) {
        case 'CONNECTION_SUCCESS':
          console.log('연결성공');
          ws.send(
            JSON.stringify({
              protocol: 'REQUEST_ROOM_LIST',
            })
          );
          break;

        case 'ROOM_LIST':
          console.log('ROOM_LIST:', data);
          setRoomList(data.rooms);
          // 500ms 딜레이 후 로딩 종료
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          break;

        case 'ROOM_CREATED':
          console.log('ROOM_CREATED:', data);
          if (data.room) {
            setRoomList((prevRooms) => [...prevRooms, data.room]);
          } else {
            ws.send(JSON.stringify({ protocol: 'REQUEST_ROOM_LIST' }));
          }
          setIsModalOpen(false);
          break;

        case 'ROOM_DELETED':
          ws.send(
            JSON.stringify({
              protocol: 'REQUEST_ROOM_LIST',
            })
          );
          break;

        default:
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket 에러:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    setSocket(ws);

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [navigate]);

  return (
    <div className="roomListBox">
      <button
        onClick={() => setIsModalOpen(true)}
        className="roomAddPopup"
      >
        채팅방 만들기
      </button>
      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        socket={socket}
      />

      {isLoading ? (
        // 로딩 중일 때 스피너(여기서는 간단한 텍스트)를 표시
        <Loading />
      ) : (
        roomList &&
        roomList.map((room) => (
          <div
            key={room.roomId}
            className="roomBox"
            onClick={() => handleJoinRoom(room.roomId)}
          >
            <div className="imgBox">
              <img src={room.imageUrl} alt="채팅방 이미지" />
            </div>
            <div className="title">{room.name}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default RoomList;
