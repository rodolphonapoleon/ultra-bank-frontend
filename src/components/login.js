import { useState, useContext, useEffect } from "react";
import Card from "../context";
import { UserContext } from "../context";
import { NavLink } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import LoginButton from "./loginbutton";
import { auth } from "../firebase-config";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  // onAuthStateChanged,
} from "@firebase/auth";

export const LoginUser = ({ user }) => {
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
  // const [userLogin, setUserLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const ctx = useContext(UserContext);

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     setUserLogin(true);
  //   } else {
  //     setUserLogin(false);
  //   }
  // });

  const [data, setData] = useState([]);
  useEffect(async () => {
    // fetch all accounts from API
    await fetch("http://localhost:3000/account/all")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const user = res.user;
        const userLoginData = data.filter((item) => item.email == user.email);
        // setCurrentUser(userLoginData[0]);
        ctx.currentUser = userLoginData[0];
        setShow(false);
        // ctx.log = true;
        console.log(ctx.currentUser);
      })
      .catch((error) => {
        alert("email or password is incorrect");
        clearForm();
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
      });
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
        console.log(userLoginData);
        if (userLoginData.length == 0) {
          const url = `http://localhost:3000/account/create/${user.displayName}/${user.email}`;
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
        <Card
          style={{ maxWidth: "25rem", marginTop: "8rem" }}
          bgcolor="dark"
          status={status}
          body={
            <>
              <br />
              <label htmlFor="email">Email address</label>
              <input
                type="input"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                  setIsdisabled(false);
                  if (!e.currentTarget.value) setIsdisabled(true);
                }}
              />
              <br />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.currentTarget.value);
                  setIsdisabled(false);
                  if (!e.currentTarget.value) setIsdisabled(true);
                }}
              />
              <br />
              <button
                disabled={isDisabled ? true : false}
                type="submit"
                className="btn btn-primary"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                // disabled={isDisabled ? true : false}
                type="submit"
                className="btn btn-primary ms-5"
                onClick={handleLoginwithgoogle}
              >
                Login with Google
              </button>
            </>
          }
        />
      ) : (
        <>
          <div className="text-end text-uppercase me-5">
            {ctx.currentUser.name}
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
      )}
    </>
  );
}

export default Login;
