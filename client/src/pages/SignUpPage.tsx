import SignIn from "../components/login/SignIn";
import "./SignUpPage.css";

export default function SignUpPage() {
  return (
    <div className="row justify-content-center">
      <div className="col-7">
        <div id="form-container" className="container-sm rounded shadow-sm">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
