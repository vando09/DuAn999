import React from "react";
import ReactDOM from 'react-dom/client'
import "./index.css";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";
import "bootstrap/dist/js/bootstrap.bundle.min";
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);


