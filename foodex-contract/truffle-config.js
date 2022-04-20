const HDWalletProvider = require("truffle-hdwallet-provider");
require("dotenv").config();
const MNEMONIC = process.env.MNEMONIC;
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: MNEMONIC,
          },
          providerOrUrl:
            process.env.INFURA_ROPSTEN_URL,
        }),
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
