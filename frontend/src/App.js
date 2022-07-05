import React, { useState, useEffect } from 'react';
import ApiService from './components/API/ApiService';
import './styles/App.css'
import SwiperTest from './components/SwiperTest';
import MainMenu from './components/MainMenu';

function App() {

  const [onScreenDate, SetOnScreenDate] = useState(new Date())
  const [transactions, setTransactions] = useState([])
  const [totals, setTotals] = useState([])

  useEffect(() => {
    fetchTransactions()
  }, [onScreenDate])

  async function fetchTransactions() {
    const transactions = await ApiService.getTransactions(onScreenDate);
    const totals = await ApiService.getTotals(onScreenDate);
    setTransactions(transactions)
    setTotals(totals)
  }

  return (
    <div className="App container">
      <SwiperTest
        totals={totals}
        transactions={transactions}
        SetOnScreenDate={SetOnScreenDate}
        onScreenDate={onScreenDate}
      />
      <MainMenu
        SetOnScreenDate={SetOnScreenDate}
      />
    </div>
  );
}

export default App;
