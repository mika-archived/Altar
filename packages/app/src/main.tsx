import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";

import App from "./App";
import Loading from "./components/containers/Loading";

import "./i18n";

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
    <React.Suspense fallback={<Loading />}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.querySelector("#app")
);
