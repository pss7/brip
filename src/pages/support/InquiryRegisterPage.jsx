import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Main from "../../components/layout/Main";
import Button from "../../components/Button";
import style from "./InquiryRegisterPage.module.css";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";
import FileUpload from "../../components/FileUpload";
import { createInquiry } from "../../api/support/inquiry";
import Input from "../../components/Input";

export default function InquiryRegisterPage() {
  const navigate = useNavigate();

  // 상태 관리
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState(""); // 제목 상태 추가
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // 여러 이미지 상태 관리
  const [file, setFile] = useState(null); // 추가적인 파일 상태 관리 (필요시)

  // 카테고리 상태 업데이트 함수
  function handleCategoryChange(newCategory) {
    setSelectedCategory(newCategory);
  }

  // 제목 상태 업데이트 함수
  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  // 내용 상태 업데이트 함수
  function handleContentChange(e) {
    setContent(e.target.value);
  }

  // 파일 상태 업데이트 함수
  const handleFileChange = (newFile) => {
    setFile(newFile); // 파일 상태 업데이트
  };

  // 이미지 상태 업데이트 함수
  const handleImageChange = (newImages) => {
    setImages(newImages); // 여러 이미지를 상태로 저장
  };

  // 제출 함수
  async function handleSubmit(e) {
    e.preventDefault();

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("category", selectedCategory);
    formData.append("title", title); // 제목 추가
    formData.append("content", content); // 내용 추가

    // 이미지들 추가 (파일 여러 개 처리)
    images.forEach((image) => {
      formData.append("images", image); // 각 이미지를 images 배열에 추가
    });

    // 파일이 있을 경우 파일 추가 (선택 사항)
    if (file) {
      formData.append("file", file); // 파일 추가
    }

    try {
      const response = await createInquiry(formData); // FormData로 API 호출
      if (response) {
        navigate("/inquiry"); // 성공 시 1:1 문의 목록으로 리디렉션
      } else {
        console.error("문의 등록 실패");
      }
    } catch (error) {
      console.error("error:", error);
    }
  }

  return (
    <Main className="subWrap bg">
      <div className="inquiryBox">
        <Container className="lnbContainer">
          <div className="inquiryContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice"><span>공지사항</span></Link>
                <Link to="/faq"><span>FAQ</span></Link>
                <Link to="/inquiry" className="active"><span>1:1 문의</span></Link>
                <Link to="/terms"><span>이용약관</span></Link>
                <Link to="/policy"><span>개인정보처리방침</span></Link>
              </aside>

              <div className="content">
                <h4>1:1 문의 등록</h4>
                <p className={style.inquiryInfoText}>
                  문의량이 많을 시 답변이 지연될 수 있습니다. <br />
                  답변은 평일 9:30 ~ 17:00에 등록되며, 가능한 빨리 답변드리겠습니다.
                </p>

                <form className={style.form} onSubmit={handleSubmit}>
                  <div className={style.selectBox}>
                    <Select
                      className={style.select}
                      id="selectCategory"
                      hiddenText="카테고리 선택"
                      options={["서비스관련", "채용관련"]}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    />
                  </div>

                  <div className={style.titleBox}>
                    <Input
                      type="text"
                      placeholder="제목을 입력해주세요"
                      value={title}
                      onChange={handleTitleChange}
                    />
                  </div>

                  <div className={style.textareaBox}>
                    <Textarea
                      hiddenText="내용입력"
                      placeholder="내용을 입력해주세요"
                      className={style.textarea}
                      value={content}
                      onChange={handleContentChange}
                    />
                  </div>

                  <div className={style.fileUploadBox}>
                    <FileUpload onChange={handleImageChange} /> {/* 이미지 업로드 컴포넌트 */}
                  </div>

                  <Button
                    text="등록"
                    customClass={style.btn}
                    type="submit"
                  />
                </form>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Main>
  );
}
