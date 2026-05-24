import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";

import { Provider } from "react-redux";
import store from "./store/store";

import { Toaster } from "react-hot-toast";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>

    <Toaster position="bottom-right" reverseOrder={false} />
  </StrictMode>
);

// ✅ Hide preloader after full load
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    preloader.style.transition = "0.3s ease";

    setTimeout(() => {
      preloader.style.display = "none";
    }, 300);
  }
});