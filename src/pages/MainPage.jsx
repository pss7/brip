
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import style from "./MainPage.module.css";
import Book from "../assets/images/main/Book_Icon.svg";
import Resume from "../assets/images/main/Resume_Icon.svg";
import JobSeeker from "../assets/images/main/JobSeeker_Icon.svg";
import Journey from "../assets/images/main/Journey_Icon.svg";
import Commercial from "../assets/images/main/Commercial_Icon.svg";
import Contact from "../assets/images/main/Contact_Icon.svg";
import Goal from "../assets/images/main/Goal_Icon.svg";
import Guide01 from "../assets/images/main/Guide_Icon01.svg";
import Guide02 from "../assets/images/main/Guide_Icon02.svg";
import Guide03 from "../assets/images/main/Guide_Icon03.svg";
import Guide04 from "../assets/images/main/Guide_Icon04.svg";
import ExampleImg from "../assets/images/main/Example_Img.png";

import CardImg01 from "../assets/images/main/Card_Img01.png";
import CardImg02 from "../assets/images/main/Card_Img02.png";
import CardImg03 from "../assets/images/main/Card_Img03.png";
import CardImg04 from "../assets/images/main/Card_Img04.png";
import CardImg05 from "../assets/images/main/Card_Img05.png";

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "../components/Card";


