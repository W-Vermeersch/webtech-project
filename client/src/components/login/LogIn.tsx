import "./login.css";
import axios from "../../api/axios.ts";
import { useNavigate, useLocation } from "react-router-dom";
import useSignIn from "../../hooks/useSignIn.tsx";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";

import { Formik, Form, FormikHelpers } from "formik";
import CustomInput from "./CustomInput.tsx";
import { logInSchema } from "./logInSchema.ts";
import { LOG_IN } from "../../api/urls.ts";

export default function LogIn() {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  interface FormValues {
    usernameOrEmail: string;
    password: string;
  }

  async function onSubmit(
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) {
    const resp = await axios.post(LOG_IN, values);

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
      const token = resp.data.accessToken;
      const username = resp.data.username;
      const userID = resp.data.userID;
      signIn(token, username, userID);

      if (resp.data.redirect) {
        actions.resetForm();
        navigate(from, { replace: true }); // to the user was going or /home
      }
    }
  }

  return (
    <Formik
      initialValues={{
        usernameOrEmail: "",
        password: "",
      }}
      validationSchema={logInSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form>
          <Stack gap={4}>
            <FormGroup as={Col} controlId="validationFormik01">
              <CustomInput
                label="Username/Email"
                name="usernameOrEmail"
                id="usernameOrEmail"
                type="text"
                placeholder="Enter your username/email"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="validationFormik04">
              <CustomInput
                label="Password"
                name="password"
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </FormGroup>
            <Button variant="success" type="submit" disabled={isSubmitting}>
              Log In
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
