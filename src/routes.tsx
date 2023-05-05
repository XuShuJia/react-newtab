import { lazy } from "react";
import { createHashRouter, Navigate } from "react-router-dom";

const NewTab = lazy(() => import("~/pages/NewTab"));

const routes = createHashRouter([
  {
    path: "/",
    element: <Navigate to="/newtab" />,
  },
  {
    path: "/newtab",
    element: <NewTab />,
  },
  {
    path: "*",
    element: "404",
  },
]);

export { routes };
