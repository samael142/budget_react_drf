import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ApiService from "../API/ApiService";
import TransactionItem from "../TransactionItem";

const GeneratedFilter = () => {

    const { state } = useLocation()
    const [transactions, setTransactions] = useState([])
    const [summ, setSumm] = useState()

    const fetchData = async () => {
        const response = await ApiService.getTransactionsForFilter(state)
        setTransactions(response)
        setSumm((response.map(item => parseFloat(item.operation_summ))).reduce((a, b) => a + b, 0))
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div className="container">
            {
                summ !== 0 && summ &&
                <>
                    <div className="double__button" style={{ boxShadow: "0.1em 0.1em 5px rgb(122 122 122 / 50%)"}}>
                        <div
                            className="tr__box__acc black__color">Итого
                        </div>
                        <div
                            className={"tr__box__acc transparent__color " + (summ > 0 ? "green__color" : "red__color")}>{summ.toLocaleString()}
                        </div>
                    </div>
                    <br />
                </>
            }
            {transactions.map(item => <TransactionItem transaction={item} key={item.id} />)}
            <div className="clear__block"></div>
        </div>
    )
}

export default GeneratedFilter;
