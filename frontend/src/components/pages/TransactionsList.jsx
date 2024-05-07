import React, { useState, useEffect, useContext } from 'react';
import ApiService from '../API/ApiService';
import { scroller } from "react-scroll";
import { useParams } from 'react-router-dom';
import MainListTest from '../MainListTest';
import { MainContext } from '../../context';



const TransactionsList = ({ onScreenDate }) => {

    const [transactions, setTransactions] = useState([])
    const [totals, setTotals] = useState([])
    const [arrayOfData, setArrayOfData] = useState([])
    const { setLastLink } = useContext(MainContext)


    let params = useParams();

    useEffect(() => {
        fetchTransactions()
        setLastLink(window.location.pathname)
    }, [onScreenDate])

    useEffect(() => {
        if (totals.length !== 0) {
            setArrayOfData(MainListTest({ transactions, totals }));
        }
    }, [totals]);

    useEffect(() => {
        setArrayOfData([])
    }, [onScreenDate])

    useEffect(() => {
        if (arrayOfData.length !== 0) {
            scrollToSection()
        }
    }, [arrayOfData])


    const scrollToSection = () => {
        scroller.scrollTo("current__date");
    };

    async function fetchTransactions() {
        let totalsResponse
        let transactionsResponse
        if (params.accountId) {
            totalsResponse = await ApiService.getTotalsPerAccount(onScreenDate, params.accountId)
            transactionsResponse = await ApiService.getTransactionsPerAccount(onScreenDate, params.accountId)
        } else {
            totalsResponse = await ApiService.getTotals(onScreenDate)
            transactionsResponse = await ApiService.getTransactions(onScreenDate)
        }
        setTransactions(transactionsResponse)
        setTotals(totalsResponse)
    }

    return (
        <>
            {arrayOfData}
            <div className='clear__block'></div>
        </>
    );
}

export default TransactionsList;
