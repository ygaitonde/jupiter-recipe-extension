import React, { Component } from 'react'
import Product from './Product'

class ProductList extends Component {
  
  render() {
    const query = `
      query{
        search(page:0, query: "chicken"){
          name
        }
      }
    `;
    const url = "https://graphql.jupiter.co/";
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    };
    fetch(url, opts)
      .then(res => res.json())
      .then(console.log)
      .catch(console.error);

    const productsToRender = [
      {
        id: '1',
        name: 'testing',
      },
      {
        id: '2',
        name: 'testing2',
      },
    ]
    return (
      <div>{productsToRender.map(product => <Product key={product.id} product={product} />)}</div>
    )
  }
}

export default ProductList