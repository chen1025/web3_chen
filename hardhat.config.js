require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //defaultNetwork: "hardhat",
  solidity: "0.8.27",
  networks:{
    sepolia:{
      url: URL,
      accounts:[
        PRIVATE_KEY
      ]
    }
  },
  etherscan:{
    apiKey: "74ZG8U8M6UZQ3MTCZPZHNNF5GT2KVZ3ZE8"
  }
};
