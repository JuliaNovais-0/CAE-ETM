import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

function initTheme() {
  const saved = localStorage.getItem("theme"); // "dark" | "light" | null
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;

  const theme = saved ?? (prefersDark ? "dark" : "light");
  document.documentElement.classList.toggle("dark", theme === "dark");
}

initTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);