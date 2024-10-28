const {task} = require("hardhat/config")

task("in-fm")
    .addParam("addr", "fundMe address")
    .setAction(async (taskArgs, hre) => {
        const factory = await ethers.getContractFactory("FundMe");
        const fundMe = await factory.attach(taskArgs.addr);
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
    })


module.exports = {}
