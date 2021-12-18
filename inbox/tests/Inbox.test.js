const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const compiled = require('../compile');

// inject ganache provider to connect to test network
const web3 = new Web3(ganache.provider());

describe('Inbox', () => {
  let inbox;
  let accounts = [];

  const INIT_MESSAGE = 'Hi there!';

  beforeEach(async () => {
    // get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // pick one account to deploy
    inbox = await new web3.eth.Contract(compiled.abi)
      .deploy({
        data: compiled.evm.bytecode.object,
        arguments: [INIT_MESSAGE],
      })
      .send({ from: accounts[0], gas: 1000000 });
  });

  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INIT_MESSAGE);
  });

  it('can change the message', async () => {
    const NEXT_MESSAGE = 'bye';
    await inbox.methods.setMessage(NEXT_MESSAGE).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, NEXT_MESSAGE);
  });
});
