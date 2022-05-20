import { useContext, useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { UserContext } from "../context";
import LoginButton from "./loginbutton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "../firebase-config";
import { toast, ToastContainer } from "react-toastify";

function Profile() {
  let ctx = useContext(UserContext);
  const [state, setState] = useState(true);
  const [user, setUser] = useState({
    name: ctx.currentUser.name,
    gender: ctx.currentUser.gender,
    dob: ctx.currentUser.dob,
    phoneNumber: ctx.currentUser.phoneNumber,
    address: ctx.currentUser.address,
  });
  const [idToken, setIdToken] = useState("");

  const notifyUser = () =>
    toast.success("You have successfully updated your profile");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) setIdToken(await getIdToken(user));
    });
  }, []);

  return (
    <>
      <div className="text-end me-5 mb-1">
        <span className="text-uppercase">{ctx.currentUser.name}</span>
      </div>

      <Row>
        <Col className="text-end me-5">
          <LoginButton />
        </Col>
      </Row>
      <ToastContainer />
      <div className="mx-md-5 mb-md-5 px-md-5 mx-3 mb-2 px-0">
        <h2 className="h2">Edit Profile</h2>
      </div>
      <div className="bg-light shadow-sm rounded-3 p-4 p-md-5 mx-md-5 mb-2 mt-3">
        {/* <!-- Personal details--> */}
        <div className="row pt-4 mt-2">
          <div className="col-lg-3 mb-4">
            <h2 className="h4">Personal Info</h2>
            {/* <br /> */}
            Email Account:{" "}
            <span className="text-primary">{ctx.currentUser.email}</span>
          </div>
          <div className="col-lg-9">
            <div className="border rounded-3 p-3" id="personal-details">
              {/* <!-- Full name--> */}
              <div className="border-bottom pb-3 mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="pe-2">
                    <label className="form-label fw-bold">Full name</label>
                    <div id="fn-value">{user.name}</div>
                  </div>
                  <a
                    className="nav-link py-0 collapsed"
                    href="#fn-collapse"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                  >
                    <i className="bi-pencil-square"></i>
                  </a>
                </div>{" "}
                <div className="collapse" id="fn-collapse">
                  <input
                    className="form-control mt-3"
                    type="name"
                    placeholder={`${user.name}`}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        name: e.target.value
                          ? e.target.value
                          : `${ctx.currentUser.name}`,
                      });
                    }}
                  />
                </div>
              </div>
              {/* <!-- Gender--> */}
              <div className="border-bottom pb-3 mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="pe-2">
                    <label className="form-label fw-bold">Gender</label>
                    <div id="gender-value">
                      {user.gender == null ? "Not Specified" : user.gender}
                    </div>
                  </div>

                  <a
                    className="nav-link py-0 collapsed"
                    href="#gender-collapse"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                  >
                    <i className="bi-pencil-square"></i>
                  </a>
                </div>
                <div className="collapse" id="gender-collapse">
                  <select
                    className="form-select mt-3"
                    onChange={(e) => {
                      setUser({ ...user, gender: e.target.value });
                    }}
                  >
                    <option value="" disabled="">
                      Select your gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              {/* <!-- Date of birth--> */}
              <div className="border-bottom pb-3 mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="pe-2">
                    <label className="form-label fw-bold">Date of birth</label>
                    <div id="birth-value">
                      {" "}
                      {user.dob == null ? "Not Specified" : user.dob}
                    </div>
                  </div>
                  <a
                    className="nav-link py-0 collapsed"
                    href="#birth-collapse"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                  >
                    <i className="bi-pencil-square"></i>
                  </a>
                </div>
                <div className="collapse" id="birth-collapse">
                  <DatePicker
                    dateFormat="yyyy/MM/dd"
                    className="form-control mt-3"
                    onChange={(date) => setUser({ ...user, dob: `${date}` })}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>
              {/* <!-- Phone number--> */}
              <div className="border-bottom pb-3 mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="pe-2">
                    <label className="form-label fw-bold">Phone number</label>
                    <div id="phone-value">
                      {user.phoneNumber == null
                        ? "xxx-xxx-xxxx"
                        : user.phoneNumber}
                    </div>
                  </div>
                  <a
                    className="nav-link py-0 collapsed"
                    href="#phone-collapse"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                  >
                    <i className="bi-pencil-square"></i>
                  </a>
                </div>
                <div className="collapse" id="phone-collapse">
                  <input
                    className="form-control mt-3"
                    type="text"
                    placeholder={
                      user.phoneNumber == null
                        ? "xxx-xxx-xxxx"
                        : `${user.phoneNumber}`
                    }
                    onChange={(e) => {
                      setUser({
                        ...user,
                        phoneNumber: e.target.value
                          ? e.target.value
                          : `xxx-xxx-xxxx`,
                      });
                    }}
                  />
                </div>
              </div>
              {/* <!-- Address--> */}
              <div className="pb-3 mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="pe-2">
                    <label className="form-label fw-bold">Address</label>
                    <div id="address-value">
                      {user.address == null ? "Not Specified" : user.address}
                    </div>
                  </div>
                  <a
                    className="nav-link py-0 collapsed"
                    href="#address-collapse"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                  >
                    <i className="bi-pencil-square"></i>
                  </a>
                </div>
                <div className="collapse" id="address-collapse">
                  <input
                    className="form-control mt-3"
                    type="text"
                    placeholder="Enter address here"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        address: e.target.value ? e.target.value : null,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="row pt-4 mt-2">
          <div className="col-lg-9 offset-lg-3">
            <div className="d-flex align-items-center justify-content-end">
              <button
                className="btn btn-primary rounded-pill px-3 px-sm-4 "
                type="button"
                onClick={async () => {
                  await fetch(
                    `http://${process.env.REACT_APP_SERVER_URL}/account/edit/${
                      ctx.currentUser.email
                    }/${JSON.stringify(user)}`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: idToken,
                      },
                    }
                  );
                  ctx.currentUser = { ...ctx.currentUser, ...user };
                  window.sessionStorage.setItem(
                    "CONTEXT_APP",
                    JSON.stringify(ctx)
                  );
                  // window.location.reload(false);
                  setState(false);
                  notifyUser();
                }}
                // onClick={() => console.log(user)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
