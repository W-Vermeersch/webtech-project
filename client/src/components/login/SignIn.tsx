import { useState } from "react";
import "./login.css";
import axios from "axios";
import RouteToServer from "../../infos.ts";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
//import Form from "react-bootstrap/Form";
import { SignInForm, ErrorInForm } from "../../../../Global/sign-in-form.ts";
import { Formik, Form } from "formik";
import CustomInput from "./CustomInput.tsx";
import { signUpSchema } from "./signUpSchema.ts";

export default function SignIn() {
  //const [formData, setFormData] = useState<SignInForm>(new SignInForm());
  //const [error, setError] = useState<ErrorInForm>(new ErrorInForm());

  interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }

  interface FormActions {
    setSubmitting: (isSubmitting: boolean) => void;
    resetForm: () => void;
  }

  async function onSubmit(values: FormValues, actions: FormActions) {
    console.log(values);
    console.log(actions);
    // const resp = await axios.post(RouteToServer("/user/sign-in"), formData);
    // console.log(resp);
    // if (resp.status === 206) {
    //   if (resp.data.inputs) {
    //     const inputs = new SignInForm();
    //     inputs.fill(resp.data.inputs);
    //     setFormData(inputs);
    //   }
    //   if (resp.data.errors) {
    //     setError(error.fill(resp.data.errors));
    //   }
    // }
    // if (resp.data.redirect) {
    //   window.location.href = resp.data.redirect; // Redirect on the frontend
    //   //setFormData({...formData, password: "", passwordConfirm: ""});
    // }
  }
  //  }

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
      }}
      validationSchema={signUpSchema}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form>
          <Stack gap={2}>
            <CustomInput
              label="First Name"
              name="firstName"
              id="firstName"
              type="text"
              placeholder="Enter your first name"
            />
            <CustomInput
              label="Last Name"
              name="lastName"
              id="lastName"
              type="text"
              placeholder="Enter your last Name"
            />
            <CustomInput
              label="E-mail"
              name="email"
              id="email"
              type="email"
              placeholder="Enter your email address"
            />
            <CustomInput
              label="Password"
              name="password"
              id="password"
              type="password"
              placeholder="Enter your password"
            />
            <CustomInput
              label="Confirm password"
              name="passwordConfirm"
              id="passwordConfirm"
              type="password"
              placeholder="Repeat your password"
            />
            <Button variant="success" type="submit">
              Sign in
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
