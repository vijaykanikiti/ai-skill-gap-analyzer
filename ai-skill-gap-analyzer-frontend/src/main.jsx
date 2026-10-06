import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App";
import ThemeProvider from "./context/ThemeContext";

import { GoogleOAuthProvider } from "@react-oauth/google";

import "./styles/global.css";

const googleClientId =
 "";
ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>

      <GoogleOAuthProvider clientId={googleClientId}>

        <ThemeProvider>
          <App />
        </ThemeProvider>

      </GoogleOAuthProvider>

    </BrowserRouter>
  </React.StrictMode>
);