import { Link } from "react-router-dom";
import Container from "../components/Container";
import Main from "../components/section/Main";
import { faqData } from "../data/faqData";
import { useState } from "react";

export default function FAQPage() {


  const [activeTab, setActiveTab] = useState("전체");

  const handleTabClick = (category) => {
    setActiveTab(category);
  };

  const [openedFaqs, setOpenedFaqs] = useState({});

  const toggleAnswer = (id) => {
    setOpenedFaqs((prevState) => ({
      ...prevState,
      [id]: !prevState[id]  
    }));
  };

  return (
    <Main className="subWrap bg">

      <div className="faqBox">
        <Container className="lnbContainer">
          <div className="fqaContent">
            <div className="lnbLayoutBox">
              <aside>
                <Link to="/notice">
                  <span>
                    공지사항
                  </span>
                </Link>
                <Link to="/faq" className="active"><span>FAQ</span></Link>
                <Link to="#"><span>1:1 문의</span></Link>
                <Link to="/terms"><span>이용약관</span></Link>
                <Link to="/policy"><span>개인정보처리방침</span></Link>
              </aside>

              <div className="content">
                <div className="topBox">
                  <h4>
                    FAQ
                  </h4>
                  <div className="searchBox">
                    <div className="search">
                      <label htmlFor="search" className="blind">
                        검색
                      </label>
                      <input id="search" placeholder="키워드를 검색해주세요." />
                    </div>
                  </div>
                </div>

                <div className="faqTabBox">
                  {Object.keys(faqData).map((category) => (
                    <button
                      key={category}
                      className={activeTab === category ? "active" : ""}
                      onClick={() => handleTabClick(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="faqContentBox">
                  {faqData[activeTab]?.map((faq) => (
                    <div key={faq.id} className="faqContent">
                      <h4>
                        <button
                          className={`btn ${openedFaqs[faq.id] ? "active" : ""}`}
                          onClick={() => toggleAnswer(faq.id)}  
                        >
                          {faq.question}
                        </button>
                      </h4>
                      {openedFaqs[faq.id] && <p>{faq.answer}</p>}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </Container>
      </div >
    </Main >
  )

}