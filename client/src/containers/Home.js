import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import "./Home.css";


export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const recipes = await loadRecipes();
        setRecipes(recipes);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadRecipes() {
    return API.get("recipes", "/recipes");
  }

  function renderRecipesList(recipes) {
    return [{}].concat(recipes).map((recipe, i) =>
      i !== 0 ? (
        <LinkContainer key={recipe.recipeId} to={`/recipes/${recipe.recipeId}`}>
          <ListGroupItem header={recipe.recipeName}>
            {console.log(recipe)}
            {"Created: " + new Date(recipe.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/recipes/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new recipe
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Jupiter Recipes</h1>
        <p>A chrome extension for creating recipes using Jupiter products</p>
      </div>
    );
  }

  function renderRecipes() {
    return (
      <div className="recipes">
        <PageHeader>Your Recipes</PageHeader>
        <ListGroup>
          {!isLoading && renderRecipesList(recipes)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderRecipes() : renderLander()}
    </div>
  );
}