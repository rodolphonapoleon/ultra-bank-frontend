import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Card from "../context";
import { auth } from "../firebase-config";
import LoginButton from "./loginbutton";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(true);

  function validate(field, label) {
    if (!field) {
      alert(`${label} is required. You can't leave it blank.`);
      return false;
    }
    if (field === email) {
      if (
        !String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      ) {
        alert("Email address invalid. Please enter a valid email");
        clearForm();
        return false;
      }
    }
    return true;
  }

  const resetPassword = () => {
    if (!validate(email, "Email")) {
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setShow(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/user-not-found") {
          alert(
            "We can’t find an account with this email address. Please try a different email."
          );
        }
        clearForm();
      });
  };

  function clearForm() {
    setEmail("");
  }

  return (
    <>
      {show ? (
        <>
          <Row>
            <Col className="text-end me-5">
              <LoginButton />
            </Col>
          </Row>
          <Card
            style={{ maxWidth: "25rem", marginTop: "4rem" }}
            bgcolor="dark"
            header="Reset Password"
            // status={status}
            body={
              <>
                {/* <h3>Balance: ${ctx.currentUser.balance}</h3> */}
                <br />
                Enter your email address
                <br />
                <input
                  type="email"
                  className="form-control"
                  id="amount"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.currentTarget.value.toLowerCase());
                    // setIsdisabled(false);
                    // if (!e.currentTarget.value) setIsdisabled(true);
                  }}
                />
                <br />
                <button
                  //   disabled={isDisabled ? true : false}
                  type="submit"
                  className="btn btn-primary"
                  onClick={resetPassword}
                >
                  Submit
                </button>
              </>
            }
          />
        </>
      ) : (
        <>
          <Row>
            <Col className="text-end me-5">
              <LoginButton />
            </Col>
          </Row>
          <Card
            style={{ maxWidth: "25rem", marginTop: "4rem" }}
            bgcolor="dark"
            header="Reset Password"
            // status={status}
            body={
              <>
                We have successfully send you a link to this address email{" "}
                <span className="text-primary">{email}</span> to reset your
                password.
                <br />
                <br />
                Thank you.
                <br />
                <br />
              </>
            }
          />
        </>
      )}
    </>
  );
}

export default ForgotPassword;
