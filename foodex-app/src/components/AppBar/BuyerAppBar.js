import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";
import { CardActionArea, CardActions } from "@mui/material";
import OrderInProgress from "../assets/order_in_progress.gif";

const pages = ["Home", "Cart", "Orders"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

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

const BuyerAppBar = (props) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [orderOpen, setOrderOpen] = React.useState(false);

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  const handleOrderOpen = () => {
    setOrderOpen(true);
  };

  const handleOrderClose = () => {
    setOrderOpen(false);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const productsInCart = Array.from(
    new Map(Object.entries(props.productsInCart)).values()
  );
  const comission = 0.05;
  const delivery = props.isTakeout ? 0 : 1;

  const currentOrder = props.currentOrder;
  const pastOrders = props.pastOrders;
  console.log(currentOrder);
  console.log(pastOrders);
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            Food Ex
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            Food Ex
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Home
            </Button>
            <Button
              onClick={handleCartOpen}
              sx={{ my: 2, color: "white" }}
              endIcon={
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
              }
            >
              Cart
            </Button>
            <Button
              onClick={handleOrderOpen}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Orders
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <Modal
        open={cartOpen}
        onClose={handleCartClose}
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
                {productsInCart.length > 0 && !props.isTakeout && (
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
                {productsInCart.length > 0 && !props.isTakeout && (
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
                      props.orderProduct(!props.isTakeout);

                      handleCartClose();
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
      <Modal
        open={orderOpen}
        // onClose={handleOrderClose}
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
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={OrderInProgress}
                alt="order in progress"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Order In progress
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                    >
                      Quantity:{" "}
                      {props.currentOrder &&
                       "products" in props.currentOrder &&
                        props.currentOrder.products.length}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                    >
                      Total:{" "}
                      {props.currentOrder &&
                        "totalPrice" in props.currentOrder &&
                        props.currentOrder.totalPrice}
                    </Typography>
                  </CardContent>
                </Box>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={(event) => {
                  event.preventDefault();

                  props.settlePayment();

                  handleOrderClose();
                }}
              >
                Order Received
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Modal>
    </AppBar>
  );
};
export default BuyerAppBar;
