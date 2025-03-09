import { useState } from "react";
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

  // ✅ 채팅방 유형 변경 핸들러
  const handleTypeChange = (event) => {
    setRoomData({ ...roomData, type: event.target.value });
  };

  // ✅ 파일 업로드 핸들러 (실제 업로드 구현 필요)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setRoomData({ ...roomData, imageUrl: reader.result }); // Replace with actual URL after upload
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

    console.log("CREATE_ROOM 호출전");
    socket.send(
      JSON.stringify({
        protocol: "CREATE_ROOM",
        ...roomData,
      })
    );
    console.log("CREATE_ROOM 호출후");

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
              <label htmlFor="roomName" className="label">
                채팅방 이름
              </label>
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
                <label className="customRadio">
                  <input
                    type="radio"
                    name="chatType"
                    value="GROUP"
                    checked={roomData.type === "GROUP"}
                    onChange={handleTypeChange}
                    className="blind"
                  />
                  그룹 채팅
                </label>
                <label className="customRadio">
                  <input
                    type="radio"
                    name="chatType"
                    value="INDIVIDUAL"
                    checked={roomData.type === "INDIVIDUAL"}
                    onChange={handleTypeChange}
                    className="blind"
                  />
                  1:1 채팅
                </label>
              </div>
            </div>

            {/* 최대 인원 (그룹채팅일 경우만) */}
            {roomData.type === "GROUP" && (
              <div className="box">
                <label htmlFor="maxUsers" className="label">
                  최대 인원
                </label>
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
            <div className="box">
              <h4>대표 이미지</h4>
              <div className="imageUpload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="upload"
                  className="blind"
                />
                <label htmlFor="upload" className="uploadButton">
                  이미지 첨부
                </label>
                {imagePreview && (
                  <div className="imagePreview">
                    <img src={imagePreview} alt="첨부된 이미지" className="previewImage" />
                  </div>
                )}
              </div>
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
