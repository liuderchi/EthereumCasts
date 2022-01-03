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

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02'),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(players.length, 1);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02'),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02'),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02'),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });
});
