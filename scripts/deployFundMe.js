// import eth

const {ethers} = require("hardhat")


async function main() {
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
    // init address
    const [f, s] = await ethers.getSigners();
    // fund 1
    const tx = await fundMe.fund({value: ethers.parseEther("0.01")})
    await tx.wait()
    // check balance
    const balance = await ethers.provider.getBalance(fundMe.target)
    console.log(`contract balance = ${balance} `)
    // fund 2
    const tx2 = await fundMe.connect(s).fund({value: ethers.parseEther("0.01")})
    await tx2.wait()
    // check balance
    const balance2 = await ethers.provider.getBalance(fundMe.target)
    console.log(`contract balance = ${balance2} `)
    // check mapping
    const bl1 = await fundMe.fundersToAmount(f.address)
    const bl2 = await fundMe.fundersToAmount(s.address)
    console.log(`b1 balance = ${bl1} `)
    console.log(`b2 balance = ${bl2} `)

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
