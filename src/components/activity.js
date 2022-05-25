import { useState, useEffect, useContext } from "react";
import Card, { UserContext } from "../context";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import LoginLogoutButton from "./loginlogoutbutton";
import { auth } from "../firebase-config";
import { onAuthStateChanged, getIdToken } from "firebase/auth";

function Activity() {
  const [data, setData] = useState([]);
  const ctx = useContext(UserContext);
  const [idToken, setIdToken] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) setIdToken(await getIdToken(user));
    });
  }, []);

  useEffect(() => {
    // fetch all accounts from API
    fetch(
      `http://${process.env.REACT_APP_SERVER_URL}/account/findTransactions/${ctx.currentUser.email}`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const TableBody = () => {
    const rows = data.map((row, index) => {
      const dateInfo = row.date.split("T")[0].split("-");
      const usFormatDate = `${dateInfo[1]}-${dateInfo[2]}-${dateInfo[0]}`;
      const amountField =
        row.type == "WITHDRAW" || row.type == "TRANSFER(sent)"
          ? `-${row.amount}`
          : `${row.amount}`;
      return (
        <tr key={index}>
          <td>{usFormatDate}</td>
          <td>{row.type}</td>
          <td>{amountField}</td>
          <td>{row.currentBalance}</td>
        </tr>
      );
    });

    return <tbody>{rows}</tbody>;
  };

  const TableHeader = () => {
    return (
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Type</th>
          <th scope="col">Amount</th>
          <th scope="col">Balance</th>
        </tr>
      </thead>
    );
  };
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
      <Container className="mt-5">
        <Card
          txtcolor="dark"
          header="All transactions"
          body={
            <div className="table-responsive">
              <table className="table table-striped">
                <TableHeader />
                <TableBody />
              </table>
            </div>
          }
        />
      </Container>
    </>
  );
}

export default Activity;
