import React, { useState, useEffect } from "react";
import TransactionItem from "../TransactionItem";
import ApiService from "../API/ApiService";

const Last20 = () => {

    const [transactions, setTransactions] = useState([])

    const fetchData = async () => {
        const response = await ApiService.getTransactionsForLast20()
        setTransactions(response)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="container">
            {transactions.map(item => <TransactionItem transaction={item} key={item.id} />)}
        </div>
    )
}

export default Last20;