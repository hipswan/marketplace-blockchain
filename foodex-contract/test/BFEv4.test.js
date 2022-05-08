// If your function can be executed as a call, then Truffle will do so and you will be able to avoid gas costs.
const Web3 = require("web3");
require("chai").use(require("chai-as-promised")).should();

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const BFEv4 = artifacts.require("./contracts/BFEv4.sol");

(abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tAdd",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "hashOfOrder",
        type: "uint256",
      },
    ],
    name: "FoodBought",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "bname",
        type: "string",
      },
      {
        indexed: false,
        internalType: "enum BFEv4.Type",
        name: "userType",
        type: "uint8",
      },
    ],
    name: "UserRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "bname",
        type: "string",
      },
      {
        indexed: false,
        internalType: "enum BFEv4.Type",
        name: "userType",
        type: "uint8",
      },
    ],
    name: "UserUnregistered",
    type: "event",
  },
  {
    inputs: [],
    name: "balance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "swd",
    outputs: [
      {
        internalType: "contract ERC20MYN",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "users",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "enum BFEv4.Type",
        name: "userType",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "reg",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "SwdBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "enum BFEv4.Type",
        name: "userType",
        type: "uint8",
      },
    ],
    name: "UserReg",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "UserUnreg",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "hashOfOrder",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numTokens",
        type: "uint256",
      },
    ],
    name: "Order",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "sellersamount",
        type: "bytes32[]",
      },
    ],
    name: "SettlePayment",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
]),
  contract("BFEv4", (accounts) => {
    let deployer = accounts[0];
    let user = accounts[1];
    let seller = accounts[2];
    let delivery = accounts[3];
    let bfe, BFE;
    before(async () => {
      BFE = await BFEv4.deployed();

      bfe = new web3.eth.Contract(abi, BFE.address);
    });

    describe("deployment", async () => {
      it("deploys successfully", async () => {
        const address = await BFE.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
      });

      // it('has a name', async () => {
      //   const name = await marketplace.name()
      //   assert.equal(name, 'Dapp University Marketplace')
      // })
    });

    describe("registeration", async () => {
      let userRegister,balance,vendorRegister, users;
      before(async () => {
        userRegister = await bfe.methods
          .UserReg("atul singh", 0)
          .send({ from: user, gas: "1000000" });
        // users = await bfe.users(user)
      });
      it("register user", async () => {
        console.log('User Registration',userRegister);
        balance = await bfe.methods.SwdBalance().call();
        assert.equal(20, balance );
        // console.log(users)
        // assert.equal(userRegister.logs[0].args.bname, "atul singh");
        // assert.equal(userRegister.logs[0].args.user, user);
      });
      // it('register vendor',async ()=>{
      //     // console.log(vendorRegister.logs[0].args)
      //     assert.equal(vendorRegister.logs[0].args.sname, 'yash rathi')
      //     assert.equal(vendorRegister.logs[0].args.vendor, vendor)

      // })
    });

    // describe('list food item' , async() =>{
    //     let foodItem
    //     before(async ()=>{

    //         foodItem = await bfe.FoodItemReg('chicken',1,1,{from:vendor})
    //     })

    //     it('list food item', async()=>{

    //         // console.log(foodItem.logs[0].args)
    //         assert.equal(foodItem.logs[0].args.fname, 'chicken')
    //         assert.equal(foodItem.logs[0].args.seller, vendor)
    //         // assert.equal(foodItem.logs[0].args.price, web3.utils.BN(50))
    //         // assert.equal(foodItem.logs[0].args.count, 1)
    //     })

    // })

    // describe('buy food item' , async() =>{

    //     let buyFood,oldSellerBalance,price;
    //     price = web3.utils.toWei('1', 'ether')
    //     console.log(price)
    //     before(async ()=>{

    //       oldSellerBalance = await web3.eth.getBalance(vendor)

    //         buyFood = await bfe.Buy(1,1,{from:user,value:price})
    //     })
    //     it('buy food item', async()=>{

    //         oldSellerBalance =new web3.utils.BN(oldSellerBalance)
    //         let newSellerBalance
    //         newSellerBalance = await web3.eth.getBalance(vendor)

    //         newSellerBalance =new web3.utils.BN(newSellerBalance)

    //         price =new web3.utils.BN(price)
    //         const exepectedBalance = oldSellerBalance.add(price)
    //         assert.equal(newSellerBalance.toString(), exepectedBalance.toString())

    //     })
    // });
  });
