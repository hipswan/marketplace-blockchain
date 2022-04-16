var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = "accuse genre bar crouch orchard wild tent youth breeze salon near weird";
//ropsten.infura.io/v3/d51b8ae11bb34cdf9ecc3fc4b65cea07
module.exports = {
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
  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "../foodex-app/src/abis/",
  compilers: {
    solc: {
      version: "^0.8.13",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
