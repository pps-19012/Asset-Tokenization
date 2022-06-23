const Pokens = artifacts.require("Pokens");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("TokenTest", async (accounts) => {

    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    beforeEach(async () => {
        this.poken = await Pokens.new(process.env.INITIAL_TOKENS);
        //this.poken = await Pokens.new(1000000);
    })
    
    it("All tokens should be in deployer account", async () => {
        let instance = this.poken;
        let totalSupply = await instance.totalSupply();
        //let balance = await instance.balanceOf(accounts[0]);
        //assert.equal(balance.valuOf(), initialSupply.valueOf(), "The balance was not the same");
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("It is possible to send tokens between accounts", async () => {
        const sendTokens = 1;
        let instance = this.poken;
        let totalSupply = await instance.totalSupply();
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(recipientAccount, sendTokens)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        await expect(instance.balanceOf(recipientAccount)).to.eventually.be.bignumber.equal(new BN(sendTokens));
    })

    it("It is not possible to send more tokens than total", async () => {
        let instance = this.poken;
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);
        await expect(instance.transfer(recipientAccount, new BN(balanceOfDeployer+1))).to.eventually.be.rejected;
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    })

});