import { First } from "react-bootstrap/esm/PageItem";
import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]){8,}$/;

export const signUpSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .matches(passwordRules, {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase latter and one digit",
    })
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Passwords must match")
    .required("Password confirmation is required"),
});
