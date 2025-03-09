import React, { useState } from 'react';

const CreateRoomModal = ({ isOpen, onClose, socket }) => {
  const [roomData, setRoomData] = useState({
    name: '',
    type: 'GROUP',
    maxUsers: 2,
    imageUrl: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("CREATE_ROOM 호출전");
    socket.send(JSON.stringify({
      protocol: 'CREATE_ROOM',
      ...roomData
    }));
    console.log("CREATE_ROOM 호출후");
    onClose();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // 실제 구현에서는 파일 업로드 API를 호출하고 URL을 받아와야 함
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await uploadFile(formData);
      // setRoomData({ ...roomData, imageUrl: response.url });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">새 채팅방 만들기</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              대표 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end gap-2">
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