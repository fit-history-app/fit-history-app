import React from "react";
import ReactDOM from "react-dom/client";
import { 
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";

import Home from "./routes/home/main";
import Trivia from "./routes/trivia/main";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Home />}
      errorElement={<ErrorPage />}
    >
      <Route
        path="trivia"
        element={<Trivia />}
        >
        </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  </React.StrictMode>
);
