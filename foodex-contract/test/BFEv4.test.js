// If your function can be executed as a call, then Truffle will do so and you will be able to avoid gas costs.
const assert = require("assert");
const Web3 = require("web3");
require("chai").use(require("chai-as-promised")).should();

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const BFEv4 = artifacts.require("./contracts/BFEv4.sol");
const ERC20MYN = artifacts.require("./contracts/ERC20MYN.sol");
abi = [
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
    stateMutability: "nonpayable",
    type: "function",
  },
];
contract("BFEv4", (accounts) => {
  let deployer = accounts[0];
  let user = accounts[1];
  let seller = accounts[2];
  let delivery = accounts[3];
  let bfeContractBalance;
  let bfe, BFE;
  before(async () => {
    BFE = await BFEv4.deployed();
    SWAD = await ERC20MYN.deployed();
    // bfe = new web3.eth.Contract(abi, BFE.address);
    // swad = new web3.eth.Contract(abi, SWAD.address);
  });

  describe("deployment", async () => {
    let deployerBalance;
    before(async () => {
      bfeContractBalance = await SWAD.balanceOf(BFE.address, {
        from: deployer,
      });
      deployerBalance = await SWAD.balanceOf(deployer, { from: deployer });
      // console.log("deployerBalance", deployerBalance);
      // console.log("bfeContractBalance", bfeContractBalance);
    });
    it("deploys successfully", async () => {
      var address = BFE.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      address = SWAD.address;
      assert.equal(web3.utils.fromWei(deployerBalance, "ether"), 100000);
      assert.equal(web3.utils.fromWei(bfeContractBalance, "ether"), 0);
    });
    it("Initital Suppy Deployer", async () => {
      var address = BFE.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      address = SWAD.address;
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
    let userRegister, sellerRegister, deliveryRegister, balance;
    before(async () => {
      // console.log("bfe",BFE)
      userRegister = await BFE.UserReg("atul singh", 0, { from: user });
      // console.log("userRegisterd", userRegister.logs[0].args);
      sellerRegister = await BFE.UserReg("yash rathi", 1, { from: seller });
      deliveryRegister = await BFE.UserReg("aniket bharti", 2, {
        from: delivery,
      });
      // // users = await bfe.users(user)
    });
    it("user register", async () => {
      balance = await BFE.SwdBalance.call({ from: user });
      balance = web3.utils.fromWei(balance);
      assert.equal(20, balance);
      assert.equal(userRegister.logs[0].args.bname, "atul singh");
      assert.equal(userRegister.logs[0].args.bid, 1);
      assert.equal(userRegister.logs[0].args.userType, 0);
    });
    it("seller register", async () => {
      // console.log(vendorRegister.logs[0].args)
      balance = await BFE.SwdBalance.call({ from: seller });
      balance = web3.utils.fromWei(balance);
      assert.equal(20, balance);
      assert.equal(sellerRegister.logs[0].args.bname, "yash rathi");
      assert.equal(sellerRegister.logs[0].args.bid, 2);
      assert.equal(sellerRegister.logs[0].args.userType, 1);
    });
    it("delivery register", async () => {
      balance = await BFE.SwdBalance.call({ from: delivery });
      balance = web3.utils.fromWei(balance);
      assert.equal(20, balance);
      assert.equal(deliveryRegister.logs[0].args.bname, "aniket bharti");
      assert.equal(deliveryRegister.logs[0].args.bid, 3);
      assert.equal(deliveryRegister.logs[0].args.userType, 2);
    });
  });

  describe("Approve Smart Contract", async () => {
    let allowance, approveSupply;
    before(async () => {
      approveSupply = 100000;
      await SWAD.approve(
        BFE.address,
        web3.utils.toWei(approveSupply.toString(), "ether"),
        {
          from: user,
        }
      );
      await SWAD.approve(
        BFE.address,
        web3.utils.toWei(approveSupply.toString(), "ether"),
        {
          from: seller,
        }
      );
      await SWAD.approve(
        BFE.address,
        web3.utils.toWei(approveSupply.toString(), "ether"),
        {
          from: delivery,
        }
      );
    });

    it("user allowance approval", async () => {
      allowance = await SWAD.allowance(user, BFE.address, { from: user });
      allowance = web3.utils.fromWei(allowance, "ether");

      assert.equal(approveSupply, allowance);
      // console.log("allowance", allowance);
      // console.log(foodItem.logs[0].args)
      // assert.equal(foodItem.logs[0].args.fname, "chicken");
      // assert.equal(foodItem.logs[0].args.seller, vendor);
      // assert.equal(foodItem.logs[0].args.price, web3.utils.BN(50))
      // assert.equal(foodItem.logs[0].args.count, 1)
    });
    it("seller allowance approval", async () => {
      allowance = await SWAD.allowance(seller, BFE.address, { from: seller });
      allowance = web3.utils.fromWei(allowance, "ether");
      // console.log("allowance", allowance);
      assert.equal(approveSupply, allowance);
    });
    it("delivery allowance approval", async () => {
      allowance = await SWAD.allowance(delivery, BFE.address, {
        from: delivery,
      });
      allowance = web3.utils.fromWei(allowance, "ether");
      // console.log("allowance", allowance);
      assert.equal(approveSupply, allowance);
    });
  });

  describe("Order Food", async () => {
    let userBalance,
      bfeContractBalance,
      userBalanceAfterOrder,
      bfeContractBalanceAfterOrder;
    before(async () => {
      userBalance = await SWAD.balanceOf(user, { from: user });
      bfeContractBalance = await SWAD.balanceOf(BFE.address, { from: user });

      await BFE.Order(1, web3.utils.toWei("5", "ether"), {
        from: user,
      });
      userBalanceAfterOrder = await SWAD.balanceOf(user, { from: user });
      bfeContractBalanceAfterOrder = await SWAD.balanceOf(BFE.address, {
        from: user,
      });

      // console.log("userBalance", userBalance);
    });

    it("user swad transferred to contract", async () => {
      userBalance = web3.utils.fromWei(userBalance, "ether");
      userBalanceAfterOrder = web3.utils.fromWei(
        userBalanceAfterOrder,
        "ether"
      );
      bfeContractBalance = web3.utils.fromWei(bfeContractBalance, "ether");
      bfeContractBalanceAfterOrder = web3.utils.fromWei(
        bfeContractBalanceAfterOrder,
        "ether"
      );
      assert.equal(parseInt(userBalance - 5), parseInt(userBalanceAfterOrder));
      assert.equal(
        parseInt(bfeContractBalance + 5),
        parseInt(bfeContractBalanceAfterOrder)
      );
      // assert.equal(userBalance, 95000);
    });
  });

  describe("Settle Payment", async () => {
    let amount = 5;
    let encodeAmount = web3.eth.abi.encodeParameter(
      "uint256",
      web3.utils.toWei(amount.toString(), "ether")
    );
    let stripEncodeAmount = web3.utils.stripHexPrefix(encodeAmount);
    let sellerAmount =
      seller.toString().toLowerCase() + stripEncodeAmount.substring(40);
    let arrSellerAmount = [sellerAmount];
    let sellerBalance, bfeContractBalance;

    before(async () => {
      sellerBalance = await SWAD.balanceOf(seller, { from: seller });
      bfeContractBalance = await SWAD.balanceOf(BFE.address, { from: seller });
      // User will call the settlepayment
      await BFE.SettlePayment(arrSellerAmount, { from: user });
      sellerBalanceAfterSettle = await SWAD.balanceOf(seller, { from: seller });
      bfeContractBalanceAfterSettle = await SWAD.balanceOf(BFE.address, {
        from: seller,
      });
    });
    it("contract swad transferred to seller", async () => {
      sellerBalance = web3.utils.fromWei(sellerBalance, "ether");
      sellerBalanceAfterSettle = web3.utils.fromWei(
        sellerBalanceAfterSettle,
        "ether"
      );
      bfeContractBalance = web3.utils.fromWei(bfeContractBalance, "ether");
      bfeContractBalanceAfterSettle = web3.utils.fromWei(
        bfeContractBalanceAfterSettle,
        "ether"
      );
      // console.log("sellerBalance", sellerBalance);
      // console.log("sellerBalanceAfterSettle", sellerBalanceAfterSettle);
      // console.log("bfeContractBalance", bfeContractBalance);
      // console.log(
      //   "bfeContractBalanceAfterSettle",
      //   bfeContractBalanceAfterSettle
      // );
      assert.equal(
        parseInt(sellerBalance) + amount,
        parseInt(sellerBalanceAfterSettle)
      );
      assert.equal(
        parseInt(bfeContractBalance) - amount,
        parseInt(bfeContractBalanceAfterSettle)
      );
    });
  });
});
