<!-- Output copied to clipboard! -->

<!-----

You have some errors, warnings, or alerts. If you are using reckless mode, turn it off to see inline alerts.
* ERRORs: 0
* WARNINGs: 0
* ALERTS: 20

Conversion time: 1.952 seconds.


Using this Markdown file:

1. Paste this output into your source file.
2. See the notes and action items below regarding this conversion run.
3. Check the rendered output (headings, lists, code blocks, tables) for proper
   formatting and use a linkchecker before you publish this page.

Conversion notes:

* Docs to Markdown version 1.0β33
* Tue Apr 19 2022 21:14:11 GMT-0700 (PDT)
* Source doc: 50366308_50425045_phase2
* Tables are currently converted to HTML tables.
* This document has images: check for >>>>>  gd2md-html alert:  inline image link in generated source and store images to your server. NOTE: Images in exported zip file from Google Docs may not appear in  the same order as they do in your doc. Please check the images!

----->



# Buffalo Food Exchange

ISSUE(S) ADDRESSED:


Firstly, It can be challenging for students living away from home to maintain a healthy lifestyle for a variety of reasons, including



* Lack of cooking skills.
* Food insecurity due to rising food costs.
* Time crunch due to academic performance pressure.
* Cultural Food Shock:
* Seeing food on the menu which you never anticipated eating.

These issues can occasionally lead to malnourishment, which can contribute to stress in daily life.


Secondly, We aim to rectify the below-mentioned shortcomings of the traditional marketplace(MP):


<table>
  <tr>
   <td>
<strong>Traditional Food MP</strong>
   </td>
   <td><strong>Decentralized Food MP</strong>
   </td>
  </tr>
  <tr>
   <td>Middlemen or any intermediaries.
   </td>
   <td>No Middleman
   </td>
  </tr>
  <tr>
   <td>Service fees that eventually add up to the total bill.
   </td>
   <td>No hidden service charge or a minimal service charge is required.
   </td>
  </tr>
  <tr>
   <td>The user ends up paying more than anticipated.
   </td>
   <td>Hence, Total fees are less.
   </td>
  </tr>
  <tr>
   <td>Lack of Secure Payment Options.
   </td>
   <td>Secure and Reliable payment by SC.
   </td>
  </tr>
  <tr>
   <td>Reviews are handled by single authority
   </td>
   <td>Reviews are immutable and stored in blockchain
   </td>
  </tr>
</table>



Most importantly our application is planned to cater to the sellers that are not only restaurants, aiming to target online customers, but it may also be a local food vendor that cares to offer healthy and tasty platters.


## 
ABSTRACT:


Our goal is to develop a peer-to-peer online decentralized food marketplace that allows for the purchase and sales of meals that can be homemade cuisine such as Italian, Indian, Chinese, Mexican, etc.


As the food market has grown tremendously in recent years, whether owing to the ease of purchasing from a mobile device or due to travel limitations in the event of a pandemic, revenues from the food marketplace are expected to expand manyfold.


Our goal is to use blockchain, which has the potential to significantly enhance the traditional food marketplace. Some benefits are illustrated below:



* Customized features for sellers and customers.
* Getting rid of centralized authority and trust issues.
* Robust security checking and verification.
* Transactions between partners/vendors and customers are seamless using SC, etc.

Thus, we plan to create a decentralized food marketplace that will be deployed as a Dapp on mobile/web utilizing a self-executing smart contract that will provide:

* Transparents rules of the marketplace.
* Improve Reliability of daily transactions.
* Fast and secure payment via a digital Crypto wallet.
* Lastly, Execute peer-to-peer transactions without the use of a middleman.

## 
DECENTRALIZED FOOD DELIVERY:


Our marketplace is a decentralized blockchain-based Food delivery system called Buffalo Food Exchange or BFE for short. We have created a platform where Customers, Restaurants, and Delivery Partners can register and operate independently and with great ease. We have merged the traditional restaurant and delivery person operations with the blockchain environment to counter the issues presented by the centralized food delivery system.


We started our journey with a platform that just registers 2 users: the buyer and the seller. In the beginning, the buyer could only buy one item from a particular seller at a time. We then added another user: the delivery person. First, it was all delivery, then we also added a system for take-aways. Later we made the system to let the customer buy multiple dishes from a single user. This was soon transformed into buyers able to buy multiple dishes from various restaurants. The detailed explanation of our finalized platform is mentioned below.


In our marketplace, there are three types of Users: Buyer, Seller, and Delivery person. If the user is new to the platform, the marketplace prompts the user to register first. Once registered, the users are automatically logged into their respective accounts from then onwards. After the registration is completed, each user can view a separate and personalized page based on their user type. For example, if the user is a Restaurant or seller, in this case, the menu management page is shown, where the user can add a new menu or edit the already existing ones, and view and manage the inventory as well. Similarly, if the user is a buyer, the food ordering page is displayed where the user can add food items to the cart, view and update the cart, and make the payment. If the user is a delivery partner, a page with current and past delivery is displayed and the user can make itself available after delivery.


This marketplace combines various on-chain and off-chain functionalities to provide a seamless experience to the users. The user registration is performed on-chain because we want to thoroughly verify the users and make sure each user just has one identity. The food registration and updating done by the seller are performed off-chain because we don’t want lots of data on the blockchain as it will increase the gas fees for the transactions. The food is ordered and the payment transaction for the same is done on-chain. We are just storing the hash value of each order on the blockchain. When the order is placed, the total order amount is deducted from the user's account and is stored in the smart contract balance. The customer also has the option to ask for delivery or take-away. By default, the delivery option is chosen. The system checks if the restaurant has sufficient items in the inventory and the order is placed after this check. The restaurant prepares the order. If delivery is selected, the order is collected by a random delivery person who is available and delivered to the user. By available here it means that the delivery person is not on an existing delivery. Once the delivery is done, the delivery person can mark the delivery complete and is again made available for further deliveries. If the buyer selects take-away, the buyer can go and collect the order directly from the restaurant.


**_THE MAIN ADVANTAGE AND UNIQUE ATTRIBUTE OF OUR MARKETPLACE IS THE BUYER’S ABILITY TO ORDER FROM MULTIPLE SELLERS WITHOUT ANY CONSTRAINT WHICH IS NOT POSSIBLE IN THE CENTRALIZED SYSTEM._** Once the order is received by the customer, the payment is settled towards the various service providers. Based on the order, the respective sellers and delivery person (if delivery is opted) are paid for the corresponding food and service provided by them. The delivery person gets the 5% of the total order or 1 Ethereum whichever is bigger. A minimal cut of 0.05 Eth is also taken from the user to use the platform to order food each time.


The one point that we feel our platform is missing right now is the ability to store the buyer’s address for delivery purposes. This can be handled with ease and we are planning to add it for the Phase 3 of the project.


## 
DEPLOYMENT, TESTING, AND INTERACTION


TRUFFLE


