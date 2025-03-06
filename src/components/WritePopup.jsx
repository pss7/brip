import { useState, useEffect } from "react";
import Button from "./Button";
import Select from "./Select";
import Textarea from "./Textarea";
import { postCommunity } from "../api/community/community";
import CompletePopup from "./CompletePopup";

export default function WritePopup({ isOpen, closePopup, onSuccess }) {

  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [content, setContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // 완료 팝업
  const [completePopupOpen, setCompletePopupOpen] = useState(false);
  const [completePopupMessage, setCompletePopupMessage] = useState("");
  const [completePopupError, setCompletePopupError] = useState(false);

  // 팝업 애니메이션
  useEffect(() => {
    if (isOpen) {
      setShowPopup(true);
    } else {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 이미지 파일 선택 → 미리보기
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectURL = URL.createObjectURL(file);
      setPreviewURL(objectURL);
    }
  };

  // 게시글 등록
  async function handleCommunity() {
    if (!category || !content) {
      setCompletePopupMessage("카테고리와 내용을 입력해주세요.");
      setCompletePopupError(true);
      setCompletePopupOpen(true);
      return;
    }

    try {
      const response = await postCommunity({
        category,
        content,
        file: selectedFile,
      });

      if (response?.result === "success") {
        // 등록 성공
        setCompletePopupMessage("게시가 완료되었습니다!");
        setCompletePopupError(false);
      } else {
        setCompletePopupMessage("게시 중 오류가 발생했습니다.");
        setCompletePopupError(true);
      }
    } catch (error) {
      console.error("서버 오류:", error);
      const serverMessage = error.response?.data?.message || "서버 오류가 발생했습니다.";
      setCompletePopupMessage(serverMessage);
      setCompletePopupError(true);
    }

    setCompletePopupOpen(true);
  }

  // 완료 팝업 닫기
  const handleCompletePopupClose = () => {
    setCompletePopupOpen(false);

    // 등록 성공 시 부모의 onSuccess 콜백 호출 → 목록 리로드
    if (!completePopupError) {
      onSuccess?.(); // 부모에서 fetchCommunity() 호출
    }
  };

  // 팝업 닫기(X 버튼)
  const handleClose = () => {
    // 팝업 닫기
    closePopup();

    // 입력값 초기화
    setCategory("");
    setContent("");
    setSelectedFile(null);
    setPreviewURL(null);
  };

  return (
    <div className={`popupWrap ${showPopup ? "active" : ""}`}>
      <div className="popupBox scroll">
        <h3>커뮤니티 글쓰기</h3>

        <Select
          className="popupSelect"
          id="category-select"
          hiddenText="카테고리 선택"
          options={["노하우&Q&A", "업종별/연차별", "정보공유"]}
          value={category}
          onChange={(newValue) => setCategory(newValue)}
        />

        <div className="imageUpload">
          <div className="box">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="upload"
              className="blind"
            />
            <label htmlFor="upload" className="uploadButton">
              이미지 첨부
            </label>
            <p className="imgInfoText">
              운영정책에 어긋나는<br />
              이미지 등록 시 이용이 제한<br />
              될 수 있습니다.
            </p>
          </div>

          {previewURL && (
            <div className="imagePreview">
              <img src={previewURL} alt="미리보기" className="previewImage" />
            </div>
          )}
        </div>

        <Textarea
          placeholder="내용을 입력해주세요."
          className="popupTextarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Button text="게시" onClick={handleCommunity} />

        <button className="closeBtn" onClick={handleClose}>
          <span className="blind">팝업 닫기</span>
        </button>
      </div>

      {completePopupOpen && (
        <CompletePopup
          isOpen={completePopupOpen}
          message={completePopupMessage}
          error={completePopupError}
          onClose={handleCompletePopupClose}
        />
      )}
    </div>
  );
}
