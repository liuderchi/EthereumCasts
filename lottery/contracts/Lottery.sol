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

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    // use abi.encode to merge 3 inputs
                    abi.encode(block.difficulty, block.timestamp, players)
                )
            );
    }
}
