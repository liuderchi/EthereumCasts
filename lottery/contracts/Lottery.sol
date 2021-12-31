// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        // validate sender sends some amount of eth (wei)
        require(msg.value > .01 ether);

        players.push(msg.sender);
    }
}