export default function MainPage() {

  const sliderRef01 = useRef(null);
  const sliderRef02 = useRef(null);
  
  function handlePrev(slider) {
    if (slider && slider.current) {
        slider.current.slickPrev();
    }
}

function handleNext(slider) {
    if (slider && slider.current) {
        slider.current.slickNext();
    }
}
  const settings = {
    variableWidth: true,
    dots: false,
    infinite: false,
    arrow: false,
    speed: 1500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    useTransform: false,
    autoplaySpeed: 5000,
  };

  return (
    <>

      <div id={style.visualBox}>
        <Container>
          <div className={style.visualContent}>
            비주얼영역
          </div>
        </Container>
      </div>

      <div id={style.linkBox}>
        <Container>
          <div className={style.linkContent}>
            <ul className={style.linkList}>
              <li>
                <Link to="#">
                  <div className={style.imgBox}>
                    <img src={JobSeeker} alt="" />
                  </div>
                  <h3>
                    <span>커리어탐색</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="#">
                  <div className={style.imgBox}>
                    <img src={Journey} alt="" />
                  </div>
                  <h3>
                    <span>로드맵 설계</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="#">
                  <div className={style.imgBox}>
                    <img src={Goal} alt="" />
                  </div>
                  <h3>
                    <span>채용정보</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="#">
                  <div className={style.imgBox}>
                    <img src={Book} alt="" />
                  </div>
                  <h3>
                    <span>교육과정</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="#">
                  <div className={style.imgBox}>
                    <img src={Resume} alt="" />
                  </div>
                  <h3>
                    <span>이력서관리</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="#">
                  <div className={style.imgBox}>
                    <img src={Contact} alt="" />
                  </div>
                  <h3>
                    <span>지원현황</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="#">
                  <div className={style.imgBox}>
                    <img src={Commercial} alt="" />
                  </div>
                  <h3>
                    <span>최근본공고</span>
                  </h3>
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </div>

      <div id={style.guideBox}>
        <Container>
          <div className={style.guideContent}>
            <div className={style.titleBox}>
              <h3 className={style.title}>
                커리어 성장을 돕는 직무와 역량 정보
              </h3>
              <p>
                직무에 필요한 정보와 역량 강화를 위한 실질적인 가이드를 제공합니다. <br />
                지금 바로 목표를 위한 첫걸음을 시작하세요.
              </p>
            </div>

            <Slider className={style.guideList} ref={sliderRef01} {...settings}>
              <div className={style.slide}>
                <Link to="#" style={{ backgroundColor: '#EDC2F6' }}>
                  <div className={style.imgBox} style={{ backgroundColor: '#C6FFD0' }}>
                    <img src={Guide01} alt="" />
                  </div>
                  <h4>
                    해상 여객운송 관리자
                  </h4>
                </Link>
              </div>
              <div className={style.slide}>
                <Link to="#" style={{ backgroundColor: '#CCE7FE' }}>
                  <div className={style.imgBox} style={{ backgroundColor: '#F6F0B3' }}>
                    <img src={Guide02} alt="" />
                  </div>
                  <h4>
                    해상 여객운송 관리자
                  </h4>
                </Link>
              </div>
              <div className={style.slide}>
                <Link to="#" style={{ backgroundColor: '#FFD3EB' }}>
                  <div className={style.imgBox} style={{ backgroundColor: '#CCE7FE' }}>
                    <img src={Guide03} alt="" />
                  </div>
                  <h4>
                    해상 여객운송 관리자
                  </h4>
                </Link>
              </div>
              <div className={style.slide}>
                <Link to="#" style={{ backgroundColor: '#FFEEA6' }}>
                  <div className={style.imgBox} style={{ backgroundColor: '#5E5C5C' }}>
                    <img src={Guide04} alt="" />
                  </div>
                  <h4>
                    해상 여객운송 관리자
                  </h4>
                </Link>
              </div>
              <div className={style.slide}>
                <Link to="#" style={{ backgroundColor: '#EDC2F6' }}>
                  <div className={style.imgBox} style={{ backgroundColor: '#C6FFD0' }}>
                    <img src={Guide01} alt="" />
                  </div>
                  <h4>
                    해상 여객운송 관리자
                  </h4>
                </Link>
              </div>
              <div className={style.slide}>
                <Link to="#" style={{ backgroundColor: '#CCE7FE' }}>
                  <div className={style.imgBox} style={{ backgroundColor: '#F6F0B3' }}>
                    <img src={Guide02} alt="" />
                  </div>
                  <h4>
                    해상 여객운송 관리자
                  </h4>
                </Link>
              </div>
              <div className={style.slide}>
                <Link to="#" style={{ backgroundColor: '#FFD3EB' }}>
                  <div className={style.imgBox} style={{ backgroundColor: '#CCE7FE' }}>
                    <img src={Guide03} alt="" />
                  </div>
                  <h4>
                    해상 여객운송 관리자
                  </h4>
                </Link>
              </div>
              <div className={style.slide}>
                <Link to="#" style={{ backgroundColor: '#FFEEA6' }}>
                  <div className={style.imgBox} style={{ backgroundColor: '#5E5C5C' }}>
                    <img src={Guide04} alt="" />
                  </div>
                  <h4>
                    해상 여객운송 관리자
                  </h4>
                </Link>
              </div>
            </Slider>

            <div className={style.control}>
              <button
                className={style.prevBtn}
                onClick={() => handlePrev(sliderRef01)}
              >
                <span className="blind">이전</span>
              </button>
              <button
                className={style.nextBtn}
                onClick={() => handleNext(sliderRef01)}
              >
                <span className="blind">다음</span>
              </button>
            </div>

          </div>
        </Container>
      </div>

      <div id={style.educationBox}>
        <Container>
          <div className={style.educationContent}>
            <div className={style.titleBox}>
              <h3 className={style.title}>
                직무에 필요한 필수 역량 교육
              </h3>
            </div>

            <div className={style.tabBox}>
              <ul className={style.tab}>
                <li>
                  <Link to="#" className={style.active}>
                    직무/직군
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    기술/역량
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    전문과정
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    자격증
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    워크숍
                  </Link>
                </li>
              </ul>
            </div>

            <div className={style.cardList}>
              <Slider ref={sliderRef02} className={style.cardSlider} {...settings}>
                <div className={style.slide}>
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례
특강"
                    imgSrc={CardImg01}
                    subText="데이터리안"
                  />
                </div>
                <div className={style.slide}>
                  <Card
                    text="직무직군"
                    title="[에듀윌] 물류관리사 0원 
합격패스"
                    imgSrc={CardImg04}
                    subText="데이터리안"
                  />
                </div>
                <div className={style.slide}>
                  <Card
                    text="직무직군"
                    title="이춘길 전 강좌 무료강의
합격반"
                    imgSrc={CardImg05}
                    subText="데이터리안"
                  />
                </div>
                <div className={style.slide}>
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례
특강"
                    imgSrc={CardImg01}
                    subText="데이터리안"
                  />
                </div>
                <div className={style.slide}>
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례
특강"
                    imgSrc={CardImg04}
                    subText="데이터리안"
                  />
                </div>
                <div className={style.slide}>
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례
특강"
                    imgSrc={CardImg05}
                    subText="데이터리안"
                  />
                </div>
                <div className={style.slide}>
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례
특강"
                    imgSrc={CardImg01}
                    subText="데이터리안"
                  />
                </div>
                <div className={style.slide}>
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례
특강"
                    imgSrc={CardImg01}
                    subText="데이터리안"
                  />
                </div>
              </Slider>
              <div className={style.control}>
                <button
                  className={style.prevBtn}
                  onClick={() => handlePrev(sliderRef02)}
                >
                  <span className="blind">이전</span>
                </button>
                <button
                  className={style.nextBtn}
                  onClick={() => handleNext(sliderRef02)}
                >
                  <span className="blind">다음</span>
                </button>
              </div>
            </div>

          </div>
        </Container>
      </div>

      <div id={style.careerBox}>
        <Container>
          <div className={style.careerContent}>
            <div className={style.titleBox}>
              <h3 className={style.title}>
                최신 채용공고와 맞춤형 커리어
              </h3>
            </div>

            <div className={style.cardList}>
              <Card
                className="cardType"
                text="씨아이지해운(주)"
                title="해운항만물류 실무와 사례
특강"
                imgSrc={CardImg02}
                subText="~01.15(수)"
              >
                <button className={style.linkBtn}>
                  <span className="blind">
                    좋아요
                  </span>
                </button>
              </Card>
              <Card
                className="cardType"
                text="씨아이지해운(주)"
                title="해운항만물류 실무와 사례
특강"
                imgSrc={CardImg03}
                subText="~01.15(수)"
              >
                <button className={style.linkBtn}>
                  <span className="blind">
                    좋아요
                  </span>
                </button>
              </Card>
              <Card
                className="cardType"
                text="씨아이지해운(주)"
                title="해운항만물류 실무와 사례
특강"
                imgSrc={CardImg02}
                subText="~01.15(수)"
              >
                <button className={style.linkBtn}>
                  <span className="blind">
                    좋아요
                  </span>
                </button>
              </Card>
              <Card
                className="cardType"
                text="씨아이지해운(주)"
                title="해운항만물류 실무와 사례
특강"
                imgSrc={CardImg03}
                subText="~01.15(수)"
              >
                <button className={style.linkBtn}>
                  <span className="blind">
                    좋아요
                  </span>
                </button>
              </Card>
            </div>

            <div className={style.cardList}>
              <Card
                className="cardType"
                text="씨아이지해운(주)"
                title="해운항만물류 실무와 사례
특강"
                imgSrc={CardImg02}
                subText="~01.15(수)"
              >
                <button className={style.linkBtn}>
                  <span className="blind">
                    좋아요
                  </span>
                </button>
              </Card>
              <Card
                className="cardType"
                text="씨아이지해운(주)"
                title="해운항만물류 실무와 사례
특강"
                imgSrc={CardImg03}
                subText="~01.15(수)"
              >
                <button className={style.linkBtn}>
                  <span className="blind">
                    좋아요
                  </span>
                </button>
              </Card>
              <Card
                className="cardType"
                text="씨아이지해운(주)"
                title="해운항만물류 실무와 사례
특강"
                imgSrc={CardImg02}
                subText="~01.15(수)"
              >
                <button className={style.linkBtn}>
                  <span className="blind">
                    좋아요
                  </span>
                </button>
              </Card>
              <Card
                className="cardType"
                text="씨아이지해운(주)"
                title="해운항만물류 실무와 사례
특강"
                imgSrc={CardImg03}
                subText="~01.15(수)"
              >
                <button className={style.linkBtn}>
                  <span className="blind">
                    좋아요
                  </span>
                </button>
              </Card>
            </div>

          </div>
        </Container>
      </div>

      <div id={style.exampleBox}>
        <Container>
          <div className={style.exampleContent}>
            <div className={style.imgBox}>
              <Link to="#">
                <img src={ExampleImg} alt="" />
              </Link>
            </div>
            <div className={style.textBox}>
              <span className={style.text}>
                성공사례
              </span>
              <p className={style.title}
              >
                선박 운영 관리자로  성공한 김현수님의 이야기
              </p>
              <p className={style.content}>
                김현우님(35)은 대학 시절 기계공학을 전공하며 막연히 자동차나 항공 분야에 진출할 것을 꿈꿨습니다. 하지만 졸업 직전, 해운 산업에 대해 배우게 되면서 선박의 기계와 전기 시스템을 설계하는 일에 흥미를 느끼게 됩니다. “친환경 선박 기술이 각광받고 있다는 걸 알게 된 게 결정적이었어요. 앞으로 중요한 산업이 될 거라고 확신했습니다.” <br />
                그는 졸업 후 국내 조선소에 신입 엔지니어로 입사하며 해운업계에 첫발을 내딛습니다적이었어요. 앞으로 중요한 산업이 될 거라고 확신했습니다.”그는 졸업 후 국내 조선소에 신입 엔지니어로 입사하며 해운업계에 첫발을 내딛습니다.그는 졸업 후 국내 조선소에 신입 엔지니어로 입사하며 해운업계에 첫발을 내딛습니다적이었어요. 앞으로 중요한 산업이 될 거라고 확신했습니다.”그는 졸업 후 국내 조선소에 신입 엔지니어로 입사하며 해운업계에 첫발을 내딛습니다 ...
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  )

}