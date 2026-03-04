// src/App.jsx
import { Toaster } from "react-hot-toast";
import AppRouter from "./app/router";

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" />
    </>
  );
}