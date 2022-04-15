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
  writeBatch,
} from "firebase/firestore/lite";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { config } from "../utils/config.ts";
import Seller from "./Seller";
import Buyer from "./Buyer";
import Delivery from "./Delivery";

class App extends Component {
  async UNSAFE_componentWillMount() {
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

    if (type === "delivery") {
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

  async setProductDetails(name, price, quantity, filePath, sellerName) {
    const sellersRef = collection(this.db, "sellers");
    const sellersDocRef = doc(sellersRef, this.state.account);
    const productsref = collection(sellersDocRef, "products");

    await addDoc(productsref, {
      name: name,
      price: price,
      quantity: quantity,
      timestamp: Timestamp.now(),
      image: filePath,
      sellerName: sellerName,
    });
    // console.log((await getDoc(addeddoc)).data());
  }

  // async updateProduct(productId, sellerId, quantity, count) {
  //   const sellerRef = doc(this.db, "sellers", sellerId);
  //   const productRef = doc(sellerRef, "products", productId);
  //   await updateDoc(productRef, {
  //     quantity: quantity - count,
  //   });
  // }

  async updateMultiDoc(productsPurchased) {
    debugger;
    const batch = writeBatch(this.db);
    productsPurchased.forEach((product) => {
      const sellerRef = doc(this.db, "sellers", product.sellerId);
      const productRef = doc(sellerRef, "products", product.productId);
      batch.update(productRef, {
        quantity: product.quantity - product.quantityNeeded,
      });
    });
    await batch.commit();
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

  async notifyDeliveryPerson(deliveryPersonAddress, isDelivered) {
    const deliveryRef = doc(this.db, "delivery", deliveryPersonAddress);

    await updateDoc(deliveryRef, {
      available: isDelivered,
      buyerName: isDelivered ? "" : this.state.name,
    });

    // const pastDeliveriesRef = collection(this.db, "pastDeliveries");
    // await addDoc(pastDeliveriesRef, {
    //   deliverProduct: this.state.deliverProduct,
    //   buyer: this.state.account,
    //   seller: sellerId,
    //   productId: productId,
    // });
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
    const sellersRef = collection(this.db, "sellers");
    const sellersDocRef = doc(sellersRef, this.state.account);
    const productsref = collection(sellersDocRef, "products");
    const productRef = doc(productsref, productId);
    if (filePath !== "") {
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
  async loadDeliveryDetails() {
    const deliveryRef = doc(this.db, "delivery", this.state.account);
    const deliverySnapshot = await getDoc(deliveryRef);
    this.setState({
      deliveryPerson: deliverySnapshot.data(),
    });
    const pastDeliveriesRef = collection(deliveryRef, "pastDeliveries");
    const pastDeliveriesSnapshot = await getDocs(pastDeliveriesRef);
    pastDeliveriesSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());

      this.setState({
        pastDeliveries: [...this.state.pastDeliveries, doc.data()],
      });
    });
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
        currentUserDetails.reg && (await this.loadProducts());
      } else if (currentUserDetails.userType === "0") {
        currentUserDetails.reg && (await this.loadAllProducts());
      } else {
        currentUserDetails.reg && (await this.loadDeliveryDetails());
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
      productsInCart: new Map(),
      pastDeliveries: [],
      wallet: 0,
    };
    this.registerUser = this.registerUser.bind(this);
    this.unregisterUser = this.unregisterUser.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.buyProduct = this.buyProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.addProductToCart = this.addProductToCart.bind(this);
    this.deliveredProduct = this.deliveredProduct.bind(this);
  }

  async deliveredProduct() {
    this.setState({ loading: true, loadingMsg: "Saving Delivery Details" });
    this.state.bfe.methods
      .DelvPersonAvail()
      .send({
        from: this.state.account,
      })
      .once("receipt", async (receipt) => {
        console.log("receipt", receipt);
        await this.notifyDeliveryPerson(this.state.account, true);
      });
  }

  async addProductToCart(key_, quantity) {
    let product = this.state.products[key_];
    let productId = product.productId;
    let productsInCart = { ...this.state.productsInCart };
    if (productId in productsInCart) {
      productsInCart[productId] = {
        ...product,
        quantityNeeded: quantity,
      };
    } else {
      productsInCart[productId] = { ...product, quantityNeeded: quantity };
    }

    this.setState({ productsInCart });
  }

  async updateProduct(
    productId,
    productName,
    productPrice,
    productQuantity,
    productImage
  ) {
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

  async buyProduct(isDelv) {
    const sellers = [];
    //Amount to send each sellers
    const amount = [];
    var totalPrice = 0;
    const productsInCart = Array.from(
      new Map(Object.entries(this.state.productsInCart)).values()
    );
    productsInCart.forEach((product) => {
      sellers.push(product.sellerId);
      amount.push(
        window.web3.utils.toWei(
          (product.price * product.quantityNeeded).toString(),
          "ether"
        )
      );
      totalPrice += product.price * product.quantityNeeded;
    });
    const margin = 0.5;
    totalPrice += margin;
    var deliveryPerson = this.state.account;
    var deliveryCost = 0;
    if (isDelv) {
      deliveryCost = 1;
      // Math.max(1, totalPrice * 0.05);
      totalPrice += deliveryCost;
      amount.push(window.web3.utils.toWei(deliveryCost.toString(), "ether"));
      deliveryPerson = await this.getAvailableDeliveryPerson();
      sellers.push(deliveryPerson);
      if (!deliveryPerson) {
        alert("No delivery person available");
        return;
      }
      console.log("deliveryPerson", deliveryPerson);
    }
    this.setState({ loading: true });

    this.state.bfe.methods
      .Buy(sellers, amount)
      .send({
        from: this.state.account,
        value: window.web3.utils.toWei(totalPrice.toString(), "ether"),
      })
      .once("receipt", async (receipt) => {
        // const buyMetaData = receipt["events"]["FoodItemBought"]["returnValues"];

        if (isDelv) {
          // await this.notifyDeliveryPerson(deliveryPerson, false);
        }
        this.updateMultiDoc(productsInCart);

        // await addTransactionToUser()
        this.state.products = [];
        await this.loadAllProducts();

        this.setState({ productsInCart: [], loading: false });
      });
  }

  async createProduct(name, price, quantity, file) {
    this.setState({ loading: true });

    const filePath = await this.uploadFile(file);
    await this.setProductDetails(
      name,
      price,
      quantity,
      filePath,
      this.state.name
    );
    this.state.products = [];
    await this.loadProducts();
    this.setState({ loading: false });
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
          productsInCart={this.state.productsInCart}
          buy={this.buyProduct}
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
                  name={this.state.name}
                  deliveryPerson={this.state.deliveryPerson}
                  accountDetails={this.state.account}
                  pastDeliveries={this.state.pastDeliveries}
                  deliveredProduct={this.deliveredProduct}
                ></Delivery>
              ) : (
                <Buyer
                  accountDetails={this.state.account}
                  products={this.state.products}
                  name={this.state.name}
                  buyProduct={this.buyProduct}
                  addProductToCart={this.addProductToCart}
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
