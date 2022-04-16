import React, { Component } from "react";
import Switch from "react-switch";
import ShoppingCartRounded from "@mui/icons-material/ShoppingCartRounded";
import ButtonGroup from "@mui/material/ButtonGroup";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class Buyer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productQuantities: [],
      open: false,
    };
    this.setProductQuantity = this.setProductQuantity.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleQuantityMinus = this.handleQuantityMinus.bind(this);
    this.handleQuantityPlus = this.handleQuantityPlus.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.products !== prevProps.products) {
      this.setState({
        productQuantities: new Array(this.props.products.length).fill(0),
      });
    }
  }
  handleQuantityMinus(key) {
    let quantity = [...this.state.productQuantities];
    quantity[key] = Math.max(0, quantity[key] - 1);
    this.setState({ productQuantities: quantity });
  }
  handleQuantityPlus(key, quantity) {
    let quantityArray = [...this.state.productQuantities];
    quantityArray[key] = Math.min(quantity, quantityArray[key] + 1);
    this.setState({ productQuantities: quantityArray });
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

  render() {
    return (
      <div id="content">
        <h1>Hello {this.props.name}</h1>

        <p>&nbsp;</p>
        <h2>Product Details</h2>
        <label>
          <span> Delivery </span>
          <Switch
            onChange={this.props.toggleTakeout}
            checked={!this.props.isTakeout}
          />
        </label>

        <div className="container">
          <div
            className="row row-cols-3 row-cols-lg-5 g-2 g-lg-3"
            // style={{ maxWidth: "600px" }}
          >
            {this.props.products.map((product, key) => {
              return (
                <Card key={key} sx={{ maxWidth: 345, margin: "10px" }}>
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
                    <Typography variant="body2" color="text.secondary">
                      {product.sellerName}
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
                    <IconButton
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={(event) => {
                        event.preventDefault();
                        this.handleQuantityMinus(key);
                      }}
                    >
                      <RemoveRoundedIcon />
                    </IconButton>
                    <Typography
                      sx={{ marginLeft: 2, marginRight: 1 }}
                      variant="body2"
                      color="text.secondary"
                    >
                      {this.state.productQuantities[key]
                        ? this.state.productQuantities[key]
                        : "0"}
                    </Typography>

                    <IconButton
                      variant="outlined"
                      color="primary"
                      margin="normal"
                      onClick={(event) => {
                        event.preventDefault();
                        this.handleQuantityPlus(key, product.quantity);
                      }}
                    >
                      <AddRoundedIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartRounded />}
                      onClick={(event) => {
                        // this.handleClick();
                        if (this.state.productQuantities[key])
                          this.props.addProductToCart(
                            key,
                            this.state.productQuantities[key]
                          );
                      }}
                    >
                      Add to Cart
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
      </div>
    );
  }
}

export default Buyer;
