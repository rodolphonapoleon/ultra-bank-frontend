import { useState, useContext, useEffect } from "react";
import Card from "../context";
import { UserContext } from "../context";
import { NavLink, Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import LoginLogoutButton from "./loginlogoutbutton";
import googlePic from "../images/pngegg.png";
import { auth } from "../firebase-config";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
} from "@firebase/auth";
import AllData from "./alldata";
import Usertransaction from "./usertransaction";

const LoginUser = ({ user }) => {
  return (
    <>
      <h3>
        Welcome back <span className="text-primary">{user.name}</span>
      </h3>
      <br />
      <h5>
        Your balance is: <span className="fw-bold">${user.balance}</span>
      </h5>
    </>
  );
};
function Login() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsdisabled] = useState(true);
  const [googleUser, setGoogleUser] = useState(false);
  const ctx = useContext(UserContext);
  const [admin, setAdmin] = useState(false);
  const [allDataInfo, setAllDataInfo] = useState(false);
  const [emailToSupport, setEmailToSupport] = useState("");
  const [transactionInfo, setTransactionInfo] = useState(false);

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

  function handleLogin() {
    if (!validate(email, "Email")) {
      return;
    }
    if (!validate(password, "Password")) {
      return;
    }
    (async () => {
      // fetch one account
      await fetch(
        `http://${process.env.REACT_APP_SERVER_URL}/account/findOne/${email}`
      )
        .then((response) => response.json())
        .then((data) => {
          setPersistence(auth, browserSessionPersistence)
            .then(() => {
              return signInWithEmailAndPassword(auth, email, password)
                .then((res) => {
                  const user = res.user;
                  if (user.uid == `${process.env.REACT_APP_SUPPORT_UID}`) {
                    setAdmin(true);
                  } else {
                    ctx.currentUser = data;
                    setShow(false);
                    window.sessionStorage.setItem(
                      "CONTEXT_APP",
                      JSON.stringify(ctx)
                    );
                  }
                })
                .catch((error) => {
                  alert("email or password is incorrect");
                  clearForm();
                  const errorCode = error.code;
                  console.log(errorCode);
                });
            })
            .catch((error) => {
              // Handle Errors here.
              const errorCode = error.code;
            });
        })
        .catch((error) => {
          alert("User not found");
          clearForm();
        });
    })();
  }

  function handleLoginwithgoogle() {
    const provider = new GoogleAuthProvider();
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            (async () => {
              // fetch one account
              await fetch(
                `http://${process.env.REACT_APP_SERVER_URL}/account/findOne/${user.email}`
              )
                .then((response) => response.json())
                .then((data) => {
                  ctx.currentUser = data;
                  setShow(false);
                  window.sessionStorage.setItem(
                    "CONTEXT_APP",
                    JSON.stringify(ctx)
                  );
                })
                .catch((error) => {
                  const url = `http://${process.env.REACT_APP_SERVER_URL}/account/create/${user.displayName}/${user.email}`;
                  (async () => {
                    var res = await fetch(url, {
                      method: "POST",
                      headers: {
                        Authorization: user.accessToken,
                      },
                    });
                    var datass = await res.json();
                    // console.log(data);
                  })();

                  ctx.currentUser = {
                    name: user.displayName,
                    email: user.email,
                    balance: 0,
                  };
                  setShow(false);
                  setGoogleUser(true);
                  window.sessionStorage.setItem(
                    "CONTEXT_APP",
                    JSON.stringify(ctx)
                  );
                });
            })();
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
      });
  }

  function verifyAccount(email) {
    (async () => {
      // fetch one account
      await fetch(
        `http://${process.env.REACT_APP_SERVER_URL}/account/findOne/${email}`
      )
        .then((response) => response.json())
        .then((data) => {})
        .catch((error) => {
          alert("User not found");
          clearForm();
        });
    })();
  }

  function handleSubmitEmail() {
    if (emailToSupport == "") {
      alert("Enter the customer email");
      return;
    }
    verifyAccount(emailToSupport);
    setTransactionInfo(true);
    setAllDataInfo(false);
  }

  function clearForm() {
    setEmail("");
    setPassword("");
    setIsdisabled(true);
    setShow(true);
    setEmailToSupport("");
  }

  return (
    <>
      {admin ? (
        <>
          <Row>
            <Col className="text-end me-5">
              <LoginLogoutButton />
            </Col>
          </Row>
          <Container>
            <h1>Support Dashboard</h1>
            <button
              className=" btn btn-outline-primary mt-3"
              onClick={() => {
                setAllDataInfo(true);
                setTransactionInfo(false);
              }}
            >
              All Customers
            </button>
            <div className="mt-4">Transactions by User</div>
            <div className="">
              <input
                id="email"
                placeholder="Enter the customer email"
                type="email"
                className=""
                value={emailToSupport}
                onChange={(e) => {
                  setEmailToSupport(e.currentTarget.value);
                }}
              />
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  handleSubmitEmail();
                  // setTransactionInfo(true);
                  // setAllDataInfo(false);
                }}
              >
                Submit
              </button>
            </div>
            {allDataInfo ? <AllData /> : ""}
            {transactionInfo && emailToSupport != "" ? (
              <Usertransaction emailToSupport={emailToSupport} />
            ) : (
              ""
            )}
          </Container>
        </>
      ) : (
        <>
          {ctx.currentUser == null ? (
            <>
              <div className="container-fluid d-flex h-100 align-items-center justify-content-center py-4 py-sm-5">
                <div className="card card-body" style={{ maxWidth: "940px" }}>
                  <div className="row mx-0 align-items-center">
                    <div className="col-md-6 border-end-md p-2 p-sm-5">
                      <h2 className="fw-bold h3 mb-4 mb-sm-5">
                        Hey there!
                        <br />
                        Welcome back
                      </h2>
                      <div className="d-flex justify-content-center">
                        <span
                          style={{
                            boxSizing: "border-box",
                            display: "inline-block",
                            overflow: "hidden",
                            width: "initial",
                            height: "initial",
                            background: "none",
                            opacity: "1",
                            border: "0px",
                            margin: "0px",
                            padding: "0px",
                            position: "relative",
                            maxWidth: "100%",
                          }}
                        >
                          <span
                            style={{
                              boxSizing: "border-box",
                              display: "block",
                              width: "initial",
                              height: "initial",
                              background: "none",
                              opacity: "1",
                              border: "0px",
                              margin: "0px",
                              padding: "0px",
                              maxWidth: "100%",
                            }}
                          >
                            <img
                              alt=""
                              aria-hidden="true"
                              src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27344%27%20height=%27292%27/%3e"
                              style={{
                                display: "block",
                                maxWidth: "100%",
                                width: "initial",
                                height: "initial",
                                background: "none",
                                opacity: "1",
                                border: "0px",
                                margin: "0px",
                                padding: "0px",
                              }}
                            />
                          </span>
                          <img
                            alt="Illusration"
                            src="http://finder-react.createx.studio/images/signin-modal/signin.svg"
                            // decoding="async"
                            // data-nimg="intrinsic"
                            // srcset="/images/signin-modal/signin.svg 1x, /images/signin-modal/signin.svg 2x"
                            style={{
                              position: "absolute",
                              inset: "0px",
                              boxSizing: "border-box",
                              padding: "0px",
                              border: "none",
                              margin: "auto",
                              display: "block",
                              width: "0px",
                              height: "0px",
                              minWidth: "100%",
                              maxWidth: "100%",
                              minHeight: "100%",
                              maxHeight: "100%",
                            }}
                            // className="illustration-image"
                          />
                        </span>
                      </div>
                      <div className="mt-4 mt-sm-5">
                        Don't have an account?{" "}
                        <Link to="/createaccount">Sign up here</Link>
                      </div>
                    </div>
                    <div className="col-md-6 px-2 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5">
                      <button
                        type="button"
                        className="btn btn-outline-info w-100 mb-3 fw-bold"
                        onClick={handleLoginwithgoogle}
                      >
                        <img src={googlePic} style={{ height: "25px" }} /> Sign
                        in with Google
                      </button>
                      {/* <button type="button" className="btn btn-outline-info w-100 mb-3">
                <i className="bi bi-facebook fs-lg me-1"></i>Sign in with
                Facebook
              </button> */}
                      <div className="d-flex align-items-center py-3 mb-3">
                        <hr className="w-100"></hr>
                        <div className="px-3">Or</div>
                        <hr className="w-100"></hr>
                      </div>
                      <div className="mb-4">
                        <label className="form-label" htmlFor="email">
                          Email address
                        </label>
                        <input
                          placeholder="Enter your email"
                          required=""
                          type="input"
                          id="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.currentTarget.value.toLowerCase());
                            setIsdisabled(false);
                            if (!e.currentTarget.value) setIsdisabled(true);
                          }}
                        />
                      </div>
                      <div className="mb-4">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <label className="mb-0 form-label" htmlFor="password">
                            Password
                          </label>
                          <Link className="fs-sm" to="/forgotpassword">
                            Forgot password?
                          </Link>
                          {/* <a className="fs-sm" href="/signin-light#">
                        Forgot password?
                      </a> */}
                        </div>
                        <div className="">
                          <input
                            id="password"
                            placeholder="Enter password"
                            required=""
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.currentTarget.value);
                              setIsdisabled(false);
                              if (!e.currentTarget.value) setIsdisabled(true);
                            }}
                          />
                          {/* <label
                      className="password-toggle-btn"
                      aria-label="Show/hide password"
                    >
                      <input
                        type="checkbox"
                        className="password-toggle-check"
                      />
                      <span className="password-toggle-indicator"></span>
                    </label> */}
                        </div>
                      </div>
                      <button
                        // disabled={isDisabled ? true : false}
                        type="submit"
                        className="btn btn-primary w-100 btn-lg"
                        onClick={handleLogin}
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {googleUser ? (
                <>
                  <div className="text-end me-5 mb-1">
                    <span className="text-uppercase">
                      {ctx.currentUser.name}
                    </span>{" "}
                    |{" "}
                    <small className="">
                      <NavLink to="/profile">Update Profile</NavLink>
                    </small>
                  </div>
                  <Row>
                    <Col className="text-end me-5">
                      <LoginLogoutButton />
                    </Col>
                  </Row>
                  <div className="fs-1 mt-4 text-center text-primary">
                    Congratulations, {ctx.currentUser.name}
                  </div>
                  <Card
                    style={{ maxWidth: "25rem", marginTop: "3rem" }}
                    bgcolor="dark"
                    header="Create Account"
                    status={status}
                    body={
                      <>
                        <h5 className="fs-2">Success</h5>
                        <br />
                        <NavLink to="/deposit" className="btn btn-primary ms-4">
                          Make your first deposit
                        </NavLink>
                      </>
                    }
                  />
                </>
              ) : (
                <>
                  <div className="text-end me-5 mb-1">
                    <span className="text-uppercase">
                      {ctx.currentUser.name}
                    </span>{" "}
                    |{" "}
                    <small className="">
                      <NavLink to="/profile">Update Profile</NavLink>
                    </small>
                  </div>
                  <Row>
                    <Col className="text-end me-5">
                      <LoginLogoutButton />
                    </Col>
                  </Row>
                  <Card
                    style={{ maxWidth: "25rem", marginTop: "4rem" }}
                    bgcolor="dark"
                    status={status}
                    body={
                      <>
                        <LoginUser user={ctx.currentUser} />
                        <br />
                        <Row className="text-center">
                          <Col sm={12}>
                            <NavLink
                              to="/deposit"
                              className="btn btn-primary w-75"
                            >
                              DEPOSIT
                            </NavLink>
                          </Col>
                          <Col sm={12} className="my-3">
                            <NavLink
                              to="/withdraw"
                              className="btn btn-primary w-75"
                            >
                              WITHDRAW
                            </NavLink>
                          </Col>
                          <Col sm={12} className="mb-5">
                            <NavLink
                              to="/transfer"
                              className="btn btn-primary w-75"
                            >
                              TRANSFER
                            </NavLink>
                          </Col>
                        </Row>
                      </>
                    }
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default Login;
