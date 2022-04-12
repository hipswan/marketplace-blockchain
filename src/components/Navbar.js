import React, { Component } from "react";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buffalo Food Exchange: A Dapp for Foodies
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white">
              <span id="account">{this.props.account}: {this.props.wallet}</span>
            </small>
          </li>
        </ul>
        <IconButton aria-label="cart">
          <Badge
            badgeContent={4}
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
    );
  }
}

export default Navbar;
