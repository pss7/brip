import { useState, useEffect } from "react";
import Button from "./Button";
import Select from "./Select";
import Textarea from "./Textarea";
import { postCommunity } from "../api/community/community";
import CompletePopup from "./CompletePopup";

export default function WritePopup({ isOpen, closePopup }) {

  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // CompletePopup 상태 관리
  const [completePopupOpen, setCompletePopupOpen] = useState(false);
  const [completePopupMessage, setCompletePopupMessage] = useState("");
  const [completePopupError, setCompletePopupError] = useState(false);

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

  // 이미지 업로드 핸들러
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 게시글 등록 API 호출 및 유효성 검사
  async function handleCommunity() {
    if (!category || !content) {
      setCompletePopupMessage("카테고리와 내용을 입력해주세요.");
      setCompletePopupError(true);
      setCompletePopupOpen(true);
      return;
    }

    try {
      const response = await postCommunity({ category, content, imgUrl: image });

      if (response) {
        setCompletePopupMessage("게시가 완료되었습니다!");
        setCompletePopupError(false);
      } else {
        setCompletePopupMessage("게시 중 오류가 발생했습니다.");
        setCompletePopupError(true);
      }
    } catch (error) {
      console.error("error", error);
      setCompletePopupMessage("서버 오류가 발생했습니다.");
      setCompletePopupError(true);
    }

    setCompletePopupOpen(true);
  }

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

        {/* 이미지 업로드 */}
        <div className="imageUpload">
          <div className="box">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="upload"
              className="blind"
            />
            <label htmlFor="upload" className="uploadButton">이미지 첨부</label>
            <p className="imgInfoText">
              운영정책에 어긋나는 <br />
              이미지 등록 시 이용이 제한 <br />
              될 수 있습니다.
            </p>
          </div>
          {image && (
            <div className="imagePreview">
              <img src={image} alt="첨부된 이미지" className="previewImage" />
            </div>
          )}
        </div>

        {/* 게시글 입력 */}
        <Textarea
          placeholder="내용을 입력해주세요."
          className="popupTextarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 게시 버튼 */}
        <Button text="게시" onClick={handleCommunity} />

        {/* 닫기 버튼 */}
        <button className="closeBtn" onClick={closePopup}>
          <span className="blind">팝업 닫기</span>
        </button>
      </div>

      {
        completePopupOpen && (
          <CompletePopup
            isOpen={completePopupOpen}
            message={completePopupMessage}
            error={completePopupError}
            onClose={() => setCompletePopupOpen(false)}
          />
        )
      }
    </div>

  );
}
