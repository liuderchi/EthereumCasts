const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// inject ganache provider to connect to test network
const web3 = new Web3(ganache.provider());

describe('Inbox', () => {
  beforeEach(async () => {
    // get a list of all accounts
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    // pick one account to deploy
  });
  it('deploys a contract', () => {
    // manipulate contract
    // assertx
  });
});
