const {DECIMAL, ETH_PRICE, DEV_CHAINS, CONFIRM_NUM} = require("../helper-hardhat-config")
const {network} = require("hardhat");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {firstAccount} = await getNamedAccounts()
    const {deploy} = deployments

    if (DEV_CHAINS.includes(network.name)) {
        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, ETH_PRICE],
            log: true,
            waitConfirmations: CONFIRM_NUM
        })
    } else {
        console.log("network need mock")
    }

}

module.exports.tags = ["all", "mock"]
