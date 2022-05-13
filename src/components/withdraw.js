import { useState, useContext, useEffect } from "react";
import Card from "../context";
import { UserContext } from "../context";
import LoginButton from "./loginbutton";
import { Row, Col } from "react-bootstrap";
import { auth } from "../firebase-config";
import { onAuthStateChanged, getIdToken } from "firebase/auth";

function Withdraw() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState("");
  const [isDisabled, setIsdisabled] = useState(true);
  const ctx = useContext(UserContext);
  // const [currentUser, setCurrentUser] = useState({});
  const [idToken, setIdToken] = useState("");

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
    if (Number(field) > ctx.currentUser.balance) {
      alert(
        "Transaction not possible. Your Withdraw amount is more than your balance"
      );
      clearForm();
      return false;
    }

    return true;
  }

  function handleWithdraw() {
    console.log(amount);
    if (!validate(amount, "amount")) return;
    // ctx.users[0].balance -= parseInt(amount);
    ctx.currentUser.balance -= parseInt(amount);

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
    // fetch(
    //   `http://localhost:3000/account/update/${ctx.currentUser.email}/-${amount}`
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
          header="Make a Withdrawal"
          status={status}
          body={
            <>
              <h3>Balance: ${ctx.currentUser.balance}</h3>
              <br />
              Withdrawal Amount
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
                onClick={handleWithdraw}
              >
                Withdraw
              </button>
            </>
          }
        />
      ) : (
        <Card
          style={{ maxWidth: "25rem", marginTop: "4rem" }}
          bgcolor="dark"
          header="Withdraw"
          status={status}
          body={
            <>
              <h5 className="fs-2 text-primary">Success</h5>
              <br />
              <h5>You have withdrawn ${amount} </h5>
              <div>Your balance is now ${ctx.currentUser.balance} </div>
              <br />
              <button
                type="submit"
                className="btn btn-primary"
                onClick={clearForm}
              >
                Make another withdrawal
              </button>
            </>
          }
        />
      )}
    </>
  );
}

export default Withdraw;
