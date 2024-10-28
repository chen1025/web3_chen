require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()
require("@nomicfoundation/hardhat-verify");

const URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
const API_KEY = process.env.API_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //defaultNetwork: "hardhat",
  solidity: "0.8.27",
  networks:{
    sepolia:{
      url: URL,
      accounts:[
        PRIVATE_KEY,PRIVATE_KEY_1
      ],
      chainId: 11155111
    }
  },
  etherscan:{
    apiKey: API_KEY
  },
/*  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true
  }*/
};
