import web3 from './web3';
import abi from './lottery.abi';

const address = process.env.REACT_APP_CONTRACT_ADDRESS;

// create local contract instance
export default new web3.eth.Contract(abi, address);
