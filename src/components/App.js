import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./Navbar";
import BFE from "../abis/BFEv4.json";
import RegisterForm from "./RegisterForm";
import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where,
  updateDoc,
} from "firebase/firestore/lite";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { config } from "../utils/config.ts";
import Seller from "./Seller";
import Buyer from "./Buyer";
import Delivery from "./Delivery";

class App extends Component {
  async componentWillMount() {
    await this.loadFirebase();
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  async loadFirebase() {
    const app = initializeApp(config);
    this.db = getFirestore(app);
    this.storage = getStorage(app);
    console.log("In load firebase", this.storage);

    // await this.getSellerDetails();
  }
  async getSellerDetails() {
    const sellerDetails = collection(this.db, "sellerDetails");
    const sellerDetailsSnapshot = await getDocs(sellerDetails);
    const sellerDetailsList = sellerDetailsSnapshot.docs.map((doc) =>
      doc.data()
    );
    console.log(sellerDetailsList);
  }
  async setUserDetails(name, id, type, txHash) {
    const user = collection(this.db, "users");
    const userRef = doc(user, this.state.account);

    await setDoc(userRef, {
      name: name,
      id: id,
      account: this.state.account,
      timestamp: Timestamp.now(),
      type: type,
      txHash: txHash,
    });

    if (type == "delivery") {
      const delivery = collection(this.db, "delivery");
      const deliveryRef = doc(delivery, this.state.account);
      await setDoc(deliveryRef, {
        name: name,
        id: id,
        available: true,
      });
    }
  }

  async deleteUser() {
    const user = collection(this.db, "users");
    const userRef = doc(user, this.state.account);
    await deleteDoc(userRef);
  }

  async uploadFile(file) {
    console.log("In upload file", this.storage);
    const storageRef = ref(this.storage, "images/" + Timestamp.now());
    const uploadTask = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    return downloadURL;
  }

  async setProductDetails(
    name,
    price,
    quantity,
    id,
    txHash,
    filePath,
    gasUsed,
    sellerName
  ) {
    const sellersRef = collection(this.db, "sellers");
    const sellersDocRef = doc(sellersRef, this.state.account);
    const productsref = collection(sellersDocRef, "products");

    await addDoc(productsref, {
      name: name,
      price: price,
      quantity: quantity,
      id: id,
      timestamp: Timestamp.now(),
      txHash: txHash,
      image: filePath,
      gasUsed: gasUsed,
      sellerName: sellerName,
    });
    // console.log((await getDoc(addeddoc)).data());
    this.setState({
      products: [
        ...this.state.products,
        {
          name: name,
          price: price,
          quantity: quantity,
          id: id,
          timestamp: Timestamp.now(),
          txHash: txHash,
        },
      ],
    });
  }

  async updateProduct(productId, sellerId, quantity, count) {
    const sellerRef = doc(this.db, "sellers", sellerId);
    const productRef = doc(sellerRef, "products", productId);
    await updateDoc(productRef, {
      quantity: quantity - count,
    });
    this.state.products = [];
    this.loadAllProducts();
  }

  async getAvailableDeliveryPerson() {
    const delivery = query(
      collection(this.db, "delivery"),
      where("available", "==", true)
    );
    const deliverySnapshot = await getDocs(delivery);
    return deliverySnapshot.docs[0].id;
    // this.setState({
    //   deliveryPerson: deliverySnapshot.docs[0].data(),
    // });
  }

  async notifyDeliveryPerson(deliveryPersonAddress, productId, sellerId) {
    const deliveryRef = doc(this.db, "delivery", deliveryPersonAddress);

    await updateDoc(deliveryRef, {
      available: false,
    });

    const pastDeliveriesRef = collection(this.db, "pastDeliveries");
    await addDoc(pastDeliveriesRef, {
      deliverProduct: this.state.deliverProduct,
      buyer: this.state.account,
      seller: sellerId,
      productId: productId,
    });
  }

  async loadAllProducts() {
    const sellersRef = query(
      collection(this.db, "users"),
      where("type", "==", "seller")
    );
    // debugger;
    console.log(sellersRef);
    const sellersSnapshot = await getDocs(sellersRef);
    console.log(sellersSnapshot);
    sellersSnapshot.forEach(async (e) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(e.id, " => ", e.data());
      const productsRef = collection(doc(this.db, "sellers", e.id), "products");
      const productsSnapshot = await getDocs(productsRef);
      productsSnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        this.setState({
          products: [
            ...this.state.products,
            { ...doc.data(), sellerId: e.id, productId: doc.id },
          ],
        });
      });
    });
  }

  async updateProductDetails(
    productId,
    productName,
    productPrice,
    productQuantity,
    filePath,
    sellerName
  ) {
    debugger;
    const sellersRef = collection(this.db, "sellers");
    const sellersDocRef = doc(sellersRef, this.state.account);
    const productsref = collection(sellersDocRef, "products");
    const productRef = doc(productsref, productId);
    if (filePath != "") {
      await updateDoc(productRef, {
        name: productName,
        price: productPrice,
        quantity: productQuantity,
        image: filePath,
        sellerName: sellerName,
      });
    } else {
      await updateDoc(productRef, {
       name: productName,
        price: productPrice,
        quantity: productQuantity,
        sellerName: sellerName,
      });
    }


    this.state.products = [];
    await this.loadAllProducts();
  }

  async loadPastDeliveries() {}

  async loadProducts() {
    const productDetailsRef = collection(
      doc(collection(this.db, "sellers"), this.state.account),
      "products"
    );

    const querySnapshot = await getDocs(productDetailsRef);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      this.setState({
        products: [
          ...this.state.products,
          { ...doc.data(), productId: doc.id },
        ],
      });
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
    var wallet = await web3.eth.getBalance(this.state.account);
    wallet = web3.utils.fromWei(wallet, "ether");
    this.setState({ wallet: wallet });
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

      console.log("currentUserDetails", currentUserDetails);
      // const isUserReg = await bfe.methods.isUserReg(this.state.account).call();

      if (currentUserDetails.userType === "1") {
        currentUserDetails.reg && this.loadProducts();
      } else {
        currentUserDetails.reg && this.loadAllProducts();
      }
      this.setState({
        loading: false,
        registered: currentUserDetails.reg,
        name: currentUserDetails.reg && currentUserDetails.name,
        isSeller: currentUserDetails.userType === "1" ? true : false,
        isDelivery: currentUserDetails.userType === "2" ? true : false,
      });
    } else {
      window.alert("BFE contract not deployed to detected network.");
    }
  }

  constructor(props) {
    super(props);
    this.db = null;
    this.storage = null;

    this.state = {
      name: "",
      account: "",
      loading: true,
      loadingMsg: "Loading...",
      registered: false,
      isSeller: false,
      products: [],
      isDelivery: false,
      pastDeliveries: [],
      wallet: 0,
    };
    this.registerUser = this.registerUser.bind(this);
    this.unregisterUser = this.unregisterUser.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.buyProduct = this.buyProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
  }

  async updateProduct(
    productId,
    productName,
    productPrice,
    productQuantity,
    productImage
  ) {
    debugger;
    this.setState({ loading: true });
    var filePath = "";
    if (productImage && productImage.toString().length > 0) {
      filePath = await this.uploadFile(productImage);
    }
    await this.updateProductDetails(
      productId,
      productName,
      parseInt(productPrice),
      parseInt(productQuantity),
      filePath,
      this.state.name
    );

    this.setState({ loading: false });
  }

  async deleteProduct(productId) {
    this.setState({ loading: true });
    const sellerRef = doc(this.db, "sellers", this.state.account);
    const productRef = doc(sellerRef, "products", productId);
    await deleteDoc(productRef);
    this.state.products = [];
    this.loadProducts();
    this.setState({ loading: false });
  }

  async buyProduct(
    blockId,
    productId,
    quantity,
    sellerId,
    count,
    price,
    isDelivery
  ) {
    var totalPrice = count.toNumber() * parseInt(price);
    const margin = 0.05;
    totalPrice += margin;
    var deliveryPerson = this.state.account;
    var deliveryCost = 0;
    if (isDelivery) {
      deliveryCost = Math.max(1, totalPrice * 0.05);
      totalPrice += deliveryCost;
      deliveryPerson = await this.getAvailableDeliveryPerson();
      if (!deliveryPerson) {
        alert("No delivery person available");
        return;
      }
      console.log("deliveryPerson", deliveryPerson);
    }

    this.setState({ loading: true });

    this.state.bfe.methods
      .Buy(
        blockId,
        count,
        isDelivery,
        window.web3.utils.toWei(deliveryCost.toString(), "ether"),
        deliveryPerson
      )
      .send({
        from: this.state.account,
        value: window.web3.utils.toWei(totalPrice.toString(), "ether"),
      })
      .once("receipt", async (receipt) => {
        const buyMetaData = receipt["events"]["FoodItemBought"]["returnValues"];
        console.log("buyMetaData", buyMetaData);

        if (isDelivery) {
          await this.notifyDeliveryPerson(deliveryPerson, productId, sellerId);
        }
        await this.updateProduct(
          productId,
          sellerId,
          quantity.toNumber(),
          count.toNumber()
        );

        this.setState({ loading: false });
      });
  }

  async createProduct(name, price, quantity, file) {
    this.setState({ loading: true });

    this.state.bfe.methods
      .FoodItemReg(name, price, quantity)
      .send({ from: this.state.account })
      .once("receipt", async (receipt) => {
        debugger;
        var productMetaData =
          receipt["events"]["FoodItemAdded"]["returnValues"];
        const gasUsed = receipt["gasUsed"];
        console.log("productMetaData", productMetaData);
        const price = window.web3.utils.fromWei(productMetaData.price, "ether");
        const filePath = await this.uploadFile(file);
        await this.setProductDetails(
          name,
          price,
          quantity.toNumber(),
          productMetaData.fid,
          receipt.transactionHash,
          filePath,
          gasUsed,
          this.state.name
        );

        this.setState({ loading: false });
      });
  }

  unregisterUser() {
    this.setState({ loading: true });
    this.state.bfe.methods
      .UserUnreg()
      .send({ from: this.state.account })
      .once("receipt", async (receipt) => {
        var userMetaData =
          receipt["events"]["UserUnregistered"]["returnValues"];
        await this.deleteUser();
        this.setState({ loading: false, registered: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  registerUser(name, userType) {
    this.setState({ loading: true });

    var userTypeValue = window.web3.utils.toBN(
      userType === "seller" ? "1" : userType === "delivery" ? "2" : "0"
    );

    this.state.bfe.methods
      .UserReg(name, userTypeValue)
      .send({ from: this.state.account })
      .once("receipt", async (receipt) => {
        console.log(receipt);
        var userMetaData = receipt["events"]["UserRegistered"]["returnValues"];
        await this.setUserDetails(
          name,
          userMetaData.bid,
          userType,
          receipt.transactionHash
        );

        this.setState({
          loading: false,
          name: name,
          registered: true,
          isSeller: userType === "seller" ? true : false,
          isDelivery: userType === "delivery" ? true : false,
        });
      });
  }

  render() {
    return (
      <div>
        <Navbar
          account={this.state.account}
          wallet={this.state.wallet}
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
              ) : this.state.isSeller ? (
                <Seller
                  accountDetails={this.state.account}
                  products={this.state.products}
                  name={this.state.name}
                  createProduct={this.createProduct}
                  deleteProduct={this.deleteProduct}
                  updateProduct={this.updateProduct}
                >
                  {" "}
                </Seller>
              ) : this.state.isDelivery ? (
                <Delivery
                  delivery={this.state.delivery}
                  name={this.state.name}
                  accountDetails={this.state.account}
                  pastDeliveries={this.state.pastDeliveries}
                ></Delivery>
              ) : (
                <Buyer
                  accountDetails={this.state.account}
                  products={this.state.products}
                  name={this.state.name}
                  buyProduct={this.buyProduct}
                ></Buyer>
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
  x;
}

export default App;
