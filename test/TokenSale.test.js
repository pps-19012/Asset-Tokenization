const TokenSale = artifacts.require("TokenSale");
const Pokens = artifacts.require("Pokens");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("TokenSaleTest", async (accounts) => {
    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    it("Should not have any tokens in my deployer account", async () => {
        let instance = await Pokens.deployed();
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    })
});