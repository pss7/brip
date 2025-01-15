import Container from "../components/Container";
import Main from "../components/section/Main";
import "../assets/css/login.css";
import LoginImg from "../assets/images/login/Login_Img.svg"
import { Link } from "react-router-dom";

export default function SignUpPage() {

  return (
    <>
      <Main className="subWrap bg">

        <div className="signinBox signupBox">
          <Container>
            <div className="signinContent">

              <h3>
                회원가입
              </h3>


            </div>
          </Container>
        </div >
      </Main >
    </>
  )

}