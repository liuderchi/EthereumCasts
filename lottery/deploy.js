require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiled = require('./compile');

const provider = new HDWalletProvider({
  mnemonic: process.env.MNEMONIC_TEST,
  providerOrUrl: process.env.WALLET_PROVIDER_TEST,
});
const web3 = new Web3(provider);

const deploy = async () => {
  // get accounts generated from mnemonic
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(compiled.abi)
    .deploy({
      data: compiled.evm.bytecode.object,
      arguments: [],
    })
    .send({ from: accounts[0], gas: 1000000 });

  console.log('Contract deployed to', result.options.address);

  provider.engine.stop();
};
deploy();
