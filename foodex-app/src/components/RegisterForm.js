import React, { Component } from "react";
import BackgroundImage from "./assets/background.png";
import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
const style = {
  position: "absolute",

  width: "100%",
  height: "100%",
  // overflow: "auto",
  bgcolor: "background.paper",
  backgroundImage: `url(${BackgroundImage})`,
  boxShadow: 24,
  p: 4,
};
const userType = [
  {
    value: "buyer",
    label: "BUYER",
  },
  {
    value: "seller",
    label: "SELLER",
  },
  {
    value: "delivery",
    label: "DELIVERY",
  },
];
class RegisterForm extends Component {
  render() {
    return (
      <Stack>
        <Box
          sx={{
            height: "85vh",
            width: "100vw",
            position: "relative",
            objectPosition: "center",
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            p: 25,
          }}
        >
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": {
                mr: 3,
                mt: 3,
                mb: 3,
                width: "25ch",
                bgcolor: "white",
                borderRadius: "5px",
              },
              overflow: "auto",
              position: "absolute",
            }}
            noValidate
            autoComplete="off"
          >
            <h1>Register To Order/Sell Food Online</h1>
            <div>
              <TextField
                id="outlined-multiline-flexible"
                label="Name"
                // value={value}
                placeholder="Enter Name"
                onChange={(event) => {
                  this.name = event.target.value;
                }}
              />
              <TextField
                id="filled-select-currency-native"
                select
                label="Type"
                // value={currency}
                // onChange={handleChange}
                inputRef={(input) => (this.selectUserType = input)}
                SelectProps={{
                  native: true,
                }}
                helperText="Please select your user type"
              >
                {userType.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
              <TextField
                disabled
                id="outlined-multiline-static"
                label="EOA"
                onChange={(event) => {
                  this.name = event.target.value;
                }}
                inputRef={(input) => (this.accountDetails = input)}
                value={this.props.accountDetails}
              />
            </div>
            <div>
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  const name = this.name;
                  const userType = this.selectUserType.value;
                  this.props.registerUser(name, userType);
                }}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Register
              </Button>
            </div>
          </Box>
        </Box>
      </Stack>
    );
  }
}

export default RegisterForm;
