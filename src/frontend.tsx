/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

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
