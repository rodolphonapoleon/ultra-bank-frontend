import { UserContext } from "../context";
import LoginLogoutButton from "./loginlogoutbutton";
import { useContext } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import imageLogout from "../images/ULTRABANK.png";
import { Link } from "react-router-dom";

function Logout() {
  // const ctx = useContext(UserContext);
  return (
    <>
      {/* <div className="text-end">{ctx.currentUser.name}</div> */}
      <Row>
        <Col className="text-end me-5">
          <LoginLogoutButton />
        </Col>
      </Row>
      <Container className="px-md-5">
        <div className="my-3">
          <span className="">
            Thanks for choosing Ultra Bank. We look forward to serving you again
            soon.
          </span>{" "}
          <Link to="/">Go to Home</Link>
        </div>
        <div>
          {" "}
          <img className="img-fluid" src={imageLogout} />
        </div>
      </Container>

      <ToastContainer />
    </>
  );
}

export default Logout;
