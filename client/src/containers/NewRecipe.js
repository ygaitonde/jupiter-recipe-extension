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

  function validateForm() {
    return name.length > 0;
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

  function fetchSearchResults(){
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
    axios({
      url: url,
      method: 'post',
      data: {
        query: `
          query{
            search(page:0, query: "${query}"){
              name
            }
          }
        `
      }
    })
    .then((res) => {
      console.log(res.data)
    })
    .catch(console.error);
  }

  function renderSearchResults() {
    return
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