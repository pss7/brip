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
import ExampleImg from "../assets/images/main/Example_Img.png";
import Guide01 from "../assets/images/main/Guide_Icon01.svg";
import Guide02 from "../assets/images/main/Guide_Icon02.svg";
import Guide03 from "../assets/images/main/Guide_Icon03.svg";
import Guide04 from "../assets/images/main/Guide_Icon04.svg";
import MainImg from "../assets/images/main/Main_Img01.png";
import Slider from "react-slick";
import AOS from "aos";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "aos/dist/aos.css";
import Card from "../components/Card";
import "../styles/style.css";
import BgCard from "../components/BgCard";
import { useAuthStore } from "../store/useAuthStore";
import { getCareerCourses, getJopList } from "../api/career/career";
import { getEmploymentList } from "../api/employment/employment";
import Loading from "../components/Loading";

export default function MainPage() {

  const defaultImage = "/assets/images/main/Card_Img01.png";

  const [jobList, setJobList] = useState([]);

  //로딩 상태 관리
  const [loadingEmployment, setLoadingEmployment] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingJobList, setLoadingJobList] = useState(false);

  // 4가지 Guide 이미지 배열 (순환 적용)
  const defaultGuideImages = [Guide01, Guide02, Guide03, Guide04];

  // 4가지 기본 색상 (반복 적용)
  const defaultBgColors = ["#EDC2F6", "#CCE7FE", "#FFD3EB", "#FFEEA6"];
  const defaultImgBgColors = ["#C6FFD0", "#F6F0B3", "#CCE7FE", "#5E5C5C"];

  // 유저정보
  const { token } = useAuthStore();

  // 교육과정 목록
  const [courses, setCourses] = useState([]);

  //채용공고 목록 (서버에서 로드)
  const [employmentData, setEmploymentData] = useState([]);

  // 탭 상태
  const [activeTab, setActiveTab] = useState("직무/직군");

  // 슬라이더
  const sliderRefMain = useRef(null);
  const sliderRef01 = useRef(null);
  const sliderRef02 = useRef(null);

  // 슬라이더 설정
  const mainSettings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: true,
    responsive: [
      {
        breakpoint: 577,
        settings: {
          centerMode: false,
        },
      },
    ],
  };

  const settings = {
    variableWidth: true,
    dots: false,
    infinite: false,
    arrow: false,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    useTransform: false,
    autoplaySpeed: 3000,
  };

  // 첫 로드 시 AOS init
  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
  }, []);

  // 탭 클릭
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 슬라이더 제어
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

  // 좋아요 토글 (현재는 로컬 상태만 처리)
  const handleLikeToggle = (jobId) => {
    // employmentData 배열에서 id가 jobId인 item의 is_liked만 토글
    setEmploymentData((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, is_liked: job.is_liked ? 0 : 1 } : job
      )
    );
  };

  //커리어 교육 데이터 불러오기
  useEffect(() => {
    async function fetchCourses() {

      setLoadingCourses(true);

      try {
        const response = await getCareerCourses({
          page: 0,
          size: 12,
          category: "",
          keyword: "",
          jobCategory: activeTab,
        });
        if (response.result === "success") {
          setCourses(response.courses);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoadingCourses(false);
      }
    }

    fetchCourses();

  }, [activeTab]);

  //채용공고 데이터 불러오기
  useEffect(() => {

    async function fetchEmploymentData() {

      setLoadingEmployment(true);

      try {
        const response = await getEmploymentList({
          page: 1,
          pageSize: 8,
        });
        if (response.result === "success") {
          setEmploymentData(response.employs);
        }
      } catch (error) {
        console.error("채용공고 목록 불러오기 에러:", error);
      } finally {
        setLoadingEmployment(false);
      }
    }

    fetchEmploymentData();

  }, []);

  useEffect(() => {
    async function fetchJobList() {

      setLoadingJobList(true);

      try {
        const response = await getJopList();
        if (response && response.careers) {
          setJobList(response.careers);
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoadingJobList(false);
      }
    }

    fetchJobList();
  }, []);

  return (
    <>
      <div id={style.visualBox}>
        <Container>
          <div className={style.visualContent}>
            <Slider className={style.visualSlider} ref={sliderRefMain} {...mainSettings}>
              <div className={style.visualBox}>
                <div className={style.imgBox}>
                  <img src={MainImg} alt="" />
                </div>
                <div className={style.textBox}>
                  <h3>로드맵 설계</h3>
                  <p>
                    <strong>커리어 성장</strong>을 위한 첫걸음, <br />
                    지금 <strong>로드맵</strong>을 설정해보세요!
                  </p>
                </div>
              </div>
              <div className={`${style.visualBox} ${style.visualBox02}`}>
                <div className={style.imgBox}>
                  <img src={MainImg} alt="" />
                </div>
                <div className={style.textBox}>
                  <h3>로드맵 설계</h3>
                  <p>
                    <strong>커리어 성장</strong>을 위한 첫걸음, <br />
                    지금 <strong>로드맵</strong>을 설정해보세요!
                  </p>
                </div>
              </div>
              <div className={`${style.visualBox} ${style.visualBox03}`}>
                <div className={style.imgBox}>
                  <img src={MainImg} alt="" />
                </div>
                <div className={style.textBox}>
                  <h3>로드맵 설계</h3>
                  <p>
                    <strong>커리어 성장</strong>을 위한 첫걸음, <br />
                    지금 <strong>로드맵</strong>을 설정해보세요!
                  </p>
                </div>
              </div>
            </Slider>
          </div>
        </Container>
      </div>

      {!token && (
        <div id={style.loginLinkBox} data-aos="fade-up">
          <Container>
            <div className={style.loginLinkContent}>
              <Link to="/signin">
                <p>
                  <strong>로그인</strong>하고 더 유용한 정보를 얻어보세요!
                </p>
              </Link>
            </div>
          </Container>
        </div>
      )}

      <div id={style.linkBox} data-aos="fade-up">
        <Container>
          <div className={style.linkContent}>
            <ul className={style.linkList}>
              <li>
                <Link to="/careerexploration">
                  <div className={style.imgBox}>
                    <img src={JobSeeker} alt="" />
                  </div>
                  <h3>
                    <span>커리어탐색</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="/roadmap-info">
                  <div className={style.imgBox}>
                    <img src={Journey} alt="" />
                  </div>
                  <h3>
                    <span>로드맵 설계</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="/employment">
                  <div className={style.imgBox}>
                    <img src={Goal} alt="" />
                  </div>
                  <h3>
                    <span>채용정보</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="/career">
                  <div className={style.imgBox}>
                    <img src={Book} alt="" />
                  </div>
                  <h3>
                    <span>교육과정</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="/resume">
                  <div className={style.imgBox}>
                    <img src={Resume} alt="" />
                  </div>
                  <h3>
                    <span>이력서관리</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="/apply">
                  <div className={style.imgBox}>
                    <img src={Contact} alt="" />
                  </div>
                  <h3>
                    <span>지원현황</span>
                  </h3>
                </Link>
              </li>
              <li>
                <Link to="/activity">
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
            <div className={style.titleBox} data-aos="fade-up">
              <h3 className={style.title}>커리어 성장을 돕는 직무와 역량 정보</h3>
              <p>
                직무에 필요한 정보와 역량 강화를 위한 실질적인 가이드를 제공합니다. <br />
                지금 바로 목표를 위한 첫걸음을 시작하세요.
              </p>
            </div>

            <div data-aos="fade-up">

              {token ? (
                loadingJobList ? (
                  <Loading />
                ) : jobList.length > 0 ? (
                  <Slider className={style.guideList} ref={sliderRef01} {...settings}>
                    {jobList.map((job, index) => (
                      <div key={job.id} className={style.slide}>
                        <BgCard
                          href={`/careerexploration-detail/${job.id}`}
                          title={job.name}
                          imgSrc={
                            job.imgSrc ||
                            defaultGuideImages[index % defaultGuideImages.length]
                          }
                          bg={{
                            backgroundColor:
                              job.bgColor ||
                              defaultBgColors[index % defaultBgColors.length],
                          }}
                          imgBg={{
                            backgroundColor:
                              job.imgBgColor ||
                              defaultImgBgColors[index % defaultImgBgColors.length],
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <p className="infoText">등록된 직무가 없습니다.</p>
                )
              ) : (
                <p className="infoText">로그인 후 확인할 수 있습니다.</p>
              )}

            </div>

            <div className={style.control} data-aos="fade-up">
              <button className={style.prevBtn} onClick={() => handlePrev(sliderRef01)}>
                <span className="blind">이전</span>
              </button>
              <button className={style.nextBtn} onClick={() => handleNext(sliderRef01)}>
                <span className="blind">다음</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      <div id={style.educationBox}>
        <Container>
          <div className={style.educationContent}>
            <div className={style.titleBox} data-aos="fade-up">
              <h3 className={style.title}>직무에 필요한 필수 역량 교육</h3>
            </div>

            <div className={style.tabBox} data-aos="fade-up">
              <ul className={style.tab}>
                {["직무/직군", "기술/역량", "전문과정", "자격증", "워크숍"].map((tab) => (
                  <li key={tab}>
                    <Link
                      to="#"
                      className={activeTab === tab ? style.active : ""}
                      onClick={() => handleTabClick(tab)}
                    >
                      {tab}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={style.cardList} data-aos="fade-up">
              {token ? (
                loadingCourses ? (
                  <Loading />
                ) : courses.length > 0 ? (
                  <Slider className={style.cardSlider} ref={sliderRef02} {...settings}>
                    {courses.map((data, index) => (
                      <div key={index} data-aos="fade-up">
                        <Card
                          href={`/career-detail/${data.id}`}
                          text={data.job_category || activeTab}
                          title={data.title}
                          imgSrc={data.imgSrc ? data.imgSrc : defaultImage}
                          subText={data.subText}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <p className="infoText">해당 카테고리에 강의가 없습니다.</p>
                )
              ) : (
                <p className="infoText">로그인 후 확인할 수 있습니다.</p>
              )}
            </div>

            <div className={style.control} data-aos="fade-up">
              <button className={style.prevBtn} onClick={() => handlePrev(sliderRef02)}>
                <span className="blind">이전</span>
              </button>
              <button className={style.nextBtn} onClick={() => handleNext(sliderRef02)}>
                <span className="blind">다음</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      <div id={style.careerBox}>
        <Container>
          <div className={style.careerContent}>
            <div className={style.titleBox} data-aos="fade-up">
              <h3 className={style.title}>최신 채용공고와 맞춤형 커리어</h3>
            </div>

            <div className={style.cardList} data-aos="fade-up">
              {
                token ? (
                  loadingEmployment ? (
                    <Loading />
                  ) : employmentData.length > 0 ? (
                    employmentData.map((job) => (
                      <Card
                        key={job.id}
                        href={`/employment-detail/${job.id}`}
                        className="cardType"
                        text={job.company_name || "회사명 미등록"}
                        imgSrc={defaultImage}
                        title={job.title || "공고 제목 미등록"}
                        date={`마감일: ${job.deadline || "미정"}`}
                        isLiked={job.is_liked === 1}
                      // handleLikeToggle={() => handleLikeToggle(job.id)}
                      />
                    ))
                  ) : (
                    <p className="infoText">등록된 채용공고가 없습니다.</p>
                  )
                ) : (
                  <p className="infoText">로그인 후 확인할 수 있습니다.</p>
                )
              }
            </div>
          </div>
        </Container>
      </div>

      <div id={style.exampleBox}>
        <Container>
          <div className={style.exampleContent}>
            <div className={style.imgBox} data-aos="fade-up">
              <Link to="#">
                <img src={ExampleImg} alt="" />
              </Link>
            </div>
            <div className={style.textBox} data-aos="fade-up">
              <span className={style.text}>성공사례</span>
              <p className={style.title}>선박 운영 관리자로 성공한 김현수님의 이야기</p>
              <p className={style.content}>
                김현우님(35)은 대학 시절 기계공학을 전공하며 막연히 자동차나 항공 분야에 진출할 것을 꿈꿨습니다. 하지만 졸업 직전, 해운 산업에 대해 배우게 되면서 선박의 기계와 전기 시스템을 설계하는 일에 흥미를 느끼게 됩니다. “친환경 선박 기술이 각광받고 있다는 걸 알게 된 게 결정적이었어요. 앞으로 중요한 산업이 될 거라고 확신했습니다.” <br />
                그는 졸업 후 국내 조선소에 신입 엔지니어로 입사하며 해운업계에 첫발을 내딛습니다적이었어요. 앞으로 중요한 산업이 될 거라고 확신했습니다.”그는 졸업 후 국내 조선소에 신입 엔지니어로 입사하며 해운업계에 첫발을 내딛습니다.그는 졸업 후 국내 조선소에 신입 엔지니어로 입사하며 해운업계에 첫발을 내딛습니다적이었어요. 앞으로 중요한 산업이 될 거라고 확신했습니다.”그는 졸업 후 국내 조선소에 신입 엔지니어로 입사하며 해운업계에 첫발을 내딛습니다 ...
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
