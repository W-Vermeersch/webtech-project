import React, { useState } from "react";
import { Toast } from "react-bootstrap";
import useIsAuthenticated from "../../hooks/useIsAuthenticated";
import "./withAuthCheck.css";

//This HOC wraps a component to add an authentication check. If the user is not authenticated,
//it prevents specific actions (such as liking or commenting) and displays a notification toast.
// Inspiration/documentation taken from: https://react-typescript-cheatsheet.netlify.app/docs/hoc/react_hoc_docs

const withAuthCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const isAuthenticated = useIsAuthenticated();
    const [showToast, setShowToast] = useState(false);

    // If the user is not authenticated, then display the toast.
    const authCheck = (action: () => void) => {
      if (isAuthenticated) {
        action();
      } else {
        setShowToast(true);
      }
    };

    return (
      <>
        <WrappedComponent {...props} authCheck={authCheck} />
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          className="auth-toast"
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>You're not logged in!</Toast.Body>
        </Toast>
      </>
    );
  };
};

export default withAuthCheck;
