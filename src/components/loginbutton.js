import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import { NavLink } from "react-router-dom";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

function LoginButton() {
  const [userLogin, setUserLogin] = useState(false);
  const ctx = useContext(UserContext);

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
    ctx.userLogin = false;
  };

  return userLogin ? (
    <NavLink
      to="/logout"
      onClick={() => handleLogout()}
      className="btn btn-primary rounded-pill ms-4"
    >
      Logout
    </NavLink>
  ) : (
    <NavLink to="/login" className="btn btn-primary rounded-pill ms-4">
      Login
    </NavLink>
  );
}

export default LoginButton;
