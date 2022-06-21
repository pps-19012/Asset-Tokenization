const Pokens = artifacts.require("Pokens");

var chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

contract("TokenTest", async (accounts) => {

    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    it("All tokens should be in deployer account", async () => {
        let instance = await Pokens.deployed();
        let totalSupply = await instance.totalSupply();
        //let balance = await instance.balanceOf(accounts[0]);
        //assert.equal(balance.valuOf(), initialSupply.valueOf(), "The balance was not the same");
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("It is possible to send tokens between accounts", async () => {
        const sendTokens = 1;
        let instance = await Pokens.deployed();
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipientAccount, sendTokens)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        expect(instance.balanceOf(recipientAccount)).to.eventually.be.bignumber.equal(new BN(sendTokens));
    })

    it("It is not possible to send more tokens than total", async () => {
        let instance = await Pokens.deployed();
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);
        expect(instance.transfer(recipientAccount, new BN(balanceOfDeployer+1))).to.eventually.be.rejectedWith("noice");
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    })
});