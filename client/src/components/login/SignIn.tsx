import { useState } from "react";
import FormTextField from "./FormTextField.tsx";
import "./login.css";
import axios from "axios";
import RouteToServer from "../../infos.ts";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function SignIn() {
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
    <Form id="loginForm" onSubmit={handleSubmit}>
      <Stack gap={3}>
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
        <Button variant="success" type="submit">
          Sign in
        </Button>
        <p id="error">{error}</p>
      </Stack>
    </Form>
  );
}
