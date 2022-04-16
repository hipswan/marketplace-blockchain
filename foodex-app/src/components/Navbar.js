import React, { Component } from "react";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",

  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "70%",
  overflow: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

class Navbar extends Component {
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
    const productsInCart = Array.from(
      new Map(Object.entries(this.props.productsInCart)).values()
    );
    const comission = 0.05;
    const delivery = this.props.isTakeout ? 0 : 1;
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <span className="navbar-brand col-sm-3 col-md-2 mr-0">
            Buffalo Food Exchange: A Dapp for Foodies
          </span>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
                <span id="account">
                  {this.props.account}: {this.props.wallet}
                </span>
              </small>
            </li>
          </ul>
          <IconButton onClick={this.handleOpen} aria-label="cart">
            <Badge
              badgeContent={productsInCart.reduce(
                (acc, curr) => acc + curr.quantityNeeded,
                0
              )}
              max={99}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              color="secondary"
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {this.props.isreg && (
            <button
              onClick={(event) => {
                event.preventDefault();

                this.props.logout();
              }}
              className="btn btn-primary"
            >
              Logout
            </button>
          )}
        </nav>
        <Modal
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              ...style,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              // justifyContent: "space-between",
            }}
          >
            <Box sx={{ flex: "1" }} component="form">
              <h5>Cart</h5>
              {productsInCart.map((product, key) => {
                return (
                  <Card
                    key={key}
                    sx={{
                      display: "flex",
                      maxWidth: "400px",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={product.image}
                      alt={product.name}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography component="div" variant="h5">
                          {product.name}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                        >
                          Quantity: {product.quantityNeeded}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                        >
                          Price: {product.price}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                        >
                          Total: {product.price * product.quantityNeeded}
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                );
              })}
            </Box>
            <Box
              sx={{
                display: "flex",
                flex: "1",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography>Item Total</Typography>
                  {productsInCart.length > 0 && !this.props.isTakeout && (
                    <Typography>Delivery</Typography>
                  )}
                  {productsInCart.length > 0 && (
                    <Typography>Comission</Typography>
                  )}
                  {productsInCart.length > 0 && <Typography>Total</Typography>}
                </Box>
                <Box>
                  <Typography>
                    {" "}
                    {productsInCart.reduce(
                      (acc, curr) => acc + curr.price * curr.quantityNeeded,
                      0
                    )}
                  </Typography>
                  {productsInCart.length > 0 && !this.props.isTakeout && (
                    <Typography>{delivery}</Typography>
                  )}
                  {productsInCart.length > 0 && (
                    <Typography>{comission}</Typography>
                  )}
                  {productsInCart.length > 0 && (
                    <Typography>
                      {" "}
                      {productsInCart.reduce(
                        (acc, curr) => acc + curr.price * curr.quantityNeeded,
                        0
                      ) +
                        delivery +
                        comission}
                    </Typography>
                  )}

                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      if (productsInCart.length > 0) {
                        this.props.buy(!this.props.isTakeout);

                        this.handleClose();
                      }
                    }}
                  >
                    Buy
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>
      </div>
    );
  }
}

export default Navbar;
