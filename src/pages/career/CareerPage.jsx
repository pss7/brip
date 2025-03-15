import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Main from "../../components/layout/Main";
import Slider from "react-slick";
import Card from "../../components/Card";
import style from "./CareerPage.module.css";
import { getCareerCourses } from "../../api/career/career";
import Loading from "../../components/Loading";
import CareerImg from "../../assets/images/sub/career_img.png";
import { useAuthStore } from "../../store/useAuthStore";

export default function CareerPage() {

  const defaultImage = "/assets/images/main/Card_Img01.png";
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("직무/직군");

  // 슬릭 설정
  const settings = {
    variableWidth: true,
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: 0,
    autoplay: true,
    speed: 1500,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          variableWidth: false,
          centerMode: false,
          slidesToShow: 1,
        }
      }
    ]
  };

  //강의 목록 데이터 불러오기
  useEffect(() => {

    async function fetchCourses() {

      setLoading(true);

      try {
        const response = await getCareerCourses({
          page: 0,
          size: 10,
          category: "오프라인",
          keyword: "",
          jobCategory: activeTab
        });
        if (response.result === "success") {
          setCourses(response.courses);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

  }, [activeTab]);

  if (!token) {
    navigate("/signin");
  }

  return (
    <Main className="subWrap">
      <div className="careerBox">
        <div className="subBox">
          <h3>커리어 교육</h3>
          <p>직무에 필요한 필수 역량 교육</p>
        </div>

        <div className={style.careerSlideBox}>
          <Slider {...settings}>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
            <Link to="#" className={style.slide}>
              <img src={CareerImg} alt="" />
            </Link>
          </Slider>
        </div>

        <div className={style.tabBox}>
          {["직무/직군", "기술/역량", "전문과정", "자격증", "워크숍"].map((tab) => (
            <button
              type="button"
              key={tab}
              className={`${style.button} ${activeTab === tab ? style.active : ""}`}
              onClick={() => { setActiveTab(tab) }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={style.cardList}>
          {loading ? (
            <Loading center />
          ) : courses.length > 0 ? (
            courses.map((course, index) => (
              <Card
                href={`/career-detail/${course.id}`}
                key={index}
                text={course.job_category}
                title={course.title}
                imgSrc={course.imgSrc ? course.imgSrc : defaultImage}
                subText={course.institute_name}
              />
            ))
          ) : (
            <p className="infoText">해당 카테고리에 강의가 없습니다.</p>
          )}
        </div>

      </div>
    </Main >
  );
}
