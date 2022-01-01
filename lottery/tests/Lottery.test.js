const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const compiled = require('../compile');

// inject ganache provider to connect to test network
const web3 = new Web3(ganache.provider());

describe('Lottery contract', () => {
  let lottery;
  let accounts = [];

  beforeEach(async () => {
    // get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // pick one account to deploy
    lottery = await new web3.eth.Contract(compiled.abi)
      .deploy({
        data: compiled.evm.bytecode.object,
        arguments: [],
      })
      .send({ from: accounts[0], gas: 1000000 });
  });

  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });
});
