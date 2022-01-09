const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Lottery.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Lottery.sol'
].Lottery;

if (process.env.ABI) {
  fs.writeFileSync('lottery.abi.json', JSON.stringify(compiled.abi, null, 2), {
    encoding: 'utf-8',
  });
}

module.exports = compiled;
