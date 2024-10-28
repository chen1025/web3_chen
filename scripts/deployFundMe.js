// import eth

const {ethers} = require("hardhat")


async function main() {
    // 部署
    const factory = await ethers.getContractFactory("FundMe");
    console.log("factory")
    const fundMe = await factory.deploy(10);
    await fundMe.waitForDeployment();
    console.log(`address = ${fundMe.target}`)
    // 验证
    if (hre.network.config.chainId === 11155111 && process.env.API_KEY) {
        await verify(fundMe, [10]);
    } else {
        console.log("deploy finish")
    }
    // init address
    // fund 1
    // check balance
    // fund 2
    // check balance
    // check mapping
}

async function verify(fundMe, arg) {
    console.log(`waiting for block Transaction 1`)
    await fundMe.deploymentTransaction().wait(1)
    // 验证
    await hre.run("verify:verify", {
        address: fundMe.target,
        constructorArguments: arg,
    });
}

main().then().catch(err => {
    console.error(err)
    process.exit(0)
})
