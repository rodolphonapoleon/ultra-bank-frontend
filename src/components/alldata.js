// import { useContext } from "react";
// import { UserContext } from "../context";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Card from "../context";

function AllData() {
  // const ctx = useContext(UserContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    // fetch all accounts from API
    fetch(`http://${process.env.REACT_APP_SERVER_URL}/account/all`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const TableBody = () => {
    // const userdata = data.users.filter((item) => item.name != "");
    const rows = data.map((row, index) => {
      if (row.email != "support@ultrabank.com") {
        return (
          <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>{row.name}</td>
            <td>{row.email}</td>
            <td>{row.balance}</td>
          </tr>
        );
      }
    });

    return <tbody>{rows}</tbody>;
  };

  const TableHeader = () => {
    return (
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          {/* <th scope="col">Password</th> */}
          <th scope="col">Balance</th>
        </tr>
      </thead>
    );
  };

  return (
    <Container className="mt-5">
      <Card
        txtcolor="dark"
        header="All Customers Data"
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
  );
}

export default AllData;
