const {ethers, deployments, getNamedAccounts} = require("hardhat");
const {assert, expect} = require("chai");
const helper = require("@nomicfoundation/hardhat-network-helpers")

describe("test fund me", function () {
    let firstAccount
    let fundMe
    beforeEach(async function () {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    })
    it("show right owner", async function () {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.owner()), firstAccount);
    })
    // fund
    it("windows is closed ,amount is enough", async function () {
        await helper.time.increase(200)
        await helper.mine()
        expect(fundMe.fund({value: ethers.parseEther("0.01")})).to.be.revertedWith("window is closed")
    })
    it("windows is open ,amount not enough", async function () {
        expect(fundMe.fund({value: ethers.parseEther("0.0001")})).to.be.revertedWith("Send more ETH")
    })
    it("windows is open ,amount is enough,fund success", async function () {
        await fundMe.fund({value: ethers.parseEther("0.01")})
        const balance = fundMe.fundersToAmount(firstAccount)
        expect(balance).to.equal(balance, ethers.parseEther("0.01"))
    })
    // getfund ownerOnly


    // refund

})
