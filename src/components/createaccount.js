import React from "react";
import { useState, useContext } from "react";
import Card from "../context";
import { UserContext } from "../context";
import { NavLink } from "react-router-dom";
import LoginButton from "./loginbutton";
import { Row, Col } from "react-bootstrap";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

function CreateAccount() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsdisabled] = useState(true);
  const [userLogin, setUserLogin] = useState(false);
  const ctx = useContext(UserContext);

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
      // let checkEmail = ctx.users.filter((item) => email == item.email);
      // if (checkEmail.length == 1) {
      //   alert("The email you entered is associated to an existing account");
      //   clearForm();
      //   return false;
      // }
    }
    return true;
  }

  function handleCreate() {
    if (!validate(name, "Name")) {
      ctx.login = false;
      return;
    }
    if (!validate(email, "Email")) {
      ctx.login = false;
      return;
    }
    if (!validate(password, "Password")) {
      ctx.login = false;
      return;
    }
    console.log(name, email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        console.log(error.message);
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // ..
      });
    const url = `http://localhost:3000/account/create/${name}/${email}`;
    (async () => {
      var res = await fetch(url);
      var data = await res.json();
      console.log(data);
    })();
    setShow(false);
    ctx.login = true;
  }

  function handleLogin() {
    if (ctx.login) {
      signInWithEmailAndPassword(auth, email, password);
      ctx.currentUser = {
        name: name,
        email: email,
        balance: 0,
      };
      ctx.userLogin = true;
    } else return;
  }

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     setUserlog(user);
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/firebase.User
  // const uid = user.uid;
  // ...
  //   } else {
  //     setUserlog({});
  //     // User is signed out
  //     // ...
  //   }
  // });

  function clearForm() {
    setEmail("");
    setPassword("");
  }

  return (
    <>
      {ctx.currentUser && show ? (
        <>
          <div className="text-end text-uppercase me-5">
            {ctx.currentUser.name}
          </div>
          <Row>
            <Col className="text-end me-5">
              <LoginButton />
            </Col>
          </Row>
          <div className="text-center fs-4 mt-5">
            Please <span className="fw-bold">log out</span> to be able to create
            another account.
          </div>
        </>
      ) : (
        <>
          <Row>
            <Col className="text-end me-5">
              <LoginButton />
            </Col>
          </Row>

          {show ? (
            <>
              <div className="fs-1 mt-4 text-center text-primary">
                Let's create your account
              </div>

              <Card
                style={{ maxWidth: "25rem", marginTop: "3rem" }}
                bgcolor="dark"
                header="Create Account"
                status={status}
                body={
                  <>
                    <label htmlFor="name">Name</label>
                    <input
                      type="input"
                      className="form-control"
                      id="name"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => {
                        setName(e.currentTarget.value);
                        setIsdisabled(false);
                        if (!e.currentTarget.value) setIsdisabled(true);
                      }}
                    />
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
                    <div className="form-text">
                      Password must be at least 8 characters long.
                    </div>
                    <br />
                    <button
                      disabled={isDisabled ? true : false}
                      type="submit"
                      className="btn btn-primary"
                      onClick={() => {
                        handleCreate();
                        handleLogin();
                      }}
                    >
                      Create Account
                    </button>
                  </>
                }
              />
            </>
          ) : (
            <>
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
          )}
        </>
      )}
    </>
  );
}

export default CreateAccount;
