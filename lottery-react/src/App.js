import { useState, useEffect } from 'react';
import web3 from './web3';
import lottery from './lottery';
import './App.css';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [manager, setManager] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      if (web3) {
        const accountsData = await web3.eth.getAccounts();
        setAccounts(accountsData);

        // Note: we could skip passing an account to `from` arg,
        // because metamask by default use first account to call
        const managerData = await lottery.methods.manager().call();
        setManager(managerData);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}.</p>
      <br />
      <pre>{JSON.stringify({ accounts }, null, 2)}</pre>
    </div>
  );
}

export default App;
