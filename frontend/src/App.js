import React, { useState, useEffect } from 'react';
import ApiService from './components/API/ApiService';
import './styles/App.css'
import SwiperTest from './components/SwiperTest';
import MainMenu from './components/MainMenu';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import TransactionForm from './components/TransactionForm';

function App() {

  const [onScreenDate, SetOnScreenDate] = useState(new Date())
  const [transactions, setTransactions] = useState([])
  const [totals, setTotals] = useState([])
  const [headers, setHeaders] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [moneyAccounts, setMoneyAccounts] = useState([])
  const [lastHeaders, setLastHeaders] = useState([])

  useEffect(() => {
    fetchTransactions()
  }, [onScreenDate])

  useEffect(() => {
    getTransactionParameters()
  }, [])

  async function fetchTransactions() {
    const transactions = await ApiService.getTransactions(onScreenDate);
    const totals = await ApiService.getTotals(onScreenDate);
    setTransactions(transactions)
    setTotals(totals)
  }

  async function getTransactionParameters() {
    const headers = await ApiService.getHeaders()
    const categories = await ApiService.getCategories()
    const subcategories = await ApiService.getSubcategories()
    const moneyAccounts = await ApiService.getMoneyAccounts()
    const lastHeaders = await ApiService.getLastHeaders()
    setHeaders(headers)
    setCategories(categories)
    setSubcategories(subcategories)
    setMoneyAccounts(moneyAccounts)
    setLastHeaders(lastHeaders)
  }

  return (
    <Router>
      <div className="App container">
        <Routes>
          <Route path="/" element={<SwiperTest
            totals={totals}
            transactions={transactions}
            SetOnScreenDate={SetOnScreenDate}
            onScreenDate={onScreenDate}
          />} />
          <Route path="/transaction" element={<TransactionForm
            headers={headers}
            categories={categories}
            subcategories={subcategories}
            moneyAccounts={moneyAccounts}
            lastHeaders={lastHeaders}
          />} />
        </Routes>
        <MainMenu
          SetOnScreenDate={SetOnScreenDate}
        />
      </div>
    </Router>
  );
}

export default App;
