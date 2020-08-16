import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl } from "react-bootstrap";
import { API } from "aws-amplify";
import axios from 'axios'
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config"
import "./NewRecipe.css";

export default function NewRecipe() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [content, setContent] = useState([])
  const [query, setQuery] = useState("")
  const [recipeUrl, setRecipeUrl] = useState("")
  const [results, setResults] = useState({})
  const [isLoading, setIsLoading] = useState(false);

  //whenever the query updates update the search results
  useEffect(() => {
    if ( query=="" ) {
      setResults({})
    } else {
      fetchSearchResults();
    }
  }, [query]);

  //only allow the user to create a recipe if it has a name + at least one product
  function validateForm(){
    // make sure that if they cancelled deleting an ingredient they put a new quantity
    for (let i = 0; i<content.length; i++){
      if(content[i].quantity<1){ return false }
    }
    return name.length > 0 && content.length > 0
  }

  // create the recipe and redirect to home page
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
  
    try {
      await createRecipe(name);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  // post new recipe to backend API
  function createRecipe(name) {
    console.log("name: ", name)
    return API.post("recipes", "/recipes", {
      body: {
          name: name,
          content: content
      }
    });
  }

  // get product search result from Jupiter GraphQL API. update results hook with API query results
  async function fetchSearchResults(){
    const url = "https://graphql.jupiter.co/";
    await axios({
      url: url,
      method: 'post',
      data: {
        query: `
          query{
            search(page:0, query: "${query}"){
              name
              productId{
                value
              }
            }
          }
        `
      }
    })
    .then((res) => {
      console.log(res)
      setResults(res.data.data.search.slice(0,5))
      console.log(results)
    })
    .catch(console.error);
  }

  // use object mapping to render the results from the search
  // renders link to product and a button that allows the user to add the product to their recipe
  function renderSearchResults(){
    if (Object.keys(results).length && results.length) {
      return (
        <div className='search-card'>
          {results.map((result) => {
            return (
              <div key={result.productId.value}>
                <a href={`https://app.jupiter.co/product/${result.productId.value}`} target='_blank'>
                  <h6 className='card-text'>{result.name}</h6>
                </a>
                <button className='add-btn' onClick={(e) => handleProductClick(e, result.name, result.productId.value)}>Add</button>
              </div>
            );
          })}
        </div>
      );
    }
  };

  // use object mapping to render all the recipe contents and change the quantity of each product
  function renderRecipeContent(){
    console.log(content)
    if (content.length > 0) {
      return (
        <div className='card'>
          {content.map((ingredient) => {
            if(ingredient.name.length > 75){
              ingredient.name = ingredient.name.substr(0,70) + "..."
            }
            return (
              <div key={ingredient.productId}>
                <a href={`https://app.jupiter.co/product/${ingredient.productId}`} target='_blank'>
                  <h6 className='card-text'>{ingredient.name}</h6>
                </a>
                <label className='card-text' for="quantity">Quantity:</label>
                <input className='quant-input' defaultValue={ingredient.quantity} type="number" id="quantity" name="quantity" min="0" onChange={(e) => handleQuantityChange(e.target.value, ingredient)}/> 
              </div>
            );
          })}
        </div>
      );
    }
    else{
      return (
        <h5>Your recipe has no ingredients - add some below!</h5>
      )
    }
  }

  //update each product's quantity in the recipe based on the user's selctions
  //note: we are making a copy instead of directly updating the content because
  //the async nature of hooks was causing problems elsewhere in the app
  function handleQuantityChange(val ,ingredient){
    let contentCopy = [...content]
    let oldIngredient = contentCopy.find(element => element.name == ingredient.name)
    //delete the ingredient if quantity is zero
    if(parseInt(val)===0 && window.confirm("Are you sure you want to remove this ingredient?")){
      const index = contentCopy.indexOf(oldIngredient)
      contentCopy.splice(index, 1);
    }
    else{
      oldIngredient.quantity = parseInt(val)
    }
    console.log(contentCopy)
    setContent(content => [...contentCopy])
  }

  //add user selected product to recipe 
  function handleProductClick(e, name, productId){
    e.preventDefault()
    console.log(content)
    setQuery("")
    setResults([])

    let ingredient = {name: name, quantity: 1, productId: productId}
    setContent(content => [...content, ingredient])

    console.log(content)
  }

  //function that uses the spoonacular API to get the ingredients from the recipe, look up the jupiter products
  //associated with the ingredients from the recipe, and add those products to the recipe
  //KNOWN ISSUE: currently not handling if the user puts in an invalid URL
  async function getURLContent(e){
    const API_KEY = config.spoonacular.API_KEY
    fetch(`https://api.spoonacular.com/recipes/extract?apiKey=${API_KEY}&url=${recipeUrl}`)
    .then(response => response.json())
    .then(data => {
      setName(data.title)
      console.log(data)
      let ingredients = data.extendedIngredients
      for(let i = 0; i<ingredients.length; i++){
        const url = "https://graphql.jupiter.co/";
        axios({
          url: url,
          method: 'post',
          data: {
              query: `
                query{
                  search(page:0, query: "${ingredients[i].name}"){
                    name
                    productId{
                      value
                    }
                  }
                }
              `
          }
        })
        .then((res) => {
          const product = res.data.data.search[0]
          if(product){
            handleProductClick(e, product.name,product.productId.value)
          }
        })
        .catch((error) => {
          console.log(error)
        })
      }
    }) 
    //bug: this isn't actually sending users back to the homepage
    .catch((error) => {
      alert(error+". Please reload the extension")
      history.push("/")
    }); 
  }
  
  // render the form that allows user to create the name, see ingredients they've added,
  // add new ingredients, and create the recipe
  return (
    <div className="NewRecipe">
      <h4>Load a recipe from another site:</h4>
      <input
        onChange={e => setRecipeUrl(e.target.value)}
      />
      <button className="add-btn" onClick={(e) => getURLContent(e)}>Load Recipe</button>
      <hr />
      <form onSubmit={handleSubmit}>
        <h4>Recipe name:</h4>
        <FormGroup controlId="name">
          <FormControl
            value={name}
            componentClass="input"
            onChange={e => setName(e.target.value)}
          />
        </FormGroup>
        <hr/>
        <h4>Recipe Ingredients:</h4>
        {renderRecipeContent()}
        <hr/>
        <h4>Add ingredients:</h4>
        <FormGroup controlId="query">
          <FormControl
            value={query}
            placeholder="Search Jupiter Catalog"
            componentClass="input"
            onChange={e => {
              setQuery(e.target.value)
            }}
          />
        </FormGroup>
        {renderSearchResults()}
        <LoaderButton
          block
          className="create-btn"
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create Recipe
        </LoaderButton>
      </form>
    </div>
  );
}