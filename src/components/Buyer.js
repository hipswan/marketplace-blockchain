import React, { Component } from "react";

class Buyer extends Component {
  render() {
    return (
      <div id="content">
        <h1>Hello {this.props.accountDetails}</h1>

        <p>&nbsp;</p>
        <h2>Product Details</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.products.map((product, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{product.price} Eth</td>
                  <td>{product.quantity}</td>
                  <td>
                    <div class="input-group mb-3">
                      <input
                        type="text"
                        id="productQuantity"
                        className="form-control"
                        placeholder="Item Quantity"
                        aria-label="Item Quantity"
                        onChange={(event) => { this.productQuantity = event.target.value }}
                        aria-describedby="button-addon2"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        id="button-addon2"
         
                        onClick={(event)=>{
                            debugger;
                            event.preventDefault()
                            const quantity = window.web3.utils.toBN(product.quantity)
      
                            const blockId = window.web3.utils.toBN(product.id)
                            const count = window.web3.utils.toBN(this.productQuantity)
                            this.props.buyProduct(blockId,product.productId, quantity,product.sellerId,count,product.price)
                        }}
                        
                      >
                        Buy
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Buyer;
