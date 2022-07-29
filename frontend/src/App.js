import React, { useState, useEffect } from 'react';
import ApiService from './components/API/ApiService';
import './styles/App.css'
import MainMenu from './components/MainMenu';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import TransactionsList from './components/pages/TransactionsList';
import TransactionForm from './components/pages/TransactionForm';
import TransferForm from './components/pages/TransferForm';
import PlainOperationForm from './components/pages/PlainOperationForm';
import MoneyAccounts from './components/pages/moneyAccounts';
import { MainContext } from './context'

function App() {

  const [onScreenDate, setOnScreenDate] = useState(new Date())
  const [headers, setHeaders] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [moneyAccounts, setMoneyAccounts] = useState([])

  useEffect(() => {
    getTransactionParameters()
  }, [])

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
    <MainContext.Provider value={{
      headers,
      categories,
      subcategories,
      moneyAccounts,
      setHeaders,
      setCategories,
      setSubcategories,
      setOnScreenDate,
      setMoneyAccounts,
    }}>
      <Router>
        <div className="App container">
          <Routes>
            <Route path="/" element={<TransactionsList onScreenDate={onScreenDate} />} />
            <Route path="transaction">
              <Route path="new" element={<TransactionForm />} />
              <Route path=":transactionId" element={<TransactionForm />} />
            </Route>
            <Route path="transfer">
              <Route path="new" element={<TransferForm />} />
              <Route path=":transferId" element={<TransferForm />} />
            </Route>
            <Route path="plain">
              <Route path="new" element={<PlainOperationForm />} />
            </Route>
            <Route path="money_accounts">
              <Route path="list" element={<MoneyAccounts />} />
              <Route path="new" element={<MoneyAccounts />} />
            </Route>
          </Routes>
          <MainMenu
            SetOnScreenDate={setOnScreenDate}
            onScreenDate={onScreenDate}
          />
        </div>
      </Router>
    </MainContext.Provider>
  );
}

export default App;
