import "./login.css";
import axios from "axios";
import RouteToServer from "../../infos.ts";
import { useState } from "react";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";

import { Formik, Form, FormikHelpers } from "formik";
import CustomInput from "./CustomInput.tsx";
import { signUpSchema } from "./signUpSchema.ts";

export default function SignIn() {

  interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }

  async function onSubmit(
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) {
    console.log(values);
    const resp = await axios.post(RouteToServer("/user/sign-in"), values);
    console.log(resp);

    if (resp.status === 206) {
      if (resp.data.errors) {

        if (resp.data.inputs) {
          actions.setValues(resp.data.inputs);
        }
        const touchedFields = Object.keys(resp.data.errors).reduce((acc: { [key: string]: boolean }, key) => {
          acc[key] = true;
          return acc;
        }, {});
        actions.setTouched(touchedFields);
        actions.setStatus(resp.data.errors);
      }
    } else {
      if (resp.data.redirect) {
        window.location.href = resp.data.redirect; // Redirect on the frontend
        actions.resetForm();
      }
    }
  }

  return (
    <Formik
      initialValues={{
        firstName: "Ozioma",
        lastName: "Olisa",
        email: "ozioma.olisa@vub",
        password: "Bobbob147",
        passwordConfirm: "Bobbob147",
      }}
      validationSchema={signUpSchema}
      onSubmit={onSubmit}

    >
      {({ isSubmitting, status }) => (
        <Form>
          <Stack gap={4}>
            <Row xs={1} md={2}>
              <FormGroup as={Col} controlId="validationFormik01">
                <CustomInput
                  label="First Name"
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                />
              </FormGroup>
              <FormGroup as={Col} controlId="validationFormik02">
                <CustomInput
                  label="Last Name"
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                />
              </FormGroup>
            </Row>

            <FormGroup controlId="validationFormik03">
              <CustomInput
                label="E-mail"
                name="email"
                id="email"
                type="email"
                placeholder="Enter your email address"
              />
            </FormGroup>

            <Row xs={1} md={2}>
              <FormGroup as={Col} controlId="validationFormik04">
                <CustomInput
                  label="Password"
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </FormGroup>
              <FormGroup as={Col} controlId="validationFormik05">
                <CustomInput
                  label="Confirm password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  type="password"
                  placeholder="Repeat your password"
                />
              </FormGroup>
            </Row>
            <Button variant="success" type="submit" disabled={isSubmitting}>
              Sign Up
            </Button>
            {status &&
              Object.values(status).map((value, idx) => (
                value && <div key={String(idx)} className="text-danger small">{value as string}</div>
              ))
            }
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
