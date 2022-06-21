// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Pokens is ERC20 {
    constructor(uint256 initialSupply) ERC20("Pokens", "PKN") {
        _mint(msg.sender, initialSupply);
    }
}
