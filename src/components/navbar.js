import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

function NavBar() {
  const [userLogin, setUserLogin] = useState(false);
  const [admin, setAdmin] = useState(false);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.uid == `${process.env.REACT_APP_SUPPORT_UID}`) {
        setAdmin(true);
      }
      setUserLogin(true);
    } else {
      setUserLogin(false);
      setAdmin(false);
    }
  });
  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "black" }}
      >
        <div className="container-fluid ms-5">
          {(userLogin && !admin) || !userLogin ? (
            <NavLink to="/" className="navbar-brand fs-2 fw-bold">
              ULTRA<span className="text-primary">BANK</span>
            </NavLink>
          ) : (
            <div className="navbar-brand fs-2 fw-bold">
              ULTRA<span className="text-primary">BANK</span>
            </div>
          )}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end me-5"
            id="navbarNav"
          >
            <div className="navbar-nav nav-pills">
              {!userLogin ? (
                <NavLink
                  to="createaccount"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link fs-4 ms-3 active"
                      : "nav-link fs-4 ms-3"
                  }
                  className="btn btn-outline-primary rounded ms-4"
                >
                  Create Account
                </NavLink>
              ) : (
                ""
              )}
              {userLogin && !admin ? (
                <NavLink
                  to="deposit"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link fs-4 ms-3 active"
                      : "nav-link fs-4 ms-3"
                  }
                >
                  Deposit
                </NavLink>
              ) : (
                ""
              )}
              {userLogin && !admin ? (
                <NavLink
                  to="withdraw"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link fs-4 ms-3 active"
                      : "nav-link fs-4 ms-3"
                  }
                >
                  Withdraw
                </NavLink>
              ) : (
                ""
              )}
              {userLogin && !admin ? (
                <NavLink
                  to="transfer"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link fs-4 ms-3 active"
                      : "nav-link fs-4 ms-3"
                  }
                >
                  Transfer
                </NavLink>
              ) : (
                ""
              )}
              {userLogin && !admin ? (
                <NavLink
                  to="activity"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link fs-4 ms-3 active"
                      : "nav-link fs-4 ms-3"
                  }
                >
                  Activity
                </NavLink>
              ) : (
                ""
              )}
              {userLogin && admin ? (
                <button className="btn btn-primary fs-4 ms-3">
                  Support Dashboard
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
