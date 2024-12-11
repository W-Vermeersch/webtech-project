import "./login.css";
import axios from "../../api/axios.ts";
import { useNavigate } from "react-router-dom";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";

import { Formik, Form, FormikHelpers } from "formik";
import CustomInput from "./CustomInput.tsx";
import { signUpSchema } from "./signUpSchema.ts";

export default function SignIn() {
  const navigate = useNavigate();

  interface FormValues {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }

  async function onSubmit(
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) {
    const resp = await axios.post("/user/sign-in", values);

    if (resp.status === 206) {
      if (resp.data.errors) {
        if (resp.data.inputs) {
          actions.setValues(resp.data.inputs);
        }
        const touchedFields = Object.keys(resp.data.errors).reduce(
          (acc: { [key: string]: boolean }, key) => {
            acc[key] = true;
            return acc;
          },
          {}
        );
        actions.setTouched(touchedFields);
        actions.setStatus(resp.data.errors);
      }
    } else {
      if (resp.data.redirect) {
        navigate(resp.data.redirect); // Redirect on the frontend
        actions.resetForm();
      }
    }
  }

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
      }}
      validationSchema={signUpSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form>
          <Stack gap={4}>
            <FormGroup as={Col} controlId="validationFormik01">
              <CustomInput
                label="Username"
                name="username"
                id="username"
                type="text"
                placeholder="Enter your username"
              />
            </FormGroup>

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
              Object.values(status).map(
                (value, idx) =>
                  value && (
                    <div key={String(idx)} className="text-danger small">
                      {value as string}
                    </div>
                  )
              )}
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
