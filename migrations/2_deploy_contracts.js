var Pokens = artifacts.require("./Pokens.sol");
var TokenSale = artifacts.require("./TokenSale.sol");

module.exports = async function(deployer) {
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(Pokens, 1000000);
    await deployer.deploy(TokenSale, 1, addr[0], Pokens.address);
    let instance = await Pokens.deployed();
    await instance.transfer(TokenSale.address, 1000000);
}