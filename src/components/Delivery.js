import React, { Component } from "react";

class Delivery extends Component {
  render() {
    return (
      <div id="content">
        <h1>Hello {this.props.accountDetails}</h1>

        <p>&nbsp;</p>
        <h2>Current Delivery</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Seller Name</th>
              <th scope="col">Buyer Name</th>
              <th scope="col">Item Name</th>
              {/* <th scope="col"></th> */}
            </tr>
          </thead>
          <tbody id="delivery">
            {
                this.props.delivery ?
                <tr></tr>
                //    <tr>
                //     <th scope="row">{delivery.id.toString()}</th>
                //     <td>{delivery.sellerName}</td>
                //     <td>{delivery.buyerName} Eth</td>
                //     <td>{delivery.itemName}</td>
                //     <td>{delivery.timeAlloted}</td>
                //   </tr> 
                  :<tr><th><p> No Task Assigned Yet</p></th> </tr>
            }
          </tbody>
        </table>
        <h2>Past Deliveries</h2>
      </div>
    );
  }
}

export default Delivery;
