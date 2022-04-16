import React, { Component } from "react";
import Button from "@mui/material/Button";

class Delivery extends Component {
  render() {
    return (
      <div id="content">
        <h1>Hello {this.props.name}</h1>

        <p>&nbsp;</p>
        <h2>Current Delivery</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>

              <th scope="col">Buyer Name</th>
              {/* <th scope="col"></th> */}
            </tr>
          </thead>
          <tbody id="delivery">
            {!this.props.deliveryPerson.available ? (
              <tr>
                <th scope="row">1</th>
                <td>{this.props.deliveryPerson.buyerName}</td>
                <td>
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      this.props.deliveredProduct();
                    }}
                  >
                    Delivered
                  </Button>
                </td>
              </tr>
            ) : (
              //    <tr>
              //     <th scope="row">{delivery.id.toString()}</th>
              //     <td>{delivery.sellerName}</td>
              //     <td>{delivery.buyerName} Eth</td>
              //     <td>{delivery.itemName}</td>
              //     <td>{delivery.timeAlloted}</td>
              //   </tr>
              <tr>
                <th>
                  <p> No Task Assigned Yet</p>
                </th>
              </tr>
            )}
          </tbody>
        </table>
        <h2>Past Deliveries</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>

              <th scope="col">Buyer Name</th>
              <th scope="col">From</th>
              <th scope="col">To</th>

              {/* <th scope="col"></th> */}
            </tr>
          </thead>
          <tbody id="pastDelivery">
            {this.props.pastDeliveries.map((delivery, key) => {
              debugger;
              return (
                <tr key={key}>
                  <th scope="row">{key + 1}</th>
                  <td>{delivery.buyerName}</td>
                  <td>{delivery.timeAssigned.toDate().toISOString()}</td>
                  <td>{delivery.timeDelivered.toDate().toISOString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Delivery;
