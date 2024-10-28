const {task} = require("hardhat/config")

task("deploy-fm","deploy and verify FundMe").setAction(async (taskArgs, hre) => {
    // 部署
    const factory = await ethers.getContractFactory("FundMe");
    console.log("factory")
    const fundMe = await factory.deploy(300);
    await fundMe.waitForDeployment();
    console.log(`address = ${fundMe.target}`)
    // 验证
    if (hre.network.config.chainId === 11155111 && process.env.API_KEY) {
        await verify(fundMe, [300]);
    } else {
        console.log("deploy finish")
    }
})

async function verify(fundMe, arg) {
    console.log(`waiting for block Transaction 1`)
    await fundMe.deploymentTransaction().wait(1)
    // 验证
    await hre.run("verify:verify", {
        address: fundMe.target,
        constructorArguments: arg,
    });
}

module.exports = {}
