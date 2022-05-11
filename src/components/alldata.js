// import { useContext } from "react";
// import { UserContext } from "../context";
import { useState, useEffect } from "react";
import Card from "../context";

function AllData() {
  // const ctx = useContext(UserContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    // fetch all accounts from API
    fetch("http://localhost:3000/account/all")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);

  const TableBody = () => {
    // const userdata = data.users.filter((item) => item.name != "");
    const rows = data.map((row, index) => {
      return (
        <tr key={index}>
          <th scope="row">{index + 1}</th>
          <td>{row.name}</td>
          <td>{row.email}</td>
          {/* <td>{row.password}</td> */}
          <td>{row.balance}</td>
        </tr>
      );
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
    <Card
      txtcolor="dark"
      header="All data"
      body={
        <div className="table-responsive">
          <table className="table table-striped">
            <TableHeader />
            <TableBody />
          </table>
        </div>
      }
    />
  );
}

export default AllData;
