import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  useEffect(() => {
    const fetchAccounts = async () => {
      if (window.ethereum) {
        // request would trigger metamask permission check for current domain
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log({ accounts });
      }
    };
    fetchAccounts();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
