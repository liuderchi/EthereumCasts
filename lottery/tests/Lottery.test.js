const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const compiled = require('../compile');

// inject ganache provider to connect to test network
const web3 = new Web3(ganache.provider());

const MIN_VALUE_WEI = web3.utils.toWei('0.01');

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

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: MIN_VALUE_WEI,
      });
      assert(false);
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert',
      );
    }
  });

  it('requires a manager to call pickWinner (`requireManager` modifier)', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei('0.02'),
      });
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert',
      );
    }
  });

  it('failed to pick winner if no one had entered (`requireNonEmptyPlayers` modifier)', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      assert(false);
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert',
      );
    }
  });

  it('sends money to the winner and resets the players array', async () => {
    const player = accounts[0];
    await lottery.methods.enter().send({
      from: player,
      value: web3.utils.toWei('2'),
    });

    const initialBalance = await web3.eth.getBalance(player);
    await lottery.methods.pickWinner().send({ from: player });
    const finalBalance = await web3.eth.getBalance(player);
    const difference = finalBalance - initialBalance;

    // difference is less than 2 since
    // some part of it is used as gas in transaction
    assert(difference > web3.utils.toWei('1.8'));
    console.log(
      `estimated gas used in send money transaction: ${Number(
        web3.utils.toWei('2') - difference,
      )} wei`,
    );

    // check players arraay is empty
    const players = await lottery.methods.getPlayers().call({
      from: player,
    });
    assert.equal(players.length, 0);
    // check lotter balance is zero
    const lotteryBalance = await web3.eth.getBalance(lottery.options.address);
    assert.equal(lotteryBalance, 0);
  });
});
