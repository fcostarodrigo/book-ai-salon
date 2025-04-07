import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const element = document.querySelector("#root");

if (element === null) {
  throw new Error("No root element found");
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

/* eslint-disable */
if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(element));

  root.render(app);
} else {
  createRoot(element).render(app);
}
/* eslint-enable */
