import { useState, useEffect, useContext } from "react";
import Card from "../context";
import LoginLogoutButton from "./loginlogoutbutton";
import { Row, Col } from "react-bootstrap";
import { auth } from "../firebase-config";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { UserContext } from "../context";
import { NavLink } from "react-router-dom";

function Transfer() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState("");
  const [isDisabled, setIsdisabled] = useState(true);
  const [idToken, setIdToken] = useState("");
  const [emailToTransfer, setEmailToTransfer] = useState("");

  const ctx = useContext(UserContext);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) setIdToken(await getIdToken(user));
    });
  }, []);

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
    if (!validate(amount, "amount")) return;
    if (emailToTransfer == ctx.currentUser.email) {
      clearForm();
      alert("Please enter the recipient email, not your email");

      return;
    }
    if (emailToTransfer == "support@ultrabank.com") {
      clearForm();
      return;
    }

    (async () => {
      // fetch one account
      await fetch(
        `http://${process.env.REACT_APP_SERVER_URL}/account/findOne/${emailToTransfer}`
      )
        .then((response) => response.json())
        .then((data) => {
          ctx.currentUser.balance -= parseInt(amount);
          window.sessionStorage.setItem(
            "CONTEXT_APP",
            JSON.stringify({ ...ctx })
          );
          const transactionS = {
            email: ctx.currentUser.email,
            date: new Date(),
            type: "TRANSFER(sent)",
            amount: Number(amount),
            currentBalance: ctx.currentUser.balance,
          };
          const transactionR = {
            email: data.email,
            date: new Date(),
            type: "TRANSFER(received)",
            amount: Number(amount),
            currentBalance: data.balance + Number(amount),
          };

          (async () => {
            await fetch(
              `http://${process.env.REACT_APP_SERVER_URL}/account/update/${ctx.currentUser.email}/-${amount}`,
              {
                method: "PUT",
                headers: {
                  Authorization: idToken,
                },
              }
            );
          })();
          (async () => {
            await fetch(
              `http://${process.env.REACT_APP_SERVER_URL}/account/update/${emailToTransfer}/${amount}`,
              {
                method: "PUT",
                headers: {
                  Authorization: idToken,
                },
              }
            );
          })();
          (async () => {
            await fetch(
              `http://${
                process.env.REACT_APP_SERVER_URL
              }/account/createtransaction/${JSON.stringify(transactionS)}`,
              {
                method: "POST",
                headers: {
                  Authorization: idToken,
                },
              }
            );
          })();
          (async () => {
            await fetch(
              `http://${
                process.env.REACT_APP_SERVER_URL
              }/account/createtransaction/${JSON.stringify(transactionR)}`,
              {
                method: "POST",
                headers: {
                  Authorization: idToken,
                },
              }
            );
          })();

          setShow(false);
        })
        .catch((error) => {
          alert("There's no account associated to this email");
          clearForm();
        });
    })();
  }

  function clearForm() {
    setAmount("");
    setEmailToTransfer("");
    setIsdisabled(true);
    setShow(true);
  }

  return (
    <>
      <div className="text-end me-5 mb-1">
        <span className="text-uppercase">{ctx.currentUser.name}</span> |{" "}
        <small className="">
          <NavLink to="/profile">Update Profile</NavLink>
        </small>
      </div>
      <Row>
        <Col className="text-end me-5">
          <LoginLogoutButton />
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
                  setEmailToTransfer(e.currentTarget.value.toLowerCase());
                  setIsdisabled(false);
                  if (!e.currentTarget.value) setIsdisabled(true);
                }}
              />
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
              <h5>You have transferred ${amount} </h5>
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
