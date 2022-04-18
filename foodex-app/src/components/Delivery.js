import React, { Component } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeliveryInProgress from "./assets/delivery_in_progress.gif";
import NoDeliveryPending from "./assets/no_order_pending.png";
import { DataGrid } from "@mui/x-data-grid";
import { CardActionArea, CardActions, Stack } from "@mui/material";
import { Card } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

class Delivery extends Component {
  render() {
    const columns = [
      { field: "id", headerName: "Delivery ID", width: 200 },
      {
        field: "buyerName",
        headerName: "Buyer Name",
        width: 200,
        editable: true,
      },
      {
        field: "timeAssigned",
        headerName: "Delivery Alloted at",
        type: "date",
        width: 300,
        editable: true,
      },
      {
        field: "timeDelivered",
        headerName: "Delivered at",
        type: "date",
        width: 300,
      },
    ];
    const rows = this.props.pastDeliveries.map((delivery) => {
      return {
        id: delivery.deliveryId,
        buyerName: delivery.buyerName,
        timeAssigned: Date(delivery.timeAssigned.seconds * 1000),
        timeDelivered: Date(delivery.timeDelivered.seconds * 1000),
      };
    });

    return (
      <Stack>
        <h1>Current Task </h1>

        <Card
          sx={{
            width: 300,
            height: 330,
            mb: 3,
          }}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={
                this.props.deliveryPerson &&
                "available" in this.props.deliveryPerson &&
                !this.props.deliveryPerson.available
                  ? DeliveryInProgress
                  : NoDeliveryPending
              }
              alt="delivery in progress"
            />
            <CardContent>
              <Stack>
                <Typography gutterBottom variant="h5" component="div">
                  {this.props.deliveryPerson &&
                  "available" in this.props.deliveryPerson &&
                  !this.props.deliveryPerson.available
                    ? "Delivery In progress"
                    : "No Delivery Pending"}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  Buyer name:{" "}
                  {this.props.deliveryPerson &&
                    "buyerName" in this.props.deliveryPerson &&
                    !this.props.deliveryPerson.available &&
                    this.props.deliveryPerson.buyerName}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  Time Assigned:{" "}
                  {this.props.deliveryPerson &&
                    "timeAssigned" in this.props.deliveryPerson &&
                    !this.props.deliveryPerson.available &&
                    Date(
                      this.props.deliveryPerson.timeAssigned.seconds
                    ).toString()}
                </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
          {/* <CardActions>
            {this.props.deliveryPerson &&
              "available" in this.props.deliveryPerson &&
              this.props.deliveryPerson.available && (
                <Button
                  size="small"
                  color="primary"
                  onClick={(event) => {
                    event.preventDefault();

                    props.settlePayment(!props.isTakeout);
                    // handleOrderClose();
                  }}
                >
                  Order Received
                </Button>
              )}
          </CardActions> */}
        </Card>
        <Box sx={{ display: { xs: "none", md: "flex", flexGrow: 0 } }}>
          <Stack>
            <h1> Past Delivery Details</h1>
            <div style={{ height: 400, width: "100vw" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </div>
          </Stack>
        </Box>
      </Stack>
    );
  }
}

export default Delivery;
