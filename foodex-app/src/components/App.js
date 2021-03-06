import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./Navbar";
import BFE from "../abis/BFEv4.json";
import SWAD from "../abis/ERC20MYN.json";
import RegisterForm from "./RegisterForm";
import { initializeApp } from "firebase/app";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import RegisterAppBar from "./AppBar/RegisterAppBar";
import BuyerAppBar from "./AppBar/BuyerAppBar";
import SellerAppBar from "./AppBar/SellerAppBar";
import DeliveryAppBar from "./AppBar/DeliveryAppBar";

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
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

var contract = null;
class App extends Component {
  async UNSAFE_componentWillMount() {
    await this.loadFirebase();
    await this.loadWeb3();
    await this.loadBlockchainData();
    window.ethereum.on("accountsChanged", async (accounts) => {
      if (accounts && accounts !== this.state.accounts) {
        await this.loadBlockchainData();
      }
    });
  }
  async loadFirebase() {
    const app = initializeApp(config);
    this.db = getFirestore(app);
    this.storage = getStorage(app);
    // console.log("In load firebase", this.storage);

    // await this.getSellerDetails();
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

  async getSwadBalance(bfe, address) {
    const web3 = window.web3;
    return web3.utils.fromWei(
      await bfe.methods.SwdBalance().call({ from: address }),
      "ether"
    );
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    // this.setState({ account: accounts[0] });
    var wallet = await web3.eth.getBalance(accounts[0]);
    wallet = web3.utils.fromWei(wallet, "ether");
    // this.setState({ wallet: wallet });
    const networkId = await web3.eth.net.getId();

    const bfeNetworkData = BFE.networks[networkId];
    const bfeContractAddress = BFE.networks[networkId].address;
    const swadContractAddress = SWAD.networks[networkId].address;

    if (bfeNetworkData) {
      //TODO: Check if the account is registered
      //TODO: If registered as a seller fetch the products
      //TODO: If registered as a buyer fetch all the products
      const bfe = new web3.eth.Contract(BFE.abi, bfeContractAddress);
      const swad = new web3.eth.Contract(SWAD.abi, swadContractAddress);
      //TODO: Delete the below line
      contract = swad;
      console.log("Buffalo Food Exchange", contract, bfeContractAddress);
      console.log("Swad ", swad, swadContractAddress);
      console.log(
        "Contract balance ",
        await this.getSwadBalance(bfe, bfeContractAddress)
      );
      // debugger;
      this.setState({
        bfe,
        swad,
        bfeContractAddress,
        swadContractAddress,
        openAlert: false,
        message: undefined,
        messageInfo: undefined,
        name: "",
        currentOrder: undefined,
        account: accounts[0],
        loading: true,
        loadingText: "Loading...",
        registered: false,
        isSeller: false,
        products: [],
        isTakeout: false,
        isDelivery: false,
        productsInCart: new Map(),
        pastDeliveries: [],
        pastOrders: [],
        wallet: wallet,
        isOrdered: false,
        tokens: 0,
      });

      const currentUserDetails = await bfe.methods
        .users(this.state.account)
        .call();

      // console.log("currentUserDetails", currentUserDetails);
      // const isUserReg = await bfe.methods.isUserReg(this.state.account).call();

      if (currentUserDetails.userType === "1" && currentUserDetails.reg) {
        await this.loadProducts();
      } else if (
        currentUserDetails.userType === "0" &&
        currentUserDetails.reg
      ) {
        await this.loadAllProducts();
        await this.loadBuyerPastOrders();
        await this.loadCurrentOrder();
      } else if (
        currentUserDetails.userType === "2" &&
        currentUserDetails.reg
      ) {
        await this.loadDeliveryPersonDetails();
      }
      await this.loadAccountBalance();
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

  async getSellerDetails() {
    const sellerDetails = collection(this.db, "sellerDetails");
    const sellerDetailsSnapshot = await getDocs(sellerDetails);
    const sellerDetailsList = sellerDetailsSnapshot.docs.map((doc) =>
      doc.data()
    );
    // console.log(sellerDetailsList);
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
    // console.log("In upload file", this.storage);
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

  async notifyDeliveryPerson(deliveryPersonAddress, productIds, isDelivered) {
    const deliveryRef = doc(this.db, "delivery", deliveryPersonAddress);
    if (!isDelivered) {
      await updateDoc(deliveryRef, {
        available: isDelivered,
        buyerName: isDelivered ? "" : this.state.name,
        timeAssigned: Timestamp.now(),
        listOfProduct: productIds,
      });
    } else {
      await updateDoc(deliveryRef, {
        available: isDelivered,
      });
      const pastDeliveriesRef = collection(deliveryRef, "pastDeliveries");
      await addDoc(pastDeliveriesRef, {
        buyerName: this.state.name,
        timeAssigned: this.state.currentOrder.timeOrdered,
        timeDelivered: Timestamp.now(),
        listOfProduct: productIds,
      });
    }
  }

  async loadAllProducts() {
    const sellersRef = query(
      collection(this.db, "users"),
      where("type", "==", "seller")
    );
    // debugger;
    // console.log(sellersRef);
    const sellersSnapshot = await getDocs(sellersRef);
    // console.log(sellersSnapshot);
    sellersSnapshot.forEach(async (e) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(e.id, " => ", e.data());
      const productsRef = collection(doc(this.db, "sellers", e.id), "products");
      const productsSnapshot = await getDocs(productsRef);
      productsSnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
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
    await this.loadProducts();
  }

  async loadPastDeliveries() {
    const deliveryRef = doc(this.db, "delivery", this.state.account);
    const pastDeliveriesRef = collection(deliveryRef, "pastDeliveries");
    const pastDeliveriesSnapshot = await getDocs(pastDeliveriesRef);
    pastDeliveriesSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      this.setState({
        pastDeliveries: [
          ...this.state.pastDeliveries,
          { ...doc.data(), deliveryId: doc.id },
        ],
      });
    });
  }

  async loadAccountBalance() {
    const web3 = window.web3;

    const balanceInWei = await this.state.bfe.methods
      .SwdBalance()
      .call({ from: this.state.account });

    // console.log("Swad Balance", web3.utils.fromWei(balanceInWei, "ether"));
    this.setState({ tokens: web3.utils.fromWei(balanceInWei, "ether") });
  }

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

  async loadDeliveryPersonDetails() {
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
        pastDeliveries: [
          ...this.state.pastDeliveries,
          { ...doc.data(), deliveryId: doc.id },
        ],
      });
    });
  }

  async loadCurrentOrder() {
    const buyerRef = doc(this.db, "buyers", this.state.account);
    const buyerSnapshot = await getDoc(buyerRef);
    if (
      buyerSnapshot.exists &&
      buyerSnapshot.data() &&
      "status" in buyerSnapshot.data() &&
      buyerSnapshot.data().status === "pending"
    ) {
      this.setState({
        currentOrder: buyerSnapshot.data(),
      });
    } else {
      // console.log("No Current Order");
    }
  }

  async loadBuyerPastOrders() {
    const buyerRef = doc(this.db, "buyers", this.state.account);
    const pastOrdersRef = collection(buyerRef, "pastOrders");
    const pastOrdersSnapshot = await getDocs(pastOrdersRef);
    pastOrdersSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      this.setState({
        pastOrders: [
          ...this.state.pastOrders,
          { ...doc.data(), orderId: doc.id },
        ],
      });
    });
  }

  async orderReceived() {
    const buyerRef = doc(this.db, "buyers", this.state.account);
    await updateDoc(buyerRef, {
      status: "completed",
    });
    const orderDetails = await getDoc(buyerRef);

    const pastOrdersRef = collection(buyerRef, "pastOrders");
    await addDoc(pastOrdersRef, {
      ...orderDetails.data(),
      timeReceived: Timestamp.now(),
    });
    this.setState({
      currentOrder: {},
    });
  }

  handleAlertOpen(messageInfo, message) {
    this.setState({ messageInfo, message, openAlert: true });
  }

  handleAlertClose() {
    this.setState({
      messageInfo: undefined,
      message: this.undefined,
      openAlert: false,
    });
  }
  async saveOrderToFirestore(
    sellers,
    amounts,
    productIds,
    totalPrice,
    deliveryPersonAssigned,
    sellersAmount,
    isDelivery
  ) {
    const buyerRef = doc(this.db, "buyers", this.state.account);
    const docRef = await setDoc(buyerRef, {
      sellers: sellers,
      amounts: amounts,
      products: productIds,
      totalPrice: totalPrice,
      deliveryPersonAssigned: deliveryPersonAssigned,
      sellersAmount: sellersAmount,
      status: "pending",
      timeOrdered: Timestamp.now(),
      isDelivery: isDelivery,
    });
    return "1";
  }

  constructor(props) {
    super(props);
    this.db = null;
    this.storage = null;

    this.state = {
      openAlert: false,
      message: undefined,
      messageInfo: undefined,
      name: "",
      account: "",
      loading: true,
      loadingText: "Loading...",
      registered: false,
      isSeller: false,
      products: [],
      isTakeout: false,
      isDelivery: false,
      productsInCart: new Map(),
      pastDeliveries: [],
      pastOrders: [],
      wallet: 0,
      isOrdered: false,
    };
    this.registerUser = this.registerUser.bind(this);
    this.unregisterUser = this.unregisterUser.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.settlePayment = this.settlePayment.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.addProductToCart = this.addProductToCart.bind(this);
    this.deleteProductFromCart = this.deleteProductFromCart.bind(this);
    this.deliveredProduct = this.deliveredProduct.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleAlertOpen = this.handleAlertOpen.bind(this);
    this.toggleTakeout = this.toggleTakeout.bind(this);
    this.orderProduct = this.orderProduct.bind(this);
    this.handleOrderModalStatus = this.handleOrderModalStatus.bind(this);
  }

  deleteProductFromCart(productId) {
    const productsInCart = { ...this.state.productsInCart };
    delete productsInCart[productId];
    this.setState({
      productsInCart,
    });
  }

  handleOrderModalStatus(status) {
    this.setState({
      isOrdered: status,
    });
  }

  toggleTakeout() {
    this.setState({ isTakeout: !this.state.isTakeout });
  }

  async deliveredProduct() {
    this.setState({ loading: true, loadingText: "Saving Delivery Details" });
    this.state.bfe.methods
      .DelvPersonAvail()
      .send({
        from: this.state.account,
      })
      .once("receipt", async (receipt) => {
        // console.log("receipt", receipt);
        await this.notifyDeliveryPerson(
          this.state.account,
          this.state.deliveryPerson.listOfProduct,
          true
        );
        this.state.pastDeliveries = [];
        await this.loadPastDeliveries();
        this.setState({ loading: false });
      })
      .catch((err) => {
        // console.log(err);
        this.handleAlertOpen("error", err.message);
        this.setState({ loading: false });
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
    this.handleAlertOpen("success", "Product Updated Successfully");

    this.setState({ loading: false });
  }

  async deleteProduct(productId) {
    this.setState({ loading: true });
    const sellerRef = doc(this.db, "sellers", this.state.account);
    const productRef = doc(sellerRef, "products", productId);
    await deleteDoc(productRef);
    this.state.products = [];
    this.loadProducts();
    this.handleAlertOpen("success", "Product Deleted Successfully");

    this.setState({ loading: false });
  }

  async orderProduct(isDelv) {
    if (
      "currentOrder" in this.state &&
      this.state.currentOrder &&
      "status" in this.state.currentOrder
    ) {
      this.handleAlertOpen("error", "You have an order in progress");
      return;
    }
    const sellersAmount = [];
    const sellers = [];
    const amounts = [];
    const productId = [];
    var totalPrice = 0;

    const productsInCart = Array.from(
      new Map(Object.entries(this.state.productsInCart)).values()
    );
    const web3 = window.web3;
    productsInCart.forEach((product) => {
      let seller = product.sellerId;
      // let amount = web3.utils.toWei(
      //   (product.price * product.quantityNeeded).toString(),
      //   "ether"
      // );
      // let amount = web3.utils.toBN(
      //   product.price * product.quantityNeeded * 10 ** 18
      // );
      let amount = product.price * product.quantityNeeded;
      let encodeAmount = web3.eth.abi.encodeParameter("uint256", amount);
      let stripEncodeAmount = web3.utils.stripHexPrefix(encodeAmount);
      let sellerAmount =
        seller.toString().toLowerCase() + stripEncodeAmount.substring(40);
      sellers.push(seller);
      amounts.push(amount);
      sellersAmount.push(sellerAmount);
      productId.push(product.productId);

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

      try {
        deliveryPerson = await this.getAvailableDeliveryPerson();
      } catch (error) {
        this.handleAlertOpen("error", "Delivery Person not available");
        return;
      }
      // let amount = web3.utils.toWei(deliveryCost.toString(), "ether");
      let amount = deliveryCost;
      amounts.push(amount);
      let encodeAmount = web3.eth.abi.encodeParameter("uint256", amount);
      let stripEncodeAmount = web3.utils.stripHexPrefix(encodeAmount);
      let sellerAmount =
        deliveryPerson.toString().toLowerCase() +
        stripEncodeAmount.substring(40);

      sellersAmount.push(sellerAmount);
      if (!deliveryPerson) {
        alert("No delivery person available");
        return;
      }
      // console.log("deliveryPerson", deliveryPerson);
    }
    debugger;
    this.setState({ loading: true });
    let orderId = await this.saveOrderToFirestore(
      sellers,
      amounts,
      productId,
      totalPrice,
      deliveryPerson,
      sellersAmount,
      isDelv
    );
    debugger;
    this.state.bfe.methods
      .Order(web3.utils.toBN(orderId), web3.utils.toBN(totalPrice * 10 ** 18))
      .send({
        from: this.state.account,
        // value: window.web3.utils.toWei(totalPrice.toString(), "ether"),
      })
      .once("receipt", async (receipt) => {
        // const buyMetaData = receipt["events"]["FoodItemBought"]["returnValues"];

        if (isDelv) {
          await this.notifyDeliveryPerson(deliveryPerson, productId, false);
        }
        await this.updateMultiDoc(productsInCart);

        // await addTransactionToUser()
        this.state.products = [];
        await this.loadAllProducts();
        await this.loadCurrentOrder();
        await this.loadAccountBalance();
        this.handleAlertOpen("success", "Order Placed Successfuly");

        this.setState({ productsInCart: [], loading: false, isOrdered: true });
      })
      .catch((err) => {
        // console.log(err);
        this.handleAlertOpen("error", err.message);
        this.setState({ loading: false });
      });
  }

  async settlePayment() {
    debugger;
    const web3 = window.web3;

    this.setState({ loading: true, loadingmsg: "Settling Payment..." });
    const isDelv = this.state.currentOrder.isDelivery;
    const amounts = this.state.currentOrder.amounts.map((amount) => {
      return web3.utils.toBN(amount * 10 ** 18);
    });
    console.log(this.state.currentOrder);
    let address = [];
    address.push(this.state.currentOrder.sellers[0]);

    if (isDelv) {
      address.push(this.state.currentOrder.deliveryPersonAssigned);
    }
    let sellerAmountInBytes = [];
    for (let i = 0; i < address.length; i++) {
      let encodeAmount = web3.eth.abi.encodeParameter("uint256", amounts[i]);
      let stripEncodeAmount = web3.utils.stripHexPrefix(encodeAmount);
      let sellerAmount =
        address[i].toString().toLowerCase() + stripEncodeAmount.substring(40);
      sellerAmountInBytes.push(sellerAmount);
    }
    debugger;
    this.state.bfe.methods
      .SettlePayment(sellerAmountInBytes)
      .send({
        from: this.state.account,
        // value: window.web3.utils.toWei(
        //   this.state.currentOrder.totalPrice.toString(),
        //   "ether"
        // ),
        // gas: 2100000,
        // gasPrice: 8000000000,
      })
      .once("receipt", async (receipt) => {
        // const buyMetaData = receipt["events"]["FoodItemBought"]["returnValues"];

        // if (isDelv) {
        //   await this.notifyDeliveryPerson(deliveryPerson, productId, false);
        // }

        // await addTransactionToUser()
        if (isDelv) {
          await this.notifyDeliveryPerson(
            this.state.currentOrder.deliveryPersonAssigned,
            this.state.currentOrder.products,
            true
          );
        }
        await this.orderReceived();
        this.state.products = [];
        this.state.pastOrders = [];
        await this.loadAllProducts();
        await this.loadBuyerPastOrders();
        this.handleAlertOpen("success", "Payment Settled Successfully");
        this.setState({ productsInCart: [], loading: false, isOrdered: false });
      })
      .catch((err) => {
        // console.log(err);
        this.handleAlertOpen("error", err.message);
        this.setState({ loading: false });
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
    this.handleAlertOpen("success", "Product Added Successfully");

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
        this.handleAlertOpen("success", "User Unregistered Succcessfully");

        this.setState({ loading: false, registered: false });
      })
      .catch((err) => {
        // console.log(err);
        this.handleAlertOpen("error", err.message);
        this.setState({ loading: false });
      });
  }

  registerUser(name, userType) {
    // debugger;
    const web3 = window.web3;
    this.setState({ loading: true, loadingText: " Registering User..." });

    var userTypeValue = window.web3.utils.toBN(
      userType === "seller" ? "1" : userType === "delivery" ? "2" : "0"
    );
    debugger;
    this.state.bfe.methods
      .UserReg(name, userTypeValue)
      .send({ from: this.state.account })
      .once("receipt", async (receipt) => {
        // console.log(receipt);

        var userMetaData = receipt["events"]["UserRegistered"]["returnValues"];
        this.state.swad.methods
          .approve(
            this.state.bfeContractAddress,
            web3.utils.toWei("100000", "ether")
          )
          .send({
            from: this.state.account,
          })
          .once("receipt", async (receipt) => {
            await this.setUserDetails(
              name,
              userMetaData.bid,
              userType,
              receipt.transactionHash
            );
            if (userType === "seller") {
              await this.loadProducts();
            } else if (userType === "delivery") {
              await this.loadPastDeliveries();
            } else {
              await this.loadAllProducts();
            }
            await this.loadAccountBalance();
            this.handleAlertOpen("success", "User Registered Succcessfully");

            this.setState({
              loading: false,
              loadingText: "",
              name: name,
              registered: true,
              isSeller: userType === "seller" ? true : false,
              isDelivery: userType === "delivery" ? true : false,
            });
          })
          .catch((err) => {
            // console.log(err);
            this.handleAlertOpen("error", err.message);
            this.setState({ loading: false });
          });
      })
      .catch((err) => {
        // console.log(err);
        this.handleAlertOpen("error", err.message);
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <div>
        {!this.state.registered ? (
          <RegisterAppBar></RegisterAppBar>
        ) : this.state.isSeller ? (
          <SellerAppBar
            account={this.state.account}
            wallet={this.state.wallet}
            swad={this.state.tokens}
            isreg={this.state.registered}
            unregister={this.unregisterUser}
            productsInCart={this.state.productsInCart}
            buy={this.buyProduct}
            isTakeout={this.state.isTakeout}
          ></SellerAppBar>
        ) : this.state.isDelivery ? (
          <DeliveryAppBar
            account={this.state.account}
            wallet={this.state.wallet}
            swad={this.state.tokens}
            isreg={this.state.registered}
            unregister={this.unregisterUser}
            productsInCart={this.state.productsInCart}
            buy={this.buyProduct}
            isTakeout={this.state.isTakeout}
          ></DeliveryAppBar>
        ) : (
          <BuyerAppBar
            account={this.state.account}
            wallet={this.state.wallet}
            swad={this.state.tokens}
            isreg={this.state.registered}
            unregister={this.unregisterUser}
            productsInCart={this.state.productsInCart}
            orderProduct={this.orderProduct}
            settlePayment={this.settlePayment}
            currentOrder={this.state.currentOrder}
            pastOrders={this.state.pastOrders}
            isTakeout={this.state.isTakeout}
            isOrdered={this.state.isOrdered}
            handleOrderModalStatus={this.handleOrderModalStatus}
            deleteProductFromCart={this.deleteProductFromCart}
          ></BuyerAppBar>
        )}

        {/* <Navbar
          account={this.state.account}
          wallet={this.state.wallet}
          isreg={this.state.registered}
          logout={this.unregisterUser}
          productsInCart={this.state.productsInCart}
          buy={this.buyProduct}
          isTakeout={this.state.isTakeout}
        /> */}
        <div>
          {!this.state.registered ? (
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
              isTakeout={this.state.isTakeout}
              toggleTakeout={this.toggleTakeout}
            ></Buyer>
          )}
        </div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.loading}
          // onClick={handleClose}
        >
          <CircularProgress color="inherit" /> {this.state.loadingText}
        </Backdrop>
        <Snackbar
          open={this.state.openAlert}
          autoHideDuration={3000}
          onClose={this.handleAlertClose}
        >
          <Alert
            onClose={this.handleAlertClose}
            severity={this.state.messageInfo}
            sx={{ width: "100%" }}
          >
            {this.state.message}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default App;
