import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import { refresh } from "./refresh.ts";

const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
  refresh: refresh,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
