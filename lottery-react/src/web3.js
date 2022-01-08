// connect to metamask API, in order to access test network
import Web3 from 'web3';

let web3;

if (window.ethereum) {
  // request would trigger metamask permission check for current domain
  window.ethereum.request({ method: 'eth_requestAccounts' });

  web3 = new Web3(window.ethereum);
}

export default web3;
