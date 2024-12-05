import "./login.css";
import axios from "axios";
import RouteToServer from "../../infos.ts";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";

import { Formik, Form, FormikHelpers } from "formik";
import CustomInput from "./CustomInput.tsx";
import { logInSchema } from "./logInSchema.ts";

export default function LogIn() {
  interface IUserData {
    username: string;
    UserID: string;
  }

  const signIn = useSignIn();
  const navigate = useNavigate();

  interface FormValues {
    usernameOrEmail: string;
    password: string;
  }

  async function onSubmit(
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) {
    const resp = await axios.post(RouteToServer("/user/log-in"), values);

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
    } else if (
      signIn({
        auth: {
          token: resp.data.accessToken,
          type: "Bearer",
        },
        refresh: resp.data.refreshToken,
        userState: { username: resp.data.username, userID: resp.data.userID },
      })
    ) {
      console.log("Logged in successfully");
      if (resp.data.redirect) {
        navigate(resp.data.redirect); // to home
        actions.resetForm();
      }
    } else {
      console.log("refresh token issue");
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
