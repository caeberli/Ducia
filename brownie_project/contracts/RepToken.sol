// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RepToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("RepToken", "DRT") {
        _mint(msg.sender, initialSupply);
    }
}
