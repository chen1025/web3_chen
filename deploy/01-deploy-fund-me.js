const {NETWORK_CONFIG, DEV_CHAINS, LOCK_TIME,CONFIRM_NUM} = require("../helper-hardhat-config")

module.exports = async ({getNamedAccounts, deployments}) => {
    const {firstAccount} = await getNamedAccounts()
    console.log(`account =${firstAccount}`)
    const {deploy} = deployments
    let addr = "";
    if (DEV_CHAINS.includes(network.name)) {
        addr = (await deployments.get("MockV3Aggregator")).address
    } else {
        addr = NETWORK_CONFIG[network.config.chainId].contractAddress
    }
    await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, addr],
        log: true,
        waitConfirmations: CONFIRM_NUM
    })
    // 验证
    if (network.config.chainId === 11155111 && process.env.API_KEY) {
        const fundMe = await deployments.get("FundMe")
        await verify(fundMe, [LOCK_TIME, addr]);
    } else {
        console.log("network is not sepolia not verify")
    }

}

async function verify(fundMe, arg) {
    // 验证
    await hre.run("verify:verify", {
        address: fundMe.address,
        constructorArguments: arg,
    });
}


module.exports.tags = ["all", "fundMe"]
