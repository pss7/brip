import React, { useState } from 'react';

const CreateRoomModal = ({ isOpen, onClose, socket }) => {

  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const [roomData, setRoomData] = useState({
    name: '',
    type: 'GROUP',
    maxUsers: 2,
    imageUrl: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!roomData.name.trim()) {
      setError("채팅방 이름을 입력해주세요");
      return;
    }
    
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setError("서버 연결이 끊어졌습니다");
      return;
    }

    const messageData = {
      protocol: 'CREATE_ROOM',
      name: roomData.name,
      type: roomData.type,
      maxUsers: roomData.maxUsers
    };
    
    // 이미지가 선택되었으면 이미지 데이터 포함
    if (previewImage) {
      messageData.imageData = previewImage;
    } else if (roomData.imageUrl) {
      messageData.imageUrl = roomData.imageUrl;
    }

    console.log("CREATE_ROOM 요청 전송");
    
    try {
      socket.send(JSON.stringify(messageData));
      
      // 폼 초기화
      setRoomData({
        name: '',
        type: 'GROUP',
        maxUsers: 2,
        imageUrl: ''
      });
      setPreviewImage(null);
      setError(null);
      
      onClose();
    } catch (error) {
      console.error("방 생성 요청 실패:", error);
      setError("방 생성 요청이 실패했습니다");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("파일 크기는 5MB 이하여야 합니다");
      return;
    }
    
    // 이미지 타입 확인
    if (!file.type.startsWith('image/')) {
      setError("이미지 파일만 업로드 가능합니다");
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    // 파일을 Base64로 변환
    const reader = new FileReader();
    reader.onloadend = () => {
      // Base64 문자열 (예: data:image/jpeg;base64,/9j/4AAQSkZ...)
      const base64String = reader.result;
      setPreviewImage(base64String);
      setIsUploading(false);
    };
    reader.onerror = () => {
      console.error('파일 읽기 실패');
      setError("파일 읽기에 실패했습니다");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };


  if (!isOpen) return null;

  return (
    <div className="roomPopupWrap">
      <div className="popupBox">
        <h3>새 채팅방 만들기</h3>

        <form onSubmit={handleSubmit}>
          <div className="box">
            <label className="label">
              채팅방 이름
            </label>
            <input
              type="text"
              value={roomData.name}
              onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="box">
            <label className="label">
              채팅 유형
            </label>
            <select
              value={roomData.type}
              onChange={(e) => setRoomData({ ...roomData, type: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="GROUP">그룹채팅</option>
              <option value="INDIVIDUAL">1:1채팅</option>
            </select>
          </div>

          {roomData.type === 'GROUP' && (
            <div className="box">
              <label className="label">
                최대 인원
              </label>
              <input
                type="number"
                min="2"
                value={roomData.maxUsers}
                onChange={(e) => setRoomData({ ...roomData, maxUsers: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div className="box">
            <label className="label">
              대표 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />

            {/* {isUploading && (
              <div className="mt-2 text-blue-500 text-sm">
                이미지 처리 중...
              </div>
            )}

            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="방 이미지 미리보기"
                  className="h-40 w-auto object-cover rounded"
                />
              </div>
            )} */}

          </div>

          <div className="btnBox">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateRoomModal