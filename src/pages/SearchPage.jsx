import Card from "../components/Card";
import Container from "../components/Container";
import Main from "../components/section/Main";
import style from "./SearchPage.module.css";
import "../assets/css/style.css";
import Guide01 from "../assets/images/main/Guide_Icon01.svg";
import Guide02 from "../assets/images/main/Guide_Icon02.svg";
import Guide03 from "../assets/images/main/Guide_Icon03.svg";
import Guide04 from "../assets/images/main/Guide_Icon04.svg";
import CardImg02 from "../assets/images/main/Card_Img02.png";
import CardImg03 from "../assets/images/main/Card_Img03.png";
import CardImg06 from "../assets/images/main/Card_Img06.png";
import CardImg07 from "../assets/images/main/Card_Img07.png";
import BgCard from "../components/BgCard";

export default function SearchPage() {

  return (
    <>
      <Main className="subWrap">

        <div className={style.searchBox}>
          <Container>
            <div className={style.searchContent}>
              <div className={style.searchTop}>
                <h3>
                  검색결과
                </h3>
                <p>
                  <strong>"해운"</strong>에 대한 검색결과입니다.
                </p>
              </div>

              <div className={style.searchResultBox}>
                <em className={style.searchResultText}>
                  채용 <span>23</span>
                </em>

                <div className={`cardContainer ${style.searchResultList}`}>
                  <Card
                    className="cardType"
                    text="씨아이지해운(주)"
                    title="해운항만물류 실무와 사례
                특강"
                    imgSrc={CardImg02}
                    subText="~01.15(수)"
                  >
                  </Card>

                  <Card
                    className="cardType"
                    text="씨아이지해운(주)"
                    title="해운항만물류 실무와 사례
                특강"
                    imgSrc={CardImg03}
                    subText="~01.15(수)"
                  >
                  </Card>

                  <Card
                    className="cardType"
                    text="씨아이지해운(주)"
                    title="해운항만물류 실무와 사례
                특강"
                    imgSrc={CardImg02}
                    subText="~01.15(수)"
                  >
                  </Card>

                  <Card
                    className="cardType"
                    text="씨아이지해운(주)"
                    title="해운항만물류 실무와 사례
                특강"
                    imgSrc={CardImg03}
                    subText="~01.15(수)"
                  >
                  </Card>

                </div>

              </div>

              <div className={style.searchResultBox}>
                <em className={style.searchResultText}>
                  커리어 <span>23</span>
                </em>

                <div className={`cardContainer ${style.searchResultList}`}>
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례 특강"
                    imgSrc={CardImg06}
                    subText="데이터리안"
                  />
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례 특강"
                    imgSrc={CardImg07}
                    subText="데이터리안"
                  />
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례 특강"
                    imgSrc={CardImg07}
                    subText="데이터리안"
                  />
                  <Card
                    text="직무직군"
                    title="해운항만물류 실무와 사례 특강"
                    imgSrc={CardImg07}
                    subText="데이터리안"
                  />
                </div>

              </div>

              <div className={style.searchResultBox}>
                <em className={style.searchResultText}>
                  직무<span>23</span>
                </em>
                <div className={`cardContainer cardContainerSt ${style.searchResultList}`}>
                  <BgCard
                    bg={{ backgroundColor: '#FFD3EB' }}
                    imgBg={{ backgroundColor: '#CCE7FE' }}
                    imgSrc={Guide03}
                    title="해상 여객운송 관리자"
                  />
                  <BgCard
                    bg={{ backgroundColor: '#CCE7FE' }}
                    imgBg={{ backgroundColor: '#F6F0B3' }}
                    imgSrc={Guide02}
                    title="해상 여객운송 관리자"
                  />
                  <BgCard
                    bg={{ backgroundColor: '#FFD3EB' }}
                    imgBg={{ backgroundColor: '#CCE7FE' }}
                    imgSrc={Guide03}
                    title="해상 여객운송 관리자"
                  />
                  <BgCard
                    bg={{ backgroundColor: '#FFEEA6' }}
                    imgBg={{ backgroundColor: '#5E5C5C' }}
                    imgSrc={Guide04}
                    title="해상 여객운송 관리자"
                  />
                </div>
              </div>

            </div>
          </Container>
        </div>

      </Main>
    </>
  )

}