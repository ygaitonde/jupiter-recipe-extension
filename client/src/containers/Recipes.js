import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import { FormGroup, FormControl } from "react-bootstrap";
import { TwitterShareButton, FacebookShareButton, RedditShareButton } from "react-share"
import {  SocialIcon } from 'react-social-icons'
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import "./Recipes.css";

//Component to render/allow changes to any recipe given the Recipe Id
export default function Recipes() {
  const { id } = useParams();
  const history = useHistory();
  const [recipe, setRecipe] = useState(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadRecipe() {
      return API.get("recipes", `/recipes/${id}`);
    }

    async function onLoad() {
      //get the recipe from the backend and update hooks
      try {
        const recipe = await loadRecipe();
        const { content, recipeName } = recipe;
        setName(recipeName);
        setRecipe(recipe);
        setContent(content)
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  //only allow users to save valid changes
  function validateForm() {
    return content.length > 0 && name.length > 0
  }
  
  // update the recipe when the user makes changes
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
  
  //make sure users want to delete their recipies
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

  //use object mapping to render every product in the recipe
  function renderRecipeContent(){
    console.log(content.length)
    if (content.length > 0) {
      return (
        <div>
          {content.map((ingredient) => {
            return (
              <div className='card' key={ingredient.productId}>
                <a href={`https://app.jupiter.co/product/${ingredient.productId}`} target='_blank'>
                  <h6 className='card-text'>{ingredient.name}</h6>
                </a>
                <h6 className='card-text'>Quantity: {ingredient.quantity}</h6>
              </div>
            );
          })}
        </div>
      );
    }
    else{
      return (
        <h5>ERROR: Empty Recipe</h5>
      )
    }
  }

  //create the text to be shared on social media based on the recipe content
  //this function usually creates a string that is too long to tweet, but that is OK because 
  //twitter allows users to edit a tweet that is too long rather than rejecting it 
  function renderShareText(){
    let i = 0
    if(content.length < 1) { return };

    let string = `Check out my recipe "${name}" which includes `
    for(i;i<content.length-1;i++){
      string+=`${content[i].name}, `
    }
    //add the last ingredient to the string properly
    string+=` and ${content[content.length-1].name}! `
    string+= "You can buy the ingredients using Jupiter's Grocery Service!"
    return string
  }
  
  // render the current ingredient list as well as the form which allows users to rename their recipies
  // and save their changes, or delete their recipe
  return (
    <div className="Recipes">
      {recipe && (
        <>
          <div className='social-icon'>
            <TwitterShareButton
              url='jupiter.co'
              title={renderShareText()}
            >
              <SocialIcon network='twitter' />
            </TwitterShareButton>
            <FacebookShareButton
              url='jupiter.co'
              title={renderShareText()}
            >
              <SocialIcon network='facebook' />
            </FacebookShareButton>
            <RedditShareButton
              url="jupiter.co"
              title={renderShareText()}
            >
              <SocialIcon network='reddit' />
            </RedditShareButton>
          </div>
          <form onSubmit={handleSubmit}>
            <h4>Recipe Name:</h4>
            <FormGroup controlId="name">
              <FormControl
                value={name}
                placeholder="New recipe name"
                componentClass="input"
                onChange={e => setName(e.target.value)}
              />
            </FormGroup>
            <hr />
            <h4>Recipe Contents:</h4>
            {renderRecipeContent()}
            <hr />
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
        </>
      )}
    </div>
  );
}