import { useState, useContext, useEffect } from "react";
import Card from "../context";
import { UserContext } from "../context";
import { NavLink, Link } from "react-router-dom";
import { Row, Col, ToastContainer } from "react-bootstrap";
import LoginButton from "./loginbutton";
import { auth } from "../firebase-config";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "@firebase/auth";

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
  // const [userLogin, setUserLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
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

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        // console.log(res.user);
        const user = res.user;
        const userLoginData = data.filter((item) => item.email == user.email);
        // setCurrentUser(userLoginData[0]);
        ctx.currentUser = userLoginData[0];
        setShow(false);
        // ctx.log = true;
        // console.log(ctx.currentUser);
      })
      .catch((error) => {
        alert("email or password is incorrect");
        clearForm();
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
      });
    // }
  }

  function handleLoginwithgoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const userLoginData = data.filter((item) => item.email == user.email);
        // console.log(userLoginData);
        if (userLoginData.length == 0) {
          const url = `http://${process.env.REACT_APP_SERVER_URL}/account/create/${user.displayName}/${user.email}`;
          (async () => {
            var res = await fetch(url);
            var data = await res.json();
            console.log(data);
          })();

          ctx.currentUser = {
            name: user.displayName,
            email: user.email,
            balance: 0,
          };
          setShow(false);
          setGoogleUser(true);
        }
        if (userLoginData.length != 0) {
          ctx.currentUser = userLoginData[0];
          setShow(false);
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
    ctx.userLogin = true;
  }

  function clearForm() {
    setEmail("");
    setPassword("");
    setIsdisabled(true);
    setShow(true);
  }
  return (
    <>
      {show ? (
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
                      />
                      <noscript></noscript>
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
                    <i className="bi bi-google fs-lg me-1"></i>Sign in with
                    Google
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
                        setEmail(e.currentTarget.value);
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
                      <a className="fs-sm" href="/signin-light#">
                        Forgot password?
                      </a>
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
              <div className="text-end me-5">
                {ctx.currentUser.name} |{" "}
                <small className="">
                  <NavLink to="">Update Profile</NavLink>
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
              <div className="text-end me-5">
                {ctx.currentUser.name} |{" "}
                <small className="">
                  <NavLink to="">Update Profile</NavLink>
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
                status={status}
                body={
                  <>
                    <LoginUser user={ctx.currentUser} />
                    <br />
                    <Row className="text-center">
                      <Col sm={12}>
                        <NavLink to="/deposit" className="btn btn-primary w-75">
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
                      <Col sm={12}>
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
  );
}

export default Login;
