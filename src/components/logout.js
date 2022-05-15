import { UserContext } from "../context";
import LoginButton from "./loginbutton";
import { useContext } from "react";
import { Row, Col } from "react-bootstrap";

function Logout() {
  // const ctx = useContext(UserContext);
  return (
    <>
      {/* <div className="text-end">{ctx.currentUser.name}</div> */}
      <Row>
        <Col className="text-end me-5">
          <LoginButton />
        </Col>
      </Row>
      <h1>You have succesfully logout</h1>
      {/* {setTimeout(() => {
        console.log("hola");
      }, "5000")} */}
    </>
  );
}

export default Logout;
