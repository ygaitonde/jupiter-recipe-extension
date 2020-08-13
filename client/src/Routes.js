import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      {/* catch unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}