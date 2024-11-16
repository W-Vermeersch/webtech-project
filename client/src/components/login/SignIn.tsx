import { useState } from "react";
import FormTextField from "./FormTextField.tsx";
import "./login.css";
import axios from "axios";
import RouteToServer from "../../infos.ts";
import {SignInForm, ErrorInForm} from "../../../../Global/sign-in-form.ts";

export default function SignIn() {
    const [formData, setFormData] = useState<SignInForm>(new SignInForm());
  const [error, setError] = useState<ErrorInForm>(new ErrorInForm());

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (false){//(formData.password != formData.passwordConfirm) {
          e.stopPropagation();
          setError("Passwords don't match");
      } else {
          console.log(formData);
          const resp = await axios.post(RouteToServer("/user/sign-in"), formData);
          console.log(resp);
            if (resp.status === 206) {
                if (resp.data.inputs){
                    const inputs = new SignInForm();
                    inputs.fill(resp.data.inputs)
                    setFormData(inputs);
                }
                if (resp.data.errors){
                    setError(error.fill(resp.data.errors));
                }
            }
          if (resp.data.redirect) {
              window.location.href = resp.data.redirect; // Redirect on the frontend
              }
          // setFormData({...formData, password: "", passwordConfirm: ""});
      }
  }

  return (
    <form id="loginForm" onSubmit={handleSubmit}>
      <FormTextField
          name="Name :"
        id="firstName"
        type="text"
        placeholder="Enter your first name"
        onChange={handleChange}
        value={formData.firstName}
          error={error.firstName}
      />
      <FormTextField
          name="Last Name :"
        id="lastName"
        type="text"
        placeholder="Enter your last Name"
        onChange={handleChange}
        value={formData.lastName}
          error={error.lastName}
      />
      <FormTextField
          name="E-mail :"
        id="email"
        type="email"
        placeholder="Enter your email address"
        onChange={handleChange}
        value={formData.email}
          error={error.email}
      />
      <FormTextField
          name="Password :"
        id="password"
        type="password"
        placeholder="Enter your password"
        onChange={handleChange}
        value={formData.password}
          error={error.password}
      />
      <FormTextField
          name="Confirm password :"
        id="passwordConfirm"
        type="password"
        placeholder="Repeat your password"
        onChange={handleChange}
        value={formData.passwordConfirm}
          error={error.passwordConfirm}
      />
      <button className="btn btn-success" type="submit">
        Sign in
      </button>
      <p id="error">{error.total}</p>
    </form>
  );
}
