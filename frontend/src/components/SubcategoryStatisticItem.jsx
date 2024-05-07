import React from "react";
import { useState, useEffect, useContext } from "react";
import TransactionItem from "./TransactionItem";
import ApiService from "./API/ApiService";
import { MainContext } from "../context";

const SubcategoryStatisticItem = (props) => {


    const { statisticDetailModeArray, setStatisticDetailModeArray } = useContext(MainContext)

    const [showTransactions, setShowTransactions] = useState(statisticDetailModeArray.includes(props.xy))
    const [transactions, getTransactions] = useState([])
    const queryData = {
        end: props.endDate,
        filterCategory: props.category,
        filterHeader: "",
        filterSubcategory: props.subcategory,
        start: props.startDate
    }

    useEffect(() => {
        setShowTransactions(statisticDetailModeArray.includes(props.xy))      
    }, [statisticDetailModeArray])
    

    const onClick = () => {
        if (showTransactions) {
            setStatisticDetailModeArray(statisticDetailModeArray => statisticDetailModeArray.filter(item => item !== props.xy));
            fetchData()
        }
        setShowTransactions(!showTransactions)
    }

    useEffect(() => {
        if (showTransactions) {
            if (!statisticDetailModeArray.includes(props.xy)) {
                setStatisticDetailModeArray([...statisticDetailModeArray, props.xy])
            }
            fetchData()
        }
    }, [showTransactions])

    const fetchData = async () => {
        const response = await ApiService.getTransactionsForFilter(queryData)
        getTransactions(response)
    }


    return (
        <>
            <div className="double__button" onClick={onClick}>
                <div className="tr__box__acc">&nbsp;&bull;&nbsp;{props.subcategory}</div>
                <div className="tr__box__acc">{(Math.floor(props.summ * 100) / 100).toLocaleString("ru", { minimumFractionDigits: 2 })}</div>
            </div>
            {showTransactions && (
                <div className="container">
                    {transactions.map(item => <TransactionItem transaction={item} key={item.id} />)}
                </div>
            )}
        </>
    )
}

export default SubcategoryStatisticItem;
