import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

export default function AddPopup({ closePopup }) {

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
          채팅방 생성
        </h3>

        <div className="box">
          <label htmlFor="name" className="label">
            채팅방 이름
          </label>
          <Input
            id="name"
            placeholder="채팅방 이름 입력"
          />
        </div>

        <div className="box">
          <h4>
            파일 첨부
          </h4>
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
        </div>

        <div className="box">
          <label htmlFor="setting" className="label">
            정원 설정
          </label>
          <Input
            id="setting"
            placeholder="인원 입력"
          />
        </div>

        <Button
          text="생성"
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