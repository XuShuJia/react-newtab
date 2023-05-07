import "normalize.css";
import "~/styles/reset.less";
import "~/styles/common.less";
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { routes } from "~/routes";
import { store, setDarkThemeMode, setLightThemeMode } from "~/store";

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  store.dispatch(setDarkThemeMode());
} else {
  store.dispatch(setLightThemeMode());
}
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (e.matches) {
      store.dispatch(setDarkThemeMode());
    } else {
      store.dispatch(setLightThemeMode());
    }
  });

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </React.StrictMode>
);
