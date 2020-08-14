import React, { Component } from 'react'
import Product from './Product'

class ProductList extends Component {
  render() {

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