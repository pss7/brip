import { useState, useEffect } from "react";
import Button from "./Button";
import Input from "./Input";
import CompletePopup from "./CompletePopup";

export default function AddPopup({ isOpen, closePopup, socket }) {
  const [roomData, setRoomData] = useState({
    name: "",
    type: "GROUP",
    maxUsers: 2,
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isCompletePopupOpen, setIsCompletePopupOpen] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(socket?.readyState === WebSocket.OPEN);

  // ✅ WebSocket 상태 감지 (닫혔을 경우 재연결)
  useEffect(() => {
    if (!socket) return;

    const handleOpen = () => {
      console.log("✅ WebSocket 연결 성공!");
      setIsSocketConnected(true);
    };

    const handleClose = () => {
      console.log("❌ WebSocket 연결 종료. 3초 후 재연결 시도...");
      setIsSocketConnected(false);

      // ✅ 3초 후 자동 재연결
      setTimeout(() => {
        if (socket.readyState === WebSocket.CLOSED) {
          socket = new WebSocket('wss://api.spl-itm.com/ws');
        }
      }, 3000);
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("close", handleClose);

    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("close", handleClose);
    };
  }, [socket]);

  // ✅ 채팅방 유형 변경 핸들러
  const handleTypeChange = (event) => {
    setRoomData({ ...roomData, type: event.target.value });
  };

  // ✅ 파일 업로드 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setRoomData({ ...roomData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ 채팅방 생성 핸들러
  const handleCreateChat = (e) => {
    e.preventDefault();

    if (!roomData.name.trim()) {
      alert("채팅방 이름을 입력하세요!");
      return;
    }

    if (!isSocketConnected || !socket || socket.readyState !== WebSocket.OPEN) {
      alert("웹소켓 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    console.log("🟢 CREATE_ROOM 호출 전");
    socket.send(
      JSON.stringify({
        protocol: "CREATE_ROOM",
        ...roomData,
      })
    );
    console.log("🟢 CREATE_ROOM 호출 후");

    setIsCompletePopupOpen(true);
  };

  // ✅ 완료 팝업 닫기
  const handleCloseCompletePopup = () => {
    setIsCompletePopupOpen(false);
    closePopup();
  };

  return (
    <>
      {/* ✅ 채팅방 생성 모달 */}
      <div className={`popupWrap ${isOpen ? "active" : ""}`}>
        <div className="popupBox">
          <h3>채팅방 생성</h3>

          <form onSubmit={handleCreateChat}>
            {/* 채팅방 이름 */}
            <div className="box">
              <label htmlFor="roomName" className="label">채팅방 이름</label>
              <Input
                id="roomName"
                placeholder="채팅방 이름 입력"
                value={roomData.name}
                onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
              />
            </div>

            {/* 채팅 유형 */}
            <div className="box">
              <label className="label">채팅 유형</label>
              <div className="chatTypeOptions">
                <input
                  id="radio01"
                  type="radio"
                  name="chatType"
                  value="GROUP"
                  checked={roomData.type === "GROUP"}
                  onChange={handleTypeChange}
                  className="blind"
                />
                <label htmlFor="radio01" className="customRadio">그룹 채팅</label>

                <input
                  id="radio02"
                  type="radio"
                  name="chatType"
                  value="INDIVIDUAL"
                  checked={roomData.type === "INDIVIDUAL"}
                  onChange={handleTypeChange}
                  className="blind"
                />
                <label htmlFor="radio02" className="customRadio">1:1 채팅</label>
              </div>
            </div>

            {/* 최대 인원 (그룹채팅일 경우만) */}
            {roomData.type === "GROUP" && (
              <div className="box">
                <label htmlFor="maxUsers" className="label">최대 인원</label>
                <Input
                  id="maxUsers"
                  type="number"
                  min="2"
                  value={roomData.maxUsers}
                  onChange={(e) => setRoomData({ ...roomData, maxUsers: parseInt(e.target.value) })}
                />
              </div>
            )}

            {/* 파일 업로드 */}
            <h4 className="imgTitle">파일 첨부</h4>
            <div className="imageUpload">
              <div className="box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="upload"
                  className="blind"
                />
                <label htmlFor="upload" className="uploadButton">이미지 첨부</label>
                <p className="imgInfoText">
                  운영정책에 어긋나는<br />
                  이미지 등록 시 이용이 제한<br />
                  될 수 있습니다.
                </p>
              </div>
              {imagePreview && (
                <div className="imagePreview">
                  <img src={imagePreview} alt="첨부된 이미지" className="previewImage" />
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="buttonGroup">
              <Button type="submit" text="생성" />
            </div>
          </form>

          {/* 닫기 버튼 */}
          <button className="closeBtn" onClick={closePopup}>
            <span className="blind">팝업 닫기</span>
          </button>
        </div>
      </div>

      {/* ✅ 생성 완료 팝업 */}
      {isCompletePopupOpen && (
        <CompletePopup
          isOpen={isCompletePopupOpen}
          message="채팅방이 성공적으로 생성되었습니다!"
          error={false}
          onClose={handleCloseCompletePopup}
        />
      )}
    </>
  );
}
