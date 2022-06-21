var MyToken = artifacts.require("./Pokens.sol");

module.exports = async function(deployer) {
    await deployer.deploy(MyToken, 1000000);
}