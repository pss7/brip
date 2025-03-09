import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import CreateRoomModal from '../../components/CreateRoomModal';

const RoomList = () => {
  const [roomList, setRoomList] = useState([]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  //방생성 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoinRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
  }

  const handleDeleteRoom = (e, roomId) => {
    e.stopPropagation(); // 버블링 방지 (방 클릭 이벤트가 발생하지 않도록)
    if (window.confirm('정말 삭제하시겠습니까?')) {
      socket.send(JSON.stringify({
        protocol: 'DELETE_ROOM',
        roomId: roomId
      }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token){
      navigate("/login");
      return;
    }
  
    const ws = new WebSocket('wss://light-dolls-repair.loca.lt/ws');
    
    // WebSocket 이벤트 핸들러들을 먼저 설정
    ws.onopen = () => {
      console.log("WebSocket 연결됨");
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data:", data);
      switch(data.protocol) {
        case 'CONNECTION_SUCCESS':
          console.log("연결성공");
          ws.send(JSON.stringify({
            protocol: 'REQUEST_ROOM_LIST'
          }));
          break;
          
        case 'ROOM_LIST':
          console.log("ROOM_LIST:", data);
          setRoomList(data.rooms);
          break;
          
        case 'ROOM_CREATED':
          // 방 생성 성공 시 해당 방으로 이동
          setIsModalOpen(false);
          navigate(`/chat/${data.roomId}`);
          break;

        case 'ROOM_DELETED':
          // 방 삭제 성공 시 방 목록 다시 요청
          ws.send(JSON.stringify({
            protocol: 'REQUEST_ROOM_LIST'
          }));
      }
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket 에러:", error);
    };
  
    ws.onclose = () => {
      console.log("WebSocket 연결 종료");
    };
  
    // 이벤트 핸들러 설정 후 상태 업데이트
    setSocket(ws);
  
    return () => {
      if(ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [navigate]);

  return (
    <div>
      <div>방리스트</div>
      {
        roomList &&
        roomList.map((room) => (
          <div 
            key={room.roomId} 
            className="flex justify-between items-center p-3 hover:bg-gray-100 cursor-pointer border-b"
          >
            <div onClick={() => handleJoinRoom(room.roomId)}>
              {room.name}
            </div>
            <button
              onClick={(e) => handleDeleteRoom(e, room.roomId)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              삭제
            </button>
          </div>
        ))
      }
      {/* <button 
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        방만들기
      </button>
      <CreateRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} socket={socket}/> */}
    </div>
  );
}

export default RoomList
