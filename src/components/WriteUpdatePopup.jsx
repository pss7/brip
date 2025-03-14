import { useState, useEffect } from "react";
import Button from "./Button";
import Select from "./Select";
import Textarea from "./Textarea";
import { updateCommunityPost } from "../api/community/community"; // 업데이트 API 함수
import CompletePopup from "./CompletePopup";

export default function WriteUpdatePopup({ isOpen, closePopup, onSuccess, initialData }) {
  // 기존 게시글 데이터를 초기값으로 설정 (게시글 수정용)
  const [category, setCategory] = useState(initialData?.category || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(initialData?.imageURL || null);
  const [content, setContent] = useState(initialData?.content || "");
  const [showPopup, setShowPopup] = useState(false);

  // 완료 팝업 상태 관리
  const [completePopupOpen, setCompletePopupOpen] = useState(false);
  const [completePopupMessage, setCompletePopupMessage] = useState("");
  const [completePopupError, setCompletePopupError] = useState(false);

  // 팝업 애니메이션 처리
  useEffect(() => {
    if (isOpen) {
      setShowPopup(true);
      // 팝업이 열릴 때 초기 데이터로 상태를 재설정
      setCategory(initialData?.category || "");
      setContent(initialData?.content || "");
      setPreviewURL(initialData?.imageURL || null);
      setSelectedFile(null);
    } else {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  // 이미지 파일 선택 시 미리보기 설정
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectURL = URL.createObjectURL(file);
      setPreviewURL(objectURL);
    }
  };

  // 게시글 업데이트 함수
  async function handleUpdate() {
    if (!category || !content) {
      setCompletePopupMessage("카테고리와 내용을 입력해주세요.");
      setCompletePopupError(true);
      setCompletePopupOpen(true);
      return;
    }

    try {
      console.log("업데이트 데이터:", { postId: initialData.post_id, category, content, selectedFile });
      const response = await updateCommunityPost({
        postId: initialData.post_id,
        category,
        content,
        image: selectedFile, // 파일이 선택된 경우만 전달
      });

      if (response?.result === "success") {
        setCompletePopupMessage("게시글이 수정되었습니다!");
        setCompletePopupError(false);
      } else {
        setCompletePopupMessage("게시글 업데이트 중 오류가 발생했습니다.");
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

  // 완료 팝업 닫기: 성공 시 부모 onSuccess 콜백 호출
  const handleCompletePopupClose = () => {
    setCompletePopupOpen(false);
    if (!completePopupError) {
      onSuccess?.();
    }
  };

  // 팝업 닫기 (X 버튼 클릭)
  const handleClose = () => {
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
        <h3>게시글 수정</h3>

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
              운영정책에 어긋나는 <br />
              이미지 등록 시 이용이 <br />
              제한될 수 있습니다.
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

        <Button text="수정" onClick={handleUpdate} />

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
