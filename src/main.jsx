import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { legacy_createStore } from "redux";
import { Provider } from "react-redux";
import { Store } from "./redux/Store.js";

const globalStore = legacy_createStore(Store);
createRoot(document.getElementById("root")).render(
  <Provider store={globalStore}>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>
);
