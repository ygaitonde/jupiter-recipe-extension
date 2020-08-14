import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./Recipes.css";

export default function Recipes() {
  const { id } = useParams();
  const history = useHistory();
  const [recipe, setRecipe] = useState(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadRecipe() {
      return API.get("recipes", `/recipes/${id}`);
    }

    async function onLoad() {
      try {
        const recipe = await loadRecipe();
        const { content, recipeName } = recipe;

        setName(recipeName);
        setRecipe(recipe);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    //return content.length > 0 && name.length > 0
    return true
  }
  
  function saveRecipe(recipe) {
    console.log(recipe)
    return API.put("recipes", `/recipes/${id}`, {
      body: {
        recipe
      }
    });
  }
  
  async function handleSubmit(event) {  
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      await saveRecipe({
        recipeName: name,
        content: {},
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  function deleteRecipe() {
    return API.del("recipes", `/recipes/${id}`);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  
    try {
      await deleteRecipe();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }
  
  return (
    <div className="Recipes">
      {recipe && (
        <form onSubmit={handleSubmit}>
          <h4>Recipe Name</h4>
          <FormGroup controlId="name">
            <FormControl
              value={name}
              placeholder="New recipe name"
              componentClass="input"
              onChange={e => setName(e.target.value)}
            />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}