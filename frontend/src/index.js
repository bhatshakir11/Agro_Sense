import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const resizeObserverLoopMessages = [
  "ResizeObserver loop completed with undelivered notifications.",
  "ResizeObserver loop limit exceeded",
];

window.addEventListener("error", (event) => {
  if (resizeObserverLoopMessages.includes(event.message)) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
