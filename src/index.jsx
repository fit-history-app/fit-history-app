import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import "./styles/index.css";

// page imports
import Root from "./routes/root";
import Trivia from "./routes/trivia/trivia";
import Scav from "./routes/scav/scav";
import ErrorPage from "./error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/scav",
    element: <Scav />,
  },
  {
    path: "/trivia",
    element: <Trivia />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);