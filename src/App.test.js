import React from "react";
import { useContext } from "react";
import App from "./App";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateAccount from "./components/createaccount";
import Card from "./context";
import { UserContext } from "./context";

// test("Todo", () => {
//   const { getByText, getByLabelText } = render(<App />);
//   getByText("TODO");
//   getByLabelText("Add Todo:");
//   getByText("Add #1");
// });
const ctx = useContext(UserContext);

test("create account", () => {
  const { getByText, getByLabelText } = render(<CreateAccount />);

  //  after rendering the component
  const input1 = getByLabelText("Name");
  fireEvent.change(input1, { target: { value: "Rodolpho" } });

  const input2 = getByLabelText("Email address");
  fireEvent.change(input2, { target: { value: "napo@mit.edu" } });

  const input3 = getByLabelText("Password");
  fireEvent.change(input3, { target: { value: "secret678" } });

  fireEvent.click(getByText("Submit Info"));

  //  confirm data
  // getByText("Add another account");
  // getByText("wash car");
});
