import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthProvider.tsx";

import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "nes.css/css/nes.min.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// for the scroller
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
         <App />
        </BrowserRouter>
      </AuthProvider>
      </QueryClientProvider>
  </StrictMode>
);
