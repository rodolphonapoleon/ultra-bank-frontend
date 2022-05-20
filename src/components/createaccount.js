import React from "react";
import { useState, useContext, useEffect } from "react";
import Card from "../context";
import { UserContext } from "../context";
import { NavLink, Link } from "react-router-dom";
import LoginButton from "./loginbutton";
import { Row, Col } from "react-bootstrap";
import googlePic from "../pngegg.png";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

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

function CreateAccount() {
  const [show, setShow] = useState(true);
  // const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsdisabled] = useState(true);
  const [googleUserExist, setGoogleUserExist] = useState(false);
  const [userLogin, setUserLogin] = useState(false);
  const [checked, setChecked] = useState(false);
  const ctx = useContext(UserContext);

  const [data, setData] = useState([]);
  useEffect(async () => {
    // fetch all accounts from API
    await fetch(`http://${process.env.REACT_APP_SERVER_URL}/account/all`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setData(data);
      });
  }, []);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserLogin(true);
    } else {
      setUserLogin(false);
    }
  });

  function validate(field, label) {
    if (!field) {
      alert(`${label} is required. You can't leave it blank.`);
      return false;
    }
    if (field === password && password.length < 8) {
      alert("Password must be at least 8 characters");
      clearForm();
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

  function handleCreate() {
    if (!validate(name, "Name")) {
      // ctx.login = false;
      return;
    }
    if (!validate(email, "Email")) {
      // ctx.login = false;
      return;
    }
    if (!validate(password, "Password")) {
      // ctx.login = false;
      return;
    }
    if (checked == false) {
      alert("You have to accept the Terms of Use and Privacy Policy ");
      return;
    }

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // console.log(user);
            // handleLogin();
            ctx.currentUser = {
              name: name,
              email: email,
              balance: 0,
            };
            window.sessionStorage.setItem("CONTEXT_APP", JSON.stringify(ctx));
            ctx.userLogin = true;
            // createAccount();
            const url = `http://${process.env.REACT_APP_SERVER_URL}/account/create/${ctx.currentUser.name}/${ctx.currentUser.email}`;
            (async () => {
              var res = await fetch(url);
              var data = await res.json();
              // console.log(data);
            })();
            setShow(false);
            // ctx.login = true;
          })
          .catch((error) => {
            console.log(error.message);
            if (error.code == "auth/email-already-in-use") {
              alert(
                "Sorry. An account is already associated to this email address"
              );
            } else {
              alert(error.message);
            }
            clearForm();
          });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
      });
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
            const userLoginData = data.filter(
              (item) => item.email == user.email
            );
            // console.log(userLoginData);
            if (userLoginData.length == 0) {
              const url = `http://${process.env.REACT_APP_SERVER_URL}/account/create/${user.displayName}/${user.email}`;
              (async () => {
                var res = await fetch(url);
                var data = await res.json();
                // console.log(data);
              })();

              ctx.currentUser = {
                name: user.displayName,
                email: user.email,
                balance: 0,
              };
              window.sessionStorage.setItem("CONTEXT_APP", JSON.stringify(ctx));
              setShow(false);
            }
            if (userLoginData.length != 0) {
              ctx.currentUser = userLoginData[0];
              window.sessionStorage.setItem("CONTEXT_APP", JSON.stringify(ctx));
              setShow(false);
              setGoogleUserExist(true);
            }
            // ...
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
        // ctx.userLogin = true;
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
      });
  }

  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
    setChecked(false);
  }

  return (
    <>
      {ctx.currentUser == null ? (
        <>
          <div className="container-fluid d-flex h-100 align-items-center justify-content-center py-4 py-sm-5">
            <div className="card card-body" style={{ maxWidth: "940px" }}>
              <div className="row mx-0 align-items-center">
                <div className="col-md-6 border-end-md p-2 p-sm-5">
                  <h2 className="h3 mb-4 mb-sm-5 fw-bold">
                    Join
                    <span className="text-primary"> UltraBank</span> today
                    <br />
                    Get premium services:
                  </h2>
                  <ul className="list-unstyled mb-4 mb-sm-5">
                    <li className="d-flex mb-2">
                      <i className="bi-check-circle text-primary me-2"></i>
                      <span>Bank anytime, anywhere</span>
                    </li>
                    <li className="d-flex mb-2">
                      <i className="bi-check-circle text-primary me-2"></i>
                      <span>Transfer and send money</span>
                    </li>
                    <li className="d-flex mb-0">
                      <i className="bi-check-circle text-primary me-2"></i>
                      <span>Deposit checks from your mobile device</span>
                    </li>
                  </ul>
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
                        src="http://finder-react.createx.studio/images/signin-modal/signup.svg"
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
                      />
                    </span>
                  </div>
                  <div className="mt-4 mt-sm-5">
                    Already have an account? <Link to="/login">Sign in</Link>
                    {/* <a href="/signup-light">Sign up here</a> */}
                  </div>
                </div>
                <div className="col-md-6 px-2 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5">
                  <button
                    type="button"
                    className="btn btn-outline-info w-100 mb-3 fw-bold"
                    onClick={handleLoginwithgoogle}
                  >
                    <img src={googlePic} style={{ height: "25px" }} /> Sign in
                    with Google
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
                  {/* <form className=""> */}
                  <div className="mb-4">
                    <label className="form-label" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      placeholder="Enter your full name"
                      required=""
                      type="input"
                      id="name"
                      className="form-control"
                      value={name}
                      onChange={(e) => {
                        setName(e.currentTarget.value);
                        setIsdisabled(false);
                        if (!e.currentTarget.value) setIsdisabled(true);
                      }}
                    />
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
                        Password{" "}
                        <small className="fs-sm text-muted">min. 8 char</small>
                      </label>
                    </div>
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
                  </div>
                  <div className="mb-4 form-check">
                    <input
                      required=""
                      type="checkbox"
                      id="terms-agree"
                      className="form-check-input"
                      onChange={(e) => {
                        setChecked(e.target.checked);
                      }}
                    />
                    <label
                      title=""
                      htmlFor="terms-agree"
                      className="form-check-label"
                    >
                      <span>By joining, I agree to the </span>
                      <a href="/signup-light#">Terms of use</a>
                      <span> and </span>
                      <a href="/signup-light#">Privacy policy</a>
                    </label>
                  </div>
                  <button
                    // disabled={isDisabled ? true : false}
                    type="submit"
                    className="btn btn-primary w-100 btn-lg"
                    onClick={() => {
                      handleCreate();
                      // handleLogin();
                    }}
                  >
                    Sign Up
                  </button>
                  {/* </form> */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {googleUserExist ? (
            <>
              <div className="text-end me-5 mb-1">
                <span className="text-uppercase">{ctx.currentUser.name}</span> |{" "}
                <small className="">
                  <NavLink to="/profile">Update Profile</NavLink>
                </small>
              </div>
              <Row>
                <Col className="text-end me-5">
                  <LoginButton />
                </Col>
              </Row>
              <Card
                style={{ maxWidth: "25rem", marginTop: "4rem" }}
                bgcolor="dark"
                // status={status}
                body={
                  <>
                    <LoginUser user={ctx.currentUser} />
                    <br />
                    <Row className="text-center">
                      <Col>
                        <NavLink to="/deposit" className="btn btn-primary">
                          Make a deposit
                        </NavLink>
                      </Col>
                      <Col>
                        <NavLink to="/withdraw" className="btn btn-primary">
                          Make a withdraw
                        </NavLink>
                      </Col>
                    </Row>
                  </>
                }
              />
            </>
          ) : (
            <>
              <div className="text-end me-5 mb-1">
                <span className="text-uppercase">{ctx.currentUser.name}</span> |{" "}
                <small className="">
                  <NavLink to="/profile">Update Profile</NavLink>
                </small>
              </div>
              <Row>
                <Col className="text-end me-5">
                  <LoginButton />
                </Col>
              </Row>
              <div className="fs-1 mt-4 text-center text-primary">
                Congratulations, {ctx.currentUser.name}
              </div>
              <Card
                style={{ maxWidth: "25rem", marginTop: "3rem" }}
                bgcolor="dark"
                header="Create Account"
                // status={status}
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
          )}
        </>
      )}
    </>
  );
}

export default CreateAccount;
