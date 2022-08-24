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
import ReportSettings from './components/pages/ReportSettings';
import GeneratedReport from './components/pages/GenedatedReport';
import MoneyAccountForm from './components/pages/MoneyAccountForm';
import Settings from './components/pages/Settings';
import Statistic from './components/pages/Statistic';
import Last20 from './components/pages/last20';
import Filter from './components/pages/Filter';
import GeneratedFilter from './components/pages/GeneratedFilter';

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

  async function getMoneyAccountsList() {
    const moneyAccounts = await ApiService.getMoneyAccounts()
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
              <Route path="new" element={<MoneyAccountForm getMoneyAccountsList={getMoneyAccountsList} />} />
              <Route path=":accountId" element={<TransactionsList onScreenDate={onScreenDate} />} />
            </Route>
            <Route path="report">
              <Route path="" element={<ReportSettings />} />
              <Route path="generated_report" element={<GeneratedReport />} />
            </Route>
            <Route path='settings'>
              <Route path="" element={<Settings />} />
              <Route path="statistic" element={<Statistic />} />
              <Route path="budget" element={<MoneyAccounts />} />
              <Route path="last20" element={<Last20 />} />
              <Route path="filter" >
                <Route path="" element={<Filter />} />
                <Route path="generated_filter" element={<GeneratedFilter />} />
              </Route>
              <Route path="past" element={<MoneyAccounts />} />
            </Route>
            <Route />
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
