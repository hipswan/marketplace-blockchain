import React, { Component } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",

  transform: "translate(-50%, -50%)",
  width: 400,

  overflow: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

class Seller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleOpen() {
    this.setState({ open: true });
  }

  render() {
    return (
      <div id="content">
        <h1>Hello {this.props.name}</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const name = this.productName.value;
            const price = this.productPrice.value;

            const quantity = this.productQuantity.value;
            const selectedFile = this.inputFile.files[0];

            // debugger;
            // console.log(selectedFile.webkitRelativePath);
            // this.props.uploadFile(name,selectedFile)
            this.props.createProduct(name, price, quantity, selectedFile);
          }}
        >
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => {
                this.productName = input;
              }}
              className="form-control"
              placeholder="Product Name"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => {
                this.productPrice = input;
              }}
              className="form-control"
              placeholder="Product Price"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productQuantity"
              type="text"
              ref={(input) => {
                this.productQuantity = input;
              }}
              className="form-control"
              placeholder="Product Quantity"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              ref={(input) => {
                this.inputFile = input;
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form>
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
                  <th scope="row">{key}</th>
                  <td>{product.name}</td>
                  <td>{product.price} Eth</td>
                  <td>{product.quantity}</td>
                  <td>
                    {!true ? (
                      <button
                        name={product.id}
                        value={product.price}
                        onClick={(event) => {
                          this.props.purchaseProduct(
                            event.target.name,
                            event.target.value
                          );
                        }}
                      >
                        Buy
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="container">
          <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
            {this.props.products.map((product, key) => {
              return (
                <div key={key} className="col">
                  <div className="card mb-3" style={{ maxWidth: "600px" }}>
                    <div className="card-header">{product.id}</div>
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
                          <h5 className="card-title">{product.name}</h5>
                          <span className="card-text">
                            Quantity: {product.quantity}
                          </span>
                          <p className="card-text">Price: ⟠ {product.price}</p>
                          <button
                            className="card-link btn btn-primary"
                            onClick={(event) => {
                              event.preventDefault();
                              this.props.deleteProduct(product.productId);
                            }}
                          >
                            delete
                          </button>
                          <button
                            className="card-link btn btn-primary"
                            onClick={(event) => {
                              this.productName = product.name;
                              this.productPrice = product.price;
                              this.productQuantity = product.quantity;
                              this.productId = product.productId;
                              this.handleOpen();
                            }}
                          >
                            update
                          </button>

                          {/* <p className="card-text">Price: {product.price}</p> */}
                          {/* <p className="card-text">
                            <small class="text-muted">
                              Last updated 3 mins ago
                            </small>
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Modal
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} component="form">
            <h5>Update Item</h5>
            <TextField
              required
              id="outlined-required"
              label="Product Name"
              margin="normal"
              onChange={(event) => {
                this.productName = event.target.value;
              }}
              inputRef={(input) => {
                if (input) this.productName = input.value;
              }}
              defaultValue={this.productName}
            />
            <TextField
              required
              id="outlined-number"
              label="Quantity"
              type="number"
              margin="normal"
              defaultValue={this.productQuantity}
              onChange={(event) => {
                this.productQuantity = event.target.value;
              }}
              inputRef={(input) => {
                if (input) this.productQuantity = input.value;
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              required
              id="outlined-number"
              label="Price"
              type="number"
              margin="normal"
              onChange={(event) => {
                this.productPrice = event.target.value;
              }}
              inputRef={(input) => {
                if (input) this.productPrice = input.value;
              }}
              defaultValue={this.productPrice}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="outlined-required"
              margin="normal"
              type="file"
              inputRef={(input) => {
                this.inputFile = input;
              }}
            />
            <Button
              margin="normal"
              onClick={(event) => {
                event.preventDefault();

                const name = this.productName;
                const price = this.productPrice;

                const quantity = this.productQuantity;
                var selectedFile = "";
                if (this.inputFile.files[0]) {
                  selectedFile = this.inputFile.files[0];
                }
                // console.log(this.productId);
                // debugger;
                // console.log(selectedFile.webkitRelativePath);
                // this.props.uploadFile(name,selectedFile)
                this.props.updateProduct(
                  this.productId,
                  name,
                  price,
                  quantity,
                  selectedFile
                );
              }}
            >
              Save
            </Button>
          </Box>
        </Modal>
      </div>
    );
  }
}

export default Seller;
