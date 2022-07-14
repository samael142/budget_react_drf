import React, { useState, useEffect } from 'react';
import ApiService from './components/API/ApiService';
import './styles/App.css'
import MainMenu from './components/MainMenu';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import TransactionForm from './components/TransactionForm';
import MainList from './components/MainList';
import AddForm from './components/AddForm';

function App() {

  const [onScreenDate, setOnScreenDate] = useState(new Date())
  const [transactions, setTransactions] = useState([])
  const [totals, setTotals] = useState([])
  const [headers, setHeaders] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [moneyAccounts, setMoneyAccounts] = useState([])
  const [show, setShow] = useState(false);

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
    setHeaders(headers)
    setCategories(categories)
    setSubcategories(subcategories)
    setMoneyAccounts(moneyAccounts)
  }

  return (
    <Router>
      <div className="App container">
        <Routes>
          <Route path="/" element={<MainList
            totals={totals}
            transactions={transactions}
            setShow={setShow}
            show={show}
          />} />
          <Route path="/transaction" element={<AddForm
            headers={headers}
            categories={categories}
            subcategories={subcategories}
            moneyAccounts={moneyAccounts}
            setOnScreenDate={setOnScreenDate}
            setHeaders={setHeaders}
            setCategories={setCategories}
            setSubcategories={setSubcategories}
          />} />
        </Routes>
        <MainMenu
          SetOnScreenDate={setOnScreenDate}
          onScreenDate={onScreenDate}
          setShow={setShow}
        />
      </div>
    </Router>
  );
}

export default App;
