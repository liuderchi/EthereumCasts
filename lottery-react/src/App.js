/* eslint-disable no-restricted-globals */
import { useState, useEffect } from 'react';
import web3 from './web3';
import lottery from './lottery';
import './App.css';

function App() {
  // contract info
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');

  // form states
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  // base data
  const [accounts, setAccounts] = useState([]);
  const [isDebug, setIsDebug] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (web3) {
        const [managerData, playersData, balanceData, accountsData] =
          await Promise.all([
            // Note: we could skip passing an account to `from` arg,
            // because metamask by default use first account to call
            lottery.methods.manager().call(),
            lottery.methods.getPlayers().call(),
            web3.eth.getBalance(lottery.options.address),
            web3.eth.getAccounts(),
          ]);
        setManager(managerData);
        setPlayers(playersData);
        setBalance(balanceData);
        setAccounts(accountsData);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (location) {
      try {
        const url = new URL(location);
        if (url.searchParams.get('debug')) {
          setIsDebug(true);
        }
      } catch (error) {}
    }
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const account = accounts[0];

    if (value && account) {
      try {
        setMessage('Waiting on transaction success...');
        const transactionResult = await lottery.methods.enter().send({
          from: account,
          value: web3.utils.toWei(value, 'ether'),
        });
        console.log({ blockHash: transactionResult?.blockHash });
        setMessage('You have been entered!');
      } catch (error) {
        setMessage(`Something wrong! ${error.message}`);
        console.error(error);
      }
    }
  };

  const onClickPickWinner = async () => {
    const account = accounts[0];
    try {
      setMessage('Waiting on transaction success...');
      const transactionResult = await lottery.methods.pickWinner().send({
        from: account,
      });
      console.log({ blockHash: transactionResult?.blockHash });
      setMessage('A winner has been picked!');
    } catch (error) {
      setMessage(`Something wrong! ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}. There are currently{' '}
        {players?.length || 0} people entered, competing to win{' '}
        {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter (should greater than 0.01) </label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button disabled={!value}>Enter</button>
      </form>

      {accounts[0] && manager && accounts[0] === manager && (
        <>
          <hr />
          <h4>Ready to pick a winner?</h4>
          <button onClick={onClickPickWinner}>Pick a winner!</button>
        </>
      )}

      <h1>{message}</h1>

      {isDebug && (
        <>
          <br />
          <pre>{JSON.stringify({ players, balance, accounts }, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default App;
