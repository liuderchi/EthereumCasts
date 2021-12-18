require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider({
  mnemonic: process.env.MNEMONIC_TEST,
  providerOrUrl: process.env.WALLET_PROVIDER_TEST,
});
const web3 = new Web3(provider);
