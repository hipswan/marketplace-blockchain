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
      name: "",
      price: 0,
      quantity: 0,
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

        <Box
          sx={{
            "& .MuiTextField-root": {
              mr: 3,
              mt: 3,
              mb: 3,
              width: "25ch",
              bgcolor: "white",
              borderRadius: "5px",
            },
            pl: 25,
            pr: 25,
          }}
          noValidate
          component="form"
        >
          <Card sx={{ textAlign: "center", p: 4 }}>
            <h5>Register product</h5>
            <div>
              <TextField
                required
                id="outlined-name"
                label="Product Name"
                placeholder="Enter Product Name"
                margin="normal"
                onChange={(event) => {
                  this.setState({ name: event.target.value });
                }}
                value={this.state.name}
              />
              <TextField
                required
                id="outlined-number"
                label="Quantity"
                type="number"
                placeholder="Enter quantity"
                margin="normal"
                defaultValue={this.productQuantity}
                onChange={(event) => {
                  this.setState({ quantity: event.target.value });
                }}
                value={this.state.quantity}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              <TextField
                required
                id="outlined-number"
                label="Price"
                placeholder="Enter placeholders"
                type="number"
                margin="normal"
                onChange={(event) => {
                  this.setState({ price: event.target.value });
                }}
                value={this.state.price}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="outlined-required"
                margin="normal"
                placeholder="Choose relevant Image"
                type="file"
                inputRef={(input) => {
                  this.inputFile = input;
                }}
              />
            </div>
            <Button
              margin="normal"
              variant="contained"
              onClick={(event) => {
                event.preventDefault();

                const selectedFile = this.inputFile.files[0];

                // debugger;
                // console.log(selectedFile.webkitRelativePath);
                // this.props.uploadFile(name,selectedFile)
                this.props.createProduct(
                  this.state.name,
                  this.state.price,
                  this.state.quantity,
                  selectedFile
                );

                this.setState({ name: "", price: 0, quantity: 0 });
              }}
            >
              Save
            </Button>
          </Card>
        </Box>
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
                this.handleClose();
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
