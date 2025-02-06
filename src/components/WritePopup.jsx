import { useState } from "react";
import Button from "./Button";
import Select from "./Select";
import Textarea from "./Textarea";

export default function WritePopup({ closePopup }) {

  const [image, setImage] = useState(null); // 선택된 이미지 저장 상태

  // 이미지 첨부 핸들러
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // 파일 선택
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // 이미지 미리보기 데이터 설정
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="popupWrap">
      <div className="popupBox">
        <h3>
          커뮤니티 글쓰기
        </h3>
        <Select
          className="popupSelect"
          defaultOption="카테고리 선택"
        />

        {/* 커스터마이즈된 이미지 첨부 버튼 */}
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
            <p className="infoText">
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

        <Textarea
          placeholder="내용을 입력해주세요."
          className="popupTextarea"
        />
        <Button
          text="게시"
        />

        <button
          className="closeBtn"
          onClick={closePopup}
        >
          <span className="blind">
            팝업 닫기
          </span>
        </button>
      </div>
    </div>
  )

}