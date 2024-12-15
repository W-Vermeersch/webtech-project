import React, { useState } from "react";
import { Toast } from "react-bootstrap";
import useIsAuthenticated from "../../hooks/useIsAuthenticated";
import "./withAuthCheck.css"

const withAuthCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const isAuthenticated = useIsAuthenticated(); // Use the hook
    const [showToast, setShowToast] = useState(false);

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
