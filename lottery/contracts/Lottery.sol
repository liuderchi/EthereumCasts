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

    function pickWinner() public requireManager requireNonEmptyPlayers {
        // find winner
        address winner = players[random() % players.length];

        // transfer reward
        // cast `address` to `payable address`
        // https://ethereum.stackexchange.com/questions/65693/how-to-cast-address-to-address-payable-in-solidity-0-5-0
        payable(winner).transfer(address(this).balance);

        // reset
        players = new address[](0); // address array with length zero
    }

    // as repeated code template
    modifier requireManager() {
        // auth check
        require(msg.sender == manager);
        _; // placeholder for remaining code from modifier user
    }
    modifier requireNonEmptyPlayers() {
        require(players.length > 0);
        _;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
