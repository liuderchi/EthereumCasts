const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// inject ganache provider to connect to test network
const web3 = new Web3(ganache.provider());
