// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import './styles/complaints.css';
import "bootstrap-icons/font/bootstrap-icons.css";
// Global styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/UserHome.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
