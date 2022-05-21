import NavBar from "./navbar.js";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AllData from "./components/alldata.js";
import CreateAccount from "./components/createaccount.js";
import Deposit from "./components/deposit.js";
import Home from "./components/home.js";
import Withdraw from "./components/withdraw.js";
import Login from "./components/login.js";
import Logout from "./components/logout";
import { UserContext } from "./context.js";
import Footer from "./components/footer";
import Transfer from "./components/transfer.js";
import { useState, useEffect } from "react";
import Profile from "./components/profile.js";
import Activity from "./components/activity.js";

function App() {
  // const [context, setContext] = useState({
  //   currentUser: null,
  // });
  const [context, setContext] = useState(() => {
    const localData = window.sessionStorage.getItem("CONTEXT_APP");
    return localData ? JSON.parse(localData) : { currentUser: null };
  });

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={context}>
          <div
            style={{
              backgroundColor: "#F0F8FF",
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <NavBar />
            <div
              className="container-fluid pt-2 pb-5"
              style={{ padding: "0px", flex: 1 }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/CreateAccount/" element={<CreateAccount />} />
                <Route path="/deposit/" element={<Deposit />} />
                <Route path="/withdraw/" element={<Withdraw />} />
                <Route path="/alldata/" element={<AllData />} />
                <Route path="/login/" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/transfer/" element={<Transfer />} />
                <Route path="/profile/" element={<Profile />} />
                <Route path="/activity/" element={<Activity />} />
              </Routes>
            </div>
            {/* <div className="row bg-primary">
              <div
                className="col"
                style={{
                  width: "100%",
                  height: "6px",
                }}
              ></div>
            </div> */}
            <Footer />
          </div>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
