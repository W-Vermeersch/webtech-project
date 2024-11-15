import { useState } from "react";
import FormTextField from "./FormTextField.tsx";
import "./login.css";
import axios from "axios";
import RouteToServer from "../../infos.ts";

function SignIn() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.password != formData.passwordConfirm) {
      e.stopPropagation();
      setError("Passwords don't match");
    } else {
      console.log(formData);
      axios.post(RouteToServer("/user/sign-in"), formData);
      setFormData({ ...formData, password: "", passwordConfirm: "" });
    }
  }

  return (
    <div id="form-container" className="container rounded shadow-sm">
      <form id="loginForm" onSubmit={handleSubmit}>
        <FormTextField
          name="firstName"
          type="text"
          placeholder="Enter your first name"
          onChange={handleChange}
          value={formData.firstName}
        />
        <FormTextField
          name="lastName"
          type="text"
          placeholder="Enter your last Name"
          onChange={handleChange}
          value={formData.lastName}
        />
        <FormTextField
          name="email"
          type="email"
          placeholder="Enter your email address"
          onChange={handleChange}
          value={formData.email}
        />
        <FormTextField
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={handleChange}
          value={formData.password}
        />
        <FormTextField
          name="passwordConfirm"
          type="password"
          placeholder="Repeat your password"
          onChange={handleChange}
          value={formData.passwordConfirm}
        />
        <button className="btn btn-success" type="submit">
          Sign in
        </button>
        <p id="error">{error}</p>
      </form>
    </div>
  );
}
export { SignIn };
