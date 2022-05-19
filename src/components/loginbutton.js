import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import { NavLink } from "react-router-dom";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginButton() {
  const [userLogin, setUserLogin] = useState(false);
  const ctx = useContext(UserContext);

  const notify = () => toast.info("You have successfully logout");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserLogin(true);
    } else {
      setUserLogin(false);
    }
  });

  const handleLogout = () => {
    auth.signOut();
    ctx.currentUser = null;
    // ctx.userLogin = false;
    window.sessionStorage.setItem("CONTEXT_APP", JSON.stringify(ctx));
  };

  return userLogin ? (
    <>
      <NavLink
        to="/logout"
        onClick={() => {
          handleLogout();
          notify();
        }}
        className="btn btn-primary rounded ms-4"
      >
        Logout
      </NavLink>
    </>
  ) : (
    <NavLink to="/login" className="btn btn-primary rounded ms-4">
      Login
    </NavLink>
  );
}

export default LoginButton;
