import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import ProductList from "../components/ProductList"
import { API } from "aws-amplify";
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

  useEffect(() => setContent([]), []);

  function validateForm(){
    return name.length > 0
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
        <div className='card'>
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

  async function handleProductClick(e, name, productId){
    e.preventDefault()
    console.log(content)
    setQuery("")
    setResults([])

    let ingredient = {name: name, amount: 1, productId: productId}
    setContent(content => [...content, ingredient])

    console.log(content)
  }

  return (
    <div className="NewRecipe">
      <form onSubmit={handleSubmit}>
        <h4>Recipe name</h4>
        <FormGroup controlId="name">
          <FormControl
            value={name}
            componentClass="input"
            onChange={e => setName(e.target.value)}
          />
        </FormGroup>
        <hr></hr>
        <h4>Add ingredients!</h4>
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