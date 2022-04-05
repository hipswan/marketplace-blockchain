import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./Navbar";
import BFE from "../abis/BFEv4.json";
import RegisterForm from "./RegisterForm";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs ,setDoc ,doc,Timestamp} from 'firebase/firestore/lite';

import { config } from "../utils/config.ts";

class App extends Component {
  async componentWillMount() {
    console.log("dfdfdfdfdkjsdfksdkfsdhfskd");
    await this.loadFirebase();
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  async loadFirebase() {  

    const app = initializeApp(config);
    this.db = getFirestore(app);
    await this.getSellerDetails();
  }
  async  getSellerDetails() {
    const sellerDetails = collection(this.db, 'sellerDetails');
    const sellerDetailsSnapshot = await getDocs(sellerDetails);
    const sellerDetailsList = sellerDetailsSnapshot.docs.map(doc => doc.data());
    console.log(sellerDetailsList);
  }
  async setUserDetails(name,id,type) {
    const user = collection(this.db, 'users');
    const userRef = doc(user, this.state.account);
    await setDoc(userRef,{
      'name' :name,
      'id':id,
      'type':type,
    });
  }
  

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = BFE.networks[networkId];
    if (networkData) {
      //TODO: Check if the account is registered
      //TODO: If registered as a seller fetch the products
      //TODO: If registered as a buyer fetch all the products
      const bfe = new web3.eth.Contract(BFE.abi, networkData.address);
      this.setState({ bfe });
      // const productCount = await marketplace.methods.productCount().call()
      // this.setState({ productCount })
      // // Load products
      // for (var i = 1; i <= productCount; i++) {
      //   const product = await marketplace.methods.products(i).call()
      //   this.setState({
      //     products: [...this.state.products, product]
      //   })
      // }
      const currentUserDetails = await bfe.methods
        .users(this.state.account)
        .call();
      console.log('currentUserDetails',currentUserDetails);
      // const isUserReg = await bfe.methods.isUserReg(this.state.account).call();
      this.setState({ loading: false, registered: currentUserDetails.reg });
    } else {
      window.alert("BFE contract not deployed to detected network.");
    }
  }

  constructor(props) {
    super(props);
    this.db=null;
    this.state = {
      account: "",
      loading: true,
      loadingMsg: "Loading...",
      registered: false,
    };
    this.registerUser = this.registerUser.bind(this);
    this.unregisterUser = this.unregisterUser.bind(this);


  }

  unregisterUser() {
    this.setState({ loading: true });
    this.state.bfe.methods
      .UserUnreg()
      .send({ from: this.state.account })
      .once("receipt",async (receipt) =>  {
        var userMetaData =receipt['events']['UserUnregistered']['returnValues']
        
        this.setState({ loading: false, registered: false });
      });

  }


  registerUser(name, userType) {
    this.setState({ loading: true });

    var userTypeValue = window.web3.utils.toBN(userType === "seller" ? 1 : 0);
   
    this.state.bfe.methods
      .UserReg(name, userTypeValue)
      .send({ from: this.state.account })
      .once("receipt",async (receipt) =>  {
        var userMetaData =receipt['events']['UserRegistered']['returnValues']
        await this.setUserDetails(name,userMetaData.bid,userType);

        this.setState({ loading: false, registered: true });
      });
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} 
        isreg={this.state.registered} 
        logout={this.unregisterUser}
         />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading ? (
                <div id="loader" className="text-center">
                  <p className="text-center">Loading...</p>
                </div>
              ) : !this.state.registered ? (
                <RegisterForm
                  accountDetails={this.state.account}
                  registerUser={this.registerUser}
                />
              ) : (
                <div>Hello {this.state.account}</div>
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
