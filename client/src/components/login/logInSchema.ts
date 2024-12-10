import * as yup from "yup";

export const logInSchema = yup.object().shape({
  usernameOrEmail: yup.string().required("Username/Email is required"),
  password: yup.string().required("Password is required"),
});
