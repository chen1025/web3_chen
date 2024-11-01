const {ethers, deployments, getNamedAccounts, network} = require("hardhat");
const {assert, expect} = require("chai");
const helper = require("@nomicfoundation/hardhat-network-helpers")
const {DEV_CHAINS} = require("../../helper-hardhat-config");

!DEV_CHAINS.includes(network.name)
    ? describe.skip
    : describe("test fund me", function () {
        let firstAccount
        let secondAccount
        let fundMe
        let fundMeSecondAccount
        beforeEach(async function () {
            await deployments.fixture(["all"])
            firstAccount = (await getNamedAccounts()).firstAccount
            secondAccount = (await getNamedAccounts()).secondAccount
            const fundMeDeployment = await deployments.get("FundMe")
            fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
            fundMeSecondAccount = await ethers.getContract("FundMe", secondAccount)
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
        it("only owner", async function () {
            await fundMe.fund({value: ethers.parseEther("0.01")})
            await helper.time.increase(200)
            await helper.mine()

            expect(fundMeSecondAccount.getFund()).to.be.revertedWith("this function can only be called by owner")
        })
        it("window open, target reached, getFund failed",
            async function () {
                await fundMe.fund({value: ethers.parseEther("1")})
                await expect(fundMe.getFund()).to.be.revertedWith("window is not closed")
            }
        )
        it("window closed, target not reached, getFund failed",
            async function () {
                await fundMe.fund({value: ethers.parseEther("0.05")})
                await helper.time.increase(200)
                await helper.mine()
                await expect(fundMe.getFund()).to.be.revertedWith("Target is not reached")
            }
        )
        it("window closed, target reached, getFund success",
            async function () {
                await fundMe.fund({value: ethers.parseEther("1")})
                // make sure the window is closed
                await helper.time.increase(200)
                await helper.mine()
                await expect(fundMe.getFund())
                    .to.emit(fundMe, "FundWithdrawByOwner")
                    .withArgs(ethers.parseEther("1"))
            }
        )
        // refund
        it("window open, target not reached, funder has balance",
            async function () {
                await fundMe.fund({value: ethers.parseEther("0.1")})
                await expect(fundMe.refund())
                    .to.be.revertedWith("window is not closed");
            }
        )

        it("window closed, target reach, funder has balance",
            async function () {
                await fundMe.fund({value: ethers.parseEther("1")})
                // make sure the window is closed
                await helper.time.increase(200)
                await helper.mine()
                await expect(fundMe.refund())
                    .to.be.revertedWith("Target is reached");
            }
        )
        it("window closed, target not reach, funder does not has balance",
            async function () {
                await fundMe.fund({value: ethers.parseEther("0.1")})
                // make sure the window is closed
                await helper.time.increase(200)
                await helper.mine()
                await expect(fundMeSecondAccount.refund())
                    .to.be.revertedWith("there is no fund for you");
            }
        )

        it("window closed, target not reached, funder has balance",
            async function () {
                await fundMe.fund({value: ethers.parseEther("0.1")})
                // make sure the window is closed
                await helper.time.increase(200)
                await helper.mine()
                await expect(fundMe.refund())
                    .to.emit(fundMe, "RefundByFunder")
                    .withArgs(firstAccount, ethers.parseEther("0.1"))
            }
        )

    })