We have used the truffle suite as our development environment to install migrate and access smart contracts that use the embedded Ethereum Virtual Machine (EVM) engine to assist with controlling the visibility and accessibility of the Smart Contract artifacts and linking with Decentralized applications.[ [https://trufflesuite.com/truffle/](https://trufflesuite.com/truffle/)]


GANACHE


We have used ganache as our development blockchain to manage how the blockchain functions, run tests, perform commands, and observe the state. [[https://trufflesuite.com/ganache/](https://trufflesuite.com/ganache/)]


<span style="text-decoration:underline;">Smart Contract Network Deployment and DB Stack:</span>



![alt_text](images/image1.png "image_tooltip")



DEPLOYMENT:


Make sure before setting up configure Metamask and get the ropsten-api key from INFURA



![alt_text](images/image2.png "image_tooltip")



**1. Setup Truffle: **


```
$ npm install -g truffle
```



In the empty folder, initialize truffle, this will generate boilerplate code ready to use for initial deployment and Testing.


```
$ truffle init
```



Install HDWalletProvider


	


```
$ npm install --save truffle-hdwallet-provider
```



Install Solidity Extension on Vscode and select solidity compiler remote version to 0.8.13


	
![alt_text](images/image3.png "image_tooltip")



		
![alt_text](images/image4.png "image_tooltip")



**2.Create your contract:**


Here, I have displayed code snippet of our smart contract,


```
function UserReg(string memory name, Type userType) public validUserType(userType){
       require(bytes(name).length > 0, "Name cannot be empty");
       uid ++;
       users[msg.sender] = User(uid, name, userType, true);
       emit UserRegistered(uid, name, userType);
   }
```



```
function Order(uint hashOfOrder) public payable onlyBuyer{
       balance = address(this).balance;
       emit FoodBought(msg.sender, hashOfOrder);
   }
```



**3.Deploy your contract:**


In ./migrations, create a deployment script specifically named 2_deploy_contracts.js with the following code:


```
const BFEv4 = artifacts.require("BFEv4");

module.exports = function(deployer) {
 deployer.deploy(BFEv4);
};
```



## 
**4.Configure Ropsten network and the provider:**


```
var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'YOUR WALLET MNEMONIC';
```



```
networks: {
   development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*", // Match any network id
   },
   ropsten: {
     provider: function () {
       return new HDWalletProvider(
         MNEMONIC,
         "https://ropsten.infura.io/v3/d51b8ae11bb34cdf9ecc3fc4b65cea07"
       );
     },
     network_id: 3,
     gas: 4000000, //make sure this gas allocation isn't over 4M, which is the max
   },
   contracts_build_directory: "../foodex-app/src/abis/",
 },
```



Upon mentioning  **_contracts_build_directory_** we can control the path where abis for our smart contract is generated and stored.


**5.Configure Ganache, local test blockchain at localhost:[PORT]**


Link truffle project to the Ganache local blockchain:**	**



![alt_text](images/image5.png "image_tooltip")



**6.Deploy / Migrate contract:**


To compile and deploy the contract on the local Ganache, perform the following steps.


```
$ truffle compile
```



```
$ truffle deploy --reset or truffle migrate --reset
```



```
2_deploy_contracts.js
=====================

   Replacing 'BFEv4'
   -----------------
   > transaction hash:    0x18c623b2f5e312b9f1fd837639e6ed503bf1e29d8455d3a834f197dd7339a93f
   > Blocks: 0            Seconds: 0
   > contract address:    0x9E079C7822142D3C1999fa74b302ed9A5759c81D
   > block number:        3
   > block timestamp:     1650228734
   > account:             0x816c40F4E615569372c02ED34B233e0aa4e373e9
   > balance:             99.97518638
   > gas used:            996541 (0xf34bd)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01993082 ETH

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.01993082 ETH

Summary
=======
> Total deployments:   2
> Final cost:          0.02396336 ETH
```



```
$ truffle deploy --network ropsten
```



## 
Now our smart contract has been deployed on ganache which helps us access Events, Transaction and Local variables (if specified as public) and even displays the balance of smart contract deployed on Ganache.


**7.Deploy / Migrate React-Webpage:**


In **_foodex-app/_**  run the following commands to deploy and start the web app.


```
$ npm install
```



```
$ npm  start
```



## 
DEPLOYING DECENTRALIZED FOODEX ON ROPSTEN:


Foodex-contract deployed on Ropsten etherscan: [https://ropsten.etherscan.io/address/0x53aa805163460e7789db87cef8006568b6fcb979](https://ropsten.etherscan.io/address/0x53aa805163460e7789db87cef8006568b6fcb979)


Foodex-App Deployed on Ropsten:


[https://foodex-dapp.netlify.app/](https://foodex-dapp.netlify.app/)



![alt_text](images/image6.png "image_tooltip")



TESTING:


After deploying the smart contract we can access its instance through the abis to test the working of our contract’s artifacts:


Save _[contract_name]_.test.js file to _[TRUFFLE_SUIT]_/test/ and test the functionality of the deployed contract by using _chai-assertion _as:


Code snippet of the text file:


```
const BFEv4 = artifacts.require('./BFEv4.sol')
require('chai')
 .use(require('chai-as-promised'))
 .should()
contract('BFEv4', (accounts) => {
 let bfe
 before(async () => {
   bfe = await BFEv4.deployed()
   userRegister = await bfe.UserReg('atul singh',{from: user}) //Here we are accessing methods exposed by abis
 })
```



We can use below command to run all the test in  [TRUFFLE_SUIT]/test/ file and check the sanity of our decentralized application.


```
$ truffle test
```



```
userRegister = await bfe.UserReg('atul singh',{from: user})
```



## 
INTERACTION:


We’ve used the web3 library to allow our client-facing Decentralized application to access the metamask wallet, which short-circuits the process of getting user credentials such as private key and account that allow seamless transfers of cryptocurreny via metamask.


First import the_ abis.json_ in our Client app as below:


```
import BFE from "../abis/BFEv4.json";
```



Then, using web3 access the abi:


```
const bfe = await web3.eth.contract(BFE.abi, contractAddress)
```



Below, are snippets of how we are interacting with the abis and send instruction to Ganache local network through RPC network call and access the methods by calling contract artifacts.


For example, here we are trying to access method users which let us know whether the current (address) user is register or not since this function in Smart contract doent change any state we are using _.call() _function.


```
const currentUserDetails = await bfe.methods
       .users(this.state.account)
       .call();
```



Secondly, here we are trying to tell smart contract that the users is willing to make a order on our platform and sending the total amount our platform charge the user for the products online as _WEI _ to value metadata which is interpreted as msg.value in Smart Contract.


```
this.state.bfe.methods
     .Order(web3.utils.toBN(orderId))
     .send({
       from: this.state.account,
       value: window.web3.utils.toWei(totalPrice.toString(), "ether"),
     })
```



## 
Here BN of orderId is a unique hash to easily identify buyer’s orders in future.


```
web3.utils.toBN(orderId)
```



CONFIGURING FIREBASE:


```
export const config = {
   apiKey: "AIzaSyB4QJtV-u6w1or0Cq_MH2aAHuk6RAG0TwI",
   authDomain: "dapp-7936d.firebaseapp.com",
   projectId: "dapp-7936d",
   storageBucket: "dapp-7936d.appspot.com",
   messagingSenderId: "921110142433",
   appId: "1:921110142433:web:003d590912b5e052b206a0",
   measurementId: "G-YVJ6L7EQD3"
 };
```



```


```



MULTIPLE PRODUCT UPDATE IN:


For each product bought by the users the quantity required and the quantity available is adjusted in a single call to the firebase using **_batch.commit()._**


```
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
```



INTERACTION FLOW: 


**1. Registration: _(1 interaction with blockchain) same for all the user types_**



![alt_text](images/image7.png "image_tooltip")



**2. Unregister : _(1 interaction with blockchain) same for all the user types_**



![alt_text](images/image8.png "image_tooltip")



**3. Seller Home Page: _(0 interaction with blockchain)_**



![alt_text](images/image9.png "image_tooltip")



**4. Delivery Home Page:** _(0 interaction with blockchain):_



![alt_text](images/image10.png "image_tooltip")



**5.Buyer Home Page:** _(2 interaction with block chain)_



![alt_text](images/image11.png "image_tooltip")



FIREBASE ADDRESS TO DATA MAPPING: 


1. Mapping for all the users:



![alt_text](images/image12.png "image_tooltip")



2. Mapping for Buyers:



![alt_text](images/image13.jpg "image_tooltip")



3.Mapping for Sellers:



![alt_text](images/image14.jpg "image_tooltip")



4.Mapping for Delivery:



![alt_text](images/image15.png "image_tooltip")



## 
IMPORTANT FUNCTIONS:


The most important parts of our platform are User registration, Food Item registration, and Order placement.


Each time a new user uses our platform, the user registration is done. The user is asked to enter the name and select the user type from the dropdown. The user can select whether it is a buyer, seller, or delivery person. There are no separate registration pages for each user type. An entry is created for the user against its decentralized identity. This is a one-time process. The next time the user comes, he/she is already logged in. User details are stored on the blockchain to establish trust among various users.


The seller can invoke a personalized function to register the food items. The seller has to enter the name of the dish, its photo, the price, and the total amount available with the seller. This data is stored off-chain. The seller also has the ability to update the details for the already registered food items. For updating, the user cannot update the name of the dish; only the price, quantity, and image can be updated.


The user can add different dishes to the cart and can update the cart as well. The cart will show the food items that the user wants to order, and their quantity and a detailed cost to be paid is shown to the user. The user can place the order and Metamask prompts the user to pay the total amount of the order. Once the payment is done, the restaurant is notified of the order.


## 
TOKEN SYMBOL AND REASONING:


**_Swad_** is the name of our cryptocurrency ERC20 token (SWD).


“SWAD” is a Sanskrit word that literally means the taste of delicious and tempting food. We use this word as our blockchain token in hope that our platform brings the taste of many countries to our customers.


## 
USE CASE DIAGRAM:



![alt_text](images/image16.png "image_tooltip")



CONTRACT DIAGRAM:



![alt_text](images/image17.png "image_tooltip")



SEQUENCE DIAGRAM:



![alt_text](images/image18.png "image_tooltip")



QUAD CHART:



![alt_text](images/image19.png "image_tooltip")



FLOWCHART:



![alt_text](images/image20.png "image_tooltip")



## 
SMART CONTRACT:


```
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <=0.9.0;
contract BFEv4 {
    
    enum Type {Buyer, Seller, DeliveryPerson}
    struct User{
        uint id;
        string name;
        Type userType;
        bool reg;
    }

    uint public balance;
    uint uid;
    mapping(address => User) public users;

    event UserRegistered(uint bid, string bname, Type userType);
    event UserUnregistered(uint bid, string bname, Type userType);
    event FoodBought(address buyer, uint hashOfOrder);

    modifier onlyBuyer(){
        require(users[msg.sender].reg && users[msg.sender].userType == Type.Buyer, "Not a buyer");
        _;
    }

    modifier validUserType(Type userType){
        require(userType <= Type.DeliveryPerson);
        _;
    }

    function UserReg(string memory name, Type userType) public validUserType(userType){
        require(bytes(name).length > 0, "Name cannot be empty");
        uid ++;
        users[msg.sender] = User(uid, name, userType, true);
        emit UserRegistered(uid, name, userType);
    }

    function UserUnreg() public{
        User memory user = users[msg.sender];
        require(user.reg);
        user.reg = false;
        users[msg.sender] = user;
        emit UserUnregistered(user.id, user.name, user.userType);
    }

    function Order(uint hashOfOrder) public payable onlyBuyer{
        balance = address(this).balance;
        emit FoodBought(msg.sender, hashOfOrder);
    }

    function SettlePayment(bytes32[] memory sellersamount) public payable{
        for (uint i = 0; i < sellersamount.length; i ++){
            address payable seller = payable(address(uint160(uint256(sellersamount[i] >> 96))));
            uint amount = uint(uint96(uint256(sellersamount[i])));
            seller.transfer(amount);
        }
        balance = address(this).balance;
    }
}
```



## 
UNDERSTANDING THE SMART CONTRACT:


We have 3 different types of users: Buyer, Seller and Delivery person. We are using an **enum** variable to represent the user types.


```
enum Type {Buyer, Seller, DeliveryPerson}
```



We are creating a structure to store details about each user like the user id, name, user type and a boolean to verify the registration status of the user.


```
struct User{
        uint id;
        string name;
        Type userType;
        bool reg;
}
```



We are using a mapping to map decentralized identity to each user. We take an address and store the user details in the struct User.


```
mapping(address => User) public users;
```



We keep track of the user id with an integer variable **uid**, and the balance of the smart contract with another integer variable named **balance**.


There are 2 modifiers to enforce the rules for execution. One is the **onlyBuyer** modifier, which allows only buyers to take some particular actions like food order.


```
modifier onlyBuyer(){
        require(users[msg.sender].reg && users[msg.sender].userType == Type.Buyer, "Not a buyer");
        _;
}
```



The other one is to check whether the user type is valid or not. This modifier name is **validUserType**. It is only used when a new user is registered.


```
modifier validUserType(Type userType){
        require(userType <= Type.DeliveryPerson);
        _;
}
```



Now let us see some of the functions implemented in the smart contract. The first function is a **UserReg** function which takes the name of the user and the user type as input parameters. The entered user type is checked for its validity first. If the user type is different from the aforementioned, an error is thrown else the message sender or the person who invoked this function is registered. The user id is incremented by 1 each time a new user is enrolled. Upon registration, the parameter **reg** in the User structure is set to true for all the users. An event “UserRegistered” is called upon successful registration.


```
function UserReg(string memory name, Type userType) public validUserType(userType){
        require(bytes(name).length > 0, "Name cannot be empty");
        uid ++;
        users[msg.sender] = User(uid, name, userType, true);
        emit UserRegistered(uid, name, userType);
}
```



There is another function for user unregistration. It is called **UserUnreg**. This function doesn't take any input. It just checks whether the function invoker is already a user. If yes, then the user is unregistered by setting the **reg** boolean in the struct as false. If the message sender is not a registered user, this method throws an exception. An event “UserUnegistered” is called upon unregistering the user.


```
function UserUnreg() public{
        User memory user = users[msg.sender];
        require(user.reg);
        user.reg = false;
        users[msg.sender] = user;
        emit UserUnregistered(user.id, user.name, user.userType);
}
```



The next function is the **Order** function which takes the hash of the order as an input parameter. This function deducts the total order amount from the buyer or message sender account wallet and add it to the balance of the smart contract. An event “FoodBought” is emitted on placing the order.


```
function Order(uint hashOfOrder) public payable onlyBuyer{
        balance = address(this).balance;
        emit FoodBought(msg.sender, hashOfOrder);
}
```



The last function is **SettlePayment**. This function is called only after the user receives the order. This function takes a single bytes32 array of the seller and amount to be paid to it as a single entry in the array for each seller. Iterating over this array, we extract the address by bit-wise shifting the bytes32 value by 96 bits to the right. Similarly, we can determine the amount to be paid by converting the least significant 96 bits into an unsigned integer. Each seller gets the amount dued for its food and service. If delivery is opted, the last entry in the array is for the delivery person, and using the same operations, the delivery person get its cut for the delivery service. The balance of the contract is updated to just store the commission value.


```
function SettlePayment(bytes32[] memory sellersamount) public payable{
        for (uint i = 0; i < sellersamount.length; i ++){
            address payable seller = payable(address(uint160(uint256(sellersamount[i] >> 96))));
            uint amount = uint(uint96(uint256(sellersamount[i])));
            seller.transfer(amount);
        }
        balance = address(this).balance;
}
```



The main reason to user bytes32 array is to avoid sending 2 different arrays for addresses of multiple sellers, delivery person and the array of amount to be paid for each service provider. We are combining these 2 arrays into a single one. As  mentioned above, the address is stored in the first 20 bytes of the bytes32 variable and the amount is stored in the rest of it. As bytes32 fits within a single EVM word, it uses less gas.
