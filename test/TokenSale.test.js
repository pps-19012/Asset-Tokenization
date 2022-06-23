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

    it("All tokens should be in the token sale  smart contract by default", async () => {
        let instance = await Pokens.deployed();
        let balanceOfTokenSaleSmartContract = await instance.balanceOf(TokenSale.address);
        let totalSupply = await instance.totalSupply();
        await expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply);
    })

    it("It should be possible to trade tokens", async () => {
        const sendTokens = 1;
        let tokenInstance = await Pokens.deployed;
        let tokensaleInstance = await TokenSale.deployed();
        let balanceBefore = await tokenInstance.balanceOf.call(recipientAccount);
        await expect(tokensaleInstance.sendTransaction({form: deployerAccount, value: web3.utils.toWei(sendTokens, "wei")})).to.be.fulfilled;
        //await expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(sendTokens)));
        await expect(balanceBefore + new BN(sendTokens)).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipientAccount));
    })
});