import React, { Component } from 'react'

class Product extends Component {
  render() {
    return (
      <div>
        <div>
          {this.props.product.name}
        </div>
      </div>
    )
  }
}

export default Product