import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

// for the scroller
const queryClient = new QueryClient();

const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:"
});

axios.interceptors.request.use((request) => { 
  console.log(request);
  return request;
}, (error) => {
  console.log("Request error");
  return Promise.reject(error);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider store={store}>
        <BrowserRouter>
         <App />
        </BrowserRouter>
      </AuthProvider>
      </QueryClientProvider>
  </StrictMode>
);
