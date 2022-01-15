import { useState, useEffect } from 'react';
import web3 from './web3';
import lottery from './lottery';
import './App.css';

function App() {
  // contract info
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (web3) {
        const [managerData, playersData, balanceData] = await Promise.all([
          // Note: we could skip passing an account to `from` arg,
          // because metamask by default use first account to call
          lottery.methods.manager().call(),
          lottery.methods.getPlayers().call(),
          web3.eth.getBalance(lottery.options.address),
        ]);
        setManager(managerData);
        setPlayers(playersData);
        setBalance(balanceData);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}. There are currently{' '}
        {players?.length || 0} people entered, competing to win{' '}
        {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <br />
      <pre>{JSON.stringify({ players, balance }, null, 2)}</pre>
    </div>
  );
}

export default App;
