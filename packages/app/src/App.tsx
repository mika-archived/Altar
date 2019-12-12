import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter, Route } from "react-router-dom";

import About from "./components/containers/About";
import Permalink from "./components/containers/Permalink";
import Root from "./components/containers/Root";

const App: React.FC = () => {
  return (
    <>
      <Helmet defaultTitle="Altar - Online Perl Compiler" titleTemplate="%s | Altar - Online Perl Compiler"></Helmet>
      <BrowserRouter>
        <Route path="/" component={Root} exact />
        <Route path="/permalink/:id" component={Permalink} />
        <Route path="/about" component={About} exact />
      </BrowserRouter>
    </>
  );
};

export default App;
