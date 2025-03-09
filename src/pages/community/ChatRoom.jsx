// ChatRoom.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const myCuid = localStorage.getItem('cuid');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token){
      navigate("/login");
      return;
    }

    const ws = new WebSocket('wss://api.spl-itm.com/ws');
    
    ws.onopen = () => {
      console.log("WebSocket 연결됨");
      // 연결 직후 인증
      ws.send(JSON.stringify({
        protocol: 'AUTH',
        cuid: localStorage.getItem('cuid'),
        token: localStorage.getItem('token'),
        nickname: localStorage.getItem('nickname')  // 닉네임도 함께 전송
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Parsed data:", data); 
      
      switch(data.protocol) {
        case 'CONNECTION_SUCCESS':
          ws.send(JSON.stringify({
            protocol: 'JOIN_ROOM',
            roomId: roomId
          }));
          break;

        case 'JOIN_ROOM_SUCCESS':
          console.log("방 입장 성공");
          // 과거 대화 내역 설정
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
      }
    };

    setSocket(ws);

    return () => {
      if(ws && ws.readyState === WebSocket.OPEN) {
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

    socket.send(JSON.stringify({
      protocol: 'CHAT',
      roomId: roomId,
      content: inputMessage
    }));
    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-white border-b">
        <h2 className="text-xl font-bold">채팅방</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isMyMessage = message.senderCuid === myCuid;
          
          return (
            <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[70%]">
                {!isMyMessage && (
                  <div className="text-sm font-semibold mb-1 ml-2">{message.senderNickname}</div>
                )}
                <div className={`rounded-lg p-3 
                  ${isMyMessage 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100'}`
                }>
                  <div className="text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${isMyMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="메시지를 입력하세요..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;