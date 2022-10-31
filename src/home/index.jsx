import React from "react";
import ReactDOM from "react-dom/client";
import { 
  BrowserRouter,
  RouterProvider, 
  Route,
} from "react-router-dom";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";


import Root from "./App";
import ErrorPage from "../error-page";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>
);
