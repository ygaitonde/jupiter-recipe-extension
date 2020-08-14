import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewRecipe from "./containers/NewRecipe";
import Recipes from "./containers/Recipes";
import NotFound from "./containers/NotFound";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/recipes/new">
        <NewRecipe />
      </Route>
      <Route exact path="/recipes/:id">
        <Recipes />
      </Route>
      {/* catch unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}