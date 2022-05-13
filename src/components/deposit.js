import { useState, useEffect, useContext } from "react";
import Card from "../context";
import LoginButton from "./loginbutton";
import { Row, Col } from "react-bootstrap";
import { auth } from "../firebase-config";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { UserContext } from "../context";

function Deposit() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState("");
  const [isDisabled, setIsdisabled] = useState(true);
  // const [currentUser, setCurrentUser] = useState({});
  const [idToken, setIdToken] = useState("");

  const ctx = useContext(UserContext);
  // console.log(ctx.currentUser);

  // useEffect(() => {
  onAuthStateChanged(auth, async (user) => {
    setIdToken(await getIdToken(user));
    // fetch("http://localhost:3000/account/all")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const userLoginData = data.filter((item) => item.email == user.email);
    //     setCurrentUser(userLoginData[0]);
    //   });
  });
  // }, []);

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

    return true;
  }

  function handleDeposit() {
    // console.log(amount);
    if (!validate(amount, "amount")) return;
    ctx.currentUser.balance += parseInt(amount);

    // console.log("idtoken:", idToken);
    (async () => {
      await fetch(
        `http://ultra-exter-D9HORDI0JX4Q-735322731.us-east-1.elb.amazonaws.com/account/update/${ctx.currentUser.email}/${amount}`,
        {
          method: "GET",
          headers: {
            Authorization: idToken,
          },
        }
      );
    })();

    // fetch(
    //   `http://localhost:3000/account/update/${currentUser.email}/${amount}`
    // );
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
          header="Make a deposit"
          status={status}
          body={
            <>
              <h3>Balance: ${ctx.currentUser.balance}</h3>
              <br />
              Deposit Amount
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
              <button
                disabled={isDisabled ? true : false}
                type="submit"
                className="btn btn-primary"
                onClick={handleDeposit}
              >
                Deposit
              </button>
            </>
          }
        />
      ) : (
        <Card
          style={{ maxWidth: "25rem", marginTop: "4rem" }}
          bgcolor="dark"
          header="Deposit"
          status={status}
          body={
            <>
              <h5 className="fs-2 text-primary">Success</h5>
              <br />
              <h5>You have deposited ${amount} </h5>
              <div>Your balance is now ${ctx.currentUser.balance} </div>
              <br />
              <button
                type="submit"
                className="btn btn-primary"
                onClick={clearForm}
              >
                Make another deposit
              </button>
            </>
          }
        />
      )}
    </>
  );
}

export default Deposit;
