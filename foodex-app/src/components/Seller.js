import React, { Component } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MuiAlert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
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
        <div className="container">
          <div
            className="row row-cols-3 row-cols-lg-5 g-2 g-lg-3"
            // style={{ maxWidth: "600px" }}
          >
            {this.props.products.map((product, key) => {
              return (
                <Card key={key} sx={{ width: 340, margin: "10px" }}>
                  <CardMedia
                    component="img"
                    alt={product.name}
                    height="140"
                    width="200"
                    image={product.image}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                    >
                      Quantity: {product.quantity}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                    >
                      Price: {product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<ModeEditOutlineRoundedIcon />}
                      color="primary"
                      onClick={(event) => {
                        this.productName = product.name;
                        this.productPrice = product.price;
                        this.productQuantity = product.quantity;
                        this.productId = product.productId;
                        this.handleOpen();
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      endIcon={<DeleteForeverRoundedIcon />}
                      onClick={(event) => {
                        event.preventDefault();
                        this.props.deleteProduct(product.productId);
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
                // <div key={key} className="col">
                //   <div className="card mb-3">
                //     <div className="card-header">{product.id}</div>
                //     <div className="row g-0">
                //       <div className="col-md-4">
                //         <img style={{maxWidth: "100px" }}
                //           src={product.image}
                //           className="img-fluid rounded-start"
                //           alt={product.name}
                //         />
                //       </div>
                //       <div className="col-md-8">
                //         <div className="card-body">
                //           <span className="card-title">{product.name}</span>

                //           <p className="text-muted">{product.sellerName}</p>

                //           <span className="card-text">
                //             Quantity: {product.quantity}
                //           </span>
                //           <span
                //             style={{ display: "block" }}
                //             className="card-text"
                //           >
                //             Price: ⟠ {product.price}
                //           </span>

                //           <Button
                //             variant="contained"
                //             startIcon={<ShoppingCartRounded />}
                //             onClick={(event) => {
                //               this.handleClick();
                //             }}
                //           >
                //             Add to Cart
                //           </Button>
                //           <Snackbar
                //             open={this.state.open}
                //             autoHideDuration={2000}
                //             anchorOrigin={{
                //               vertical: "top",
                //               horizontal: "right",
                //             }}
                //             onClose={this.handleClose}
                //           >
                //             <Alert
                //               onClose={this.handleClose}
                //               severity="success"
                //               sx={{ width: "100%" }}
                //             >
                //               This is a success message!
                //             </Alert>
                //           </Snackbar>

                //           {/* <p className="card-text">Price: {product.price}</p> */}
                //         </div>
                //       </div>
                //     </div>
                //   </div>
                // </div>
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
              disabled
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
