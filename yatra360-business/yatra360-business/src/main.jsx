/** Embedded-mode entry: role gate at "/" plus the Business module at "/business/*". */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./shell/AppRoutes.jsx";
import "./business/styles/tokens.css";
import "./business/styles/business.css";
import "./shell/shell.css";

createRoot(document.getElementById("root")).render(
  <StrictMode><AppRoutes /></StrictMode>
);
