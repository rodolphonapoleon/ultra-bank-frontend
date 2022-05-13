import { useState, useEffect, useContext } from "react";
import Card from "../context";
import LoginButton from "./loginbutton";
import { Row, Col } from "react-bootstrap";
import { auth } from "../firebase-config";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { UserContext } from "../context";
import { Link } from "react-router-dom";

function Transfer() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState("");
  const [isDisabled, setIsdisabled] = useState(true);
  // const [currentUser, setCurrentUser] = useState({});
  const [idToken, setIdToken] = useState("");
  const [emailToTransfer, setEmailToTransfer] = useState("");

  const ctx = useContext(UserContext);

  onAuthStateChanged(auth, async (user) => {
    setIdToken(await getIdToken(user));
  });

  function validate(field) {
    if (Number(field) != field) {
      alert("Input not valid. You have to enter a number");
      clearForm();
      return false;
    }
    if (Number(field) <= 0) {
      alert("Input not valid. You have to enter a positive number more than 0");
      clearForm();
      return false;
    }
    if (Number(field) > ctx.currentUser.balance) {
      alert(
        "Transaction not possible. Your Transfer amount is more than your balance"
      );
      clearForm();
      return false;
    }

    return true;
  }

  function handleTransfer() {
    // console.log(amount);
    if (!validate(amount, "amount")) return;

    // check if user exists in the DB
    (async () => {
      await fetch(
        `http://ultra-bank-frontend.s3-website-us-east-1.amazonaws.com/account/findOne/${emailToTransfer}`
      )
        .then((response) => response.json())
        .then((data) => console.log(data));
    })();

    ctx.currentUser.balance -= parseInt(amount);

    // console.log("idtoken:", idToken);
    (async () => {
      await fetch(
        `http://ultra-bank-frontend.s3-website-us-east-1.amazonaws.com/account/update/${ctx.currentUser.email}/-${amount}`,
        {
          method: "GET",
          headers: {
            Authorization: idToken,
          },
        }
      );
    })();
    (async () => {
      await fetch(
        `http://ultra-bank-frontend.s3-website-us-east-1.amazonaws.com/account/update/${emailToTransfer}/${amount}`,
        {
          method: "GET",
          headers: {
            Authorization: idToken,
          },
        }
      );
    })();

    setShow(false);
  }

  function clearForm() {
    setAmount("");
    setIsdisabled(true);
    setShow(true);
  }

  return (
    <>
      <div className="text-end text-uppercase me-5">{ctx.currentUser.name}</div>
      <Row>
        <Col className="text-end me-5">
          <LoginButton />
        </Col>
      </Row>
      {show ? (
        <Card
          style={{ maxWidth: "25rem", marginTop: "4rem" }}
          bgcolor="dark"
          header="Make a transfer"
          status={status}
          body={
            <>
              <h3>Balance: ${ctx.currentUser.balance}</h3>
              <br />
              Transfer
              <br />
              <input
                type="input"
                className="form-control"
                id="amount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.currentTarget.value);
                  setIsdisabled(false);
                  if (!e.currentTarget.value) setIsdisabled(true);
                }}
              />
              <br />
              To
              <br />
              <input
                type="input"
                className="form-control"
                id="email"
                placeholder="Enter recipient email"
                value={emailToTransfer}
                onChange={(e) => {
                  setEmailToTransfer(e.currentTarget.value);
                  setIsdisabled(false);
                  if (!e.currentTarget.value) setIsdisabled(true);
                }}
              />
              {/* <select
                className="form-select"
                onChange={(e) => {
                  setEmailToTransfer(e.target.value);
                }}
              >
                <option selected>Choose a recipient</option>
                <option value="marco@gmail.com">MARCO - 4563</option>
                <option value="">Add a recipient</option>
              </select> */}
              <br />
              <br />
              <button
                disabled={isDisabled ? true : false}
                type="submit"
                className="btn btn-primary"
                onClick={handleTransfer}
              >
                Transfer
              </button>
            </>
          }
        />
      ) : (
        <Card
          style={{ maxWidth: "25rem", marginTop: "4rem" }}
          bgcolor="dark"
          header="Transfer"
          status={status}
          body={
            <>
              <h5 className="fs-2 text-primary">Success</h5>
              <br />
              <h5>You have transfered ${amount} </h5>
              <div>Your balance is now ${ctx.currentUser.balance} </div>
              <br />
              <button
                type="submit"
                className="btn btn-primary"
                onClick={clearForm}
              >
                Make another transfer
              </button>
            </>
          }
        />
      )}
    </>
  );
}

export default Transfer;
