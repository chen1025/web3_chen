// import eth

const {ethers} = require("hardhat")

async function main() {
    //
    const factory = await ethers.getContractFactory("FundMe");
    console.log("factory")
    const fundMe =await factory.deploy(10);
    await fundMe.waitForDeployment();
    console.log(`address = ${fundMe.target}`)
}

main().then().catch(err=> {
    console.error(err)
    process.exit(0)
})
