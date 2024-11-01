require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()
require("@nomicfoundation/hardhat-verify");
require("./tasks/index")
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

const URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
const API_KEY = process.env.API_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    //defaultNetwork: "hardhat",
    solidity: "0.8.27",
    networks: {
        sepolia: {
            url: URL,
            accounts: [
                PRIVATE_KEY_1, PRIVATE_KEY
            ],
            chainId: 11155111
        }
    },
    etherscan: {
        apiKey: API_KEY
    },
    namedAccounts: {
        firstAccount: {
            default: 0
        },
        secondAccount: {
            default: 1
        }
    },
    gasReporter: {
        enabled: true
    }
    /*  sourcify: {
        // Disabled by default
        // Doesn't need an API key
        enabled: true
      }*/
};
