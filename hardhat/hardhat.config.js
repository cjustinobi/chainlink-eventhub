require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config()
// require("@nomicfoundation/hardhat-chai-matchers");
// require("hardhat-deploy");
// require("@nomiclabs/hardhat-ethers");
// require("@typechain/hardhat");

const { PRIVATE_KEY, QUICKNODE_RPC } = process.env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "maticmum",
  networks: {
   maticmum: {
      url: QUICKNODE_RPC,
      accounts: [PRIVATE_KEY]
    }
  },
  optimizer: {
    enabled: true,
    runs: 200,
  },
  paths: {
    artifacts: '../web/artifacts'
  },
};
