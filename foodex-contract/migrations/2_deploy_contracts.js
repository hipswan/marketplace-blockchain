const SWAD = artifacts.require("ERC20MYN");
const BFEv4 = artifacts.require("BFEv4");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

module.exports = async function (deployer, network, accounts) {
  const initialSupply = 100000;
  // console.log("deploying BFEv4", deployer);
  await deployer.deploy(SWAD, initialSupply);
  const swad = await SWAD.deployed();
  // console.log("Swad Address", swad.address);
  await deployer.deploy(BFEv4, swad.address);
  const bfe = await BFEv4.deployed();
  // console.log(
  //   "Uint256 intialsupply ",
  //   web3.utils.toWei(initialSupply.toString(), "ether")
  // );
  await swad.approve(
    bfe.address,
    web3.utils.toWei(initialSupply.toString(), "ether"),
    {
      from: accounts[0],
    }
  );
};