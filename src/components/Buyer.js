import React, { Component } from "react";
import Switch from "react-switch";
import Button from "@mui/material/Button";
import ShoppingCartRounded from "@mui/icons-material/ShoppingCartRounded";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


class Buyer extends Component {
  constructor(props) {
    super(props);
    this.state = { checked: false, productQuantity: 1, open: false };
    this.handleChange = this.handleChange.bind(this);
    this.setProductQuantity = this.setProductQuantity.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ open: false });
  }
  handleClick() {
    this.setState({ open: true });
  }

  setProductQuantity(event) {
    this.setState({ productQuantity: event.target.value });
  }

  handleChange(checked) {
    this.setState({ checked });
  }

  render() {
    return (
      <div id="content">
        <h1>Hello {this.props.name}</h1>

        <p>&nbsp;</p>
        <h2>Product Details</h2>
        <label>
          <span> Delivery </span>
          <Switch onChange={this.handleChange} checked={this.state.checked} />
        </label>
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
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        id="productQuantity"
                        className="form-control"
                        placeholder="Item Quantity"
                        aria-label="Item Quantity"
                        onChange={(event) => {
                          this.productQuantity = event.target.value;
                        }}
                        aria-describedby="button-addon2"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        id="button-addon2"
                        onClick={(event) => {
                          event.preventDefault();
                          const quantity = window.web3.utils.toBN(
                            product.quantity
                          );


                          const blockId = window.web3.utils.toBN(product.id);
                          const count = window.web3.utils.toBN(
                            this.productQuantity
                          );
                          this.props.buyProduct(
                            blockId,
                            product.productId,
                            quantity,
                            product.sellerId,
                            count,
                            product.price,
                            this.state.checked
                          );
                        }}
                      >
                        Buy
                      </button>
                      <div className="container">
                        <div
                          className="row row-cols-3 row-cols-lg-5 g-2 g-lg-3"
                          style={{ maxWidth: "500px" }}
                        >
                          {this.props.products.map((product, key) => {
                           
                            return (
                              <div key={key} className="col">
                                <div className="card mb-3">
                                  <div className="card-header">
                                    {product.id}
                                  </div>
                                  <div className="row g-0">
                                    <div className="col-md-4">
                                      <img
                                        src={product.image}
                                        className="img-fluid rounded-start"
                                        alt={product.name}
                                      />
                                    </div>
                                    <div className="col-md-8">
                                      <div className="card-body">
                                        <span className="card-title">
                                          {product.name}
                                        </span>

                                        <p className="text-muted">
                                          {product.sellerName}
                                        </p>

                                        <span className="card-text">
                                          Quantity: {product.quantity}
                                        </span>
                                        <span
                                          style={{ display: "block" }}
                                          className="card-text"
                                        >
                                          Price: ⟠ {product.price}
                                        </span>

                                        <Button
                                          variant="contained"
                                          startIcon={<ShoppingCartRounded />}
                                          onClick={(event) => {this.handleClick()}}
                                        >
                                          Add to Cart
                                        </Button>
                                        <Snackbar
                                          open={this.state.open}
                                          autoHideDuration={2000}
                                          anchorOrigin={{vertical:'top',horizontal:'right'}}
                                          onClose={this.handleClose}
                                        >
                                          <Alert
                                            onClose={this.handleClose}
                                            severity="success"
                                            sx={{ width: "100%" }}
                                          >
                                            This is a success message!
                                          </Alert>
                                        </Snackbar>

                                        {/* <p className="card-text">Price: {product.price}</p> */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
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
