import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "dcfce7",
              color: "#166534",
              fontWeight: "600",
              borderRadius: "0.75rem",
              border: "1px solid #86efac",
            },
          },
          error: {
            style: {
              background: "#fee2e2",
              color: "#991b1b",
              fontWeight: "600",
              borderRadius: "0.75rem",
              border: "1px solid #fca5a5",
            },
          },
          duration: 3000,
        }}
      />
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
