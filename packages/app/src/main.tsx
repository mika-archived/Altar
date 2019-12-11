import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";

import App from "./App";

const GlobalStyle = createGlobalStyle`
html, body {
  min-height: 100vh;
  margin: 0;
}

#app {
  height: 100%;
  min-height: 100vh;
  line-height: 1.5;
  color: #fff;
  background-color: #252526;
}
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.querySelector("#app")
);
