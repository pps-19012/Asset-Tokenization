var Pokens = artifacts.require("./Pokens.sol");
var TokenSale = artifacts.require("./TokenSale.sol");
var Kyc = artifacts.require("./KycContract.sol");
require("dotenv").config({path: "../.env"});
//console.log(process.env);

module.exports = async function(deployer) {
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(Pokens, process.env.INITIAL_TOKENS);
    //await deployer.deploy(Pokens, 1000000);
    await deployer.deploy(Kyc);
    await deployer.deploy(TokenSale, 1, addr[0], Pokens.address, Kyc.address);
    let instance = await Pokens.deployed();
    await instance.transfer(TokenSale.address, process.env.INITIAL_TOKENS);
    //await instance.transfer(TokenSale.address, 1000000);
}