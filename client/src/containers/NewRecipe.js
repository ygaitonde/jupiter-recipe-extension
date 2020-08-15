import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { API, Predicates } from "aws-amplify";
import { onError } from "../libs/errorLib";
import axios from 'axios'
import config from "../config";
import "./NewRecipe.css";

export default function NewRecipe() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [content, setContent] = useState([])
  const [query, setQuery] = useState("")
  const [results, setResults] = useState({})
  const [isLoading, setIsLoading] = useState(false);

  function validateForm(){
    // make sure that if they cancelled deleting an ingredient they put a new quantity
    for (let i = 0; i<content.length; i++){
      if(content[i].quantity<1){ return false }
    }
    return name.length > 0 && content.length > 0
  }

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
  
  //TODO add content
  function createRecipe(name) {
    console.log("name: ", name)
    return API.post("recipes", "/recipes", {
      body: {
          name: name,
          content: content
      }
    });
  }

  function handleQueryChange(val){
    setQuery(val)
    if ( query==="" ) {
      setResults({})
    } else {
      fetchSearchResults();
    }
  };

  async function fetchSearchResults(){
    const terms = `
      query{
        search(page:0, query: "${query}"){
          name
        }
      }
    `;
    const url = "https://graphql.jupiter.co/";
    /*const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    };*/
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
      setResults(res.data.data.search.slice(0,5))
    })
    .catch(console.error);
  }

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
                <button className='add-button' onClick={(e) => handleProductClick(e, result.name, result.productId.value)}>Add</button>
              </div>
            );
          })}
        </div>
      );
    }
  };

  function renderRecipeContent(){
    console.log(content.length)
    if (content.length > 0) {
      return (
        <div className='card'>

          {content.map((ingredient) => {
            return (
              <div key={ingredient.productId}>
                <a href={`https://app.jupiter.co/product/${ingredient.productId}`} target='_blank'>
                  <h6 className='card-text'>{ingredient.name}</h6>
                </a>
                <label className='card-text' for="quantity">Quantity:</label>
                <input defaultValue={ingredient.quantity} size="2" type="number" id="quantity" name="quantity" min="0" onChange={(e) => handleQuantityChange(e.target.value, ingredient)}/> 
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

  function handleQuantityChange(val ,ingredient){
    let contentCopy = [...content]
    let oldIngredient = contentCopy.find(element => element.name == ingredient.name)
    //delete the ingredient if quantity is zero
    if(val==0 && window.confirm("Are you sure you want to remove this ingredient?")){
      const index = contentCopy.indexOf(oldIngredient)
      contentCopy.splice(index, 1);
    }
    else{
      oldIngredient.quantity = parseInt(val)
    }
    console.log(contentCopy)
    setContent(content => [...contentCopy])
  }

  function handleProductClick(e, name, productId){
    e.preventDefault()
    console.log(content)
    setQuery("")
    setResults([])

    let ingredient = {name: name, quantity: 1, productId: productId}
    setContent(content => [...content, ingredient])

    console.log(content)
  }

  return (
    <div className="NewRecipe">
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
              handleQueryChange(e.target.value)
            }}
          />
        </FormGroup>
        {renderSearchResults()}
        <LoaderButton
          block
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