import React, { useState, useEffect } from 'react';
import ApiService from '../API/ApiService';
import MainList from '../MainList';
import { scroller } from "react-scroll";
import { useParams } from 'react-router-dom';



const TransactionsList = ({ onScreenDate }) => {
    
    const [transactions, setTransactions] = useState([])
    const [totals, setTotals] = useState([])


    let params = useParams();

    useEffect(() => {
        // const el = document.getElementById("homeButton");
        // el.addEventListener("click", clickToHome)
        fetchTransactions()
        // return () => {
        //     el.removeEventListener("click", clickToHome)
        // }
    }, [onScreenDate])

    useEffect(() => {
        if (totals.length !== 0) {
            scrollToSection()
        }
    }, [totals]);

    const scrollToSection = () => {
        scroller.scrollTo("current__date");
    };

    // const clickToHome = () => {
    //     fetchTransactions()
    // }

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
            <MainList
                totals={totals}
                transactions={transactions}
            />
        </>
    );
}

export default TransactionsList;
