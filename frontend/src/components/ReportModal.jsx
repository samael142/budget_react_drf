import React, { useState, useEffect } from "react";
import ApiService from "./API/ApiService";
import ReportModalItem from "./ReportModalItem";

const ReportModal = (props) => {

    const [transactions, setTransactions] = useState([])

    const fetchData = async () => {
        const response = await ApiService.getTransactionsForModal(props.category, props.date)
        setTransactions(response)
    }

    useEffect(() => {
      fetchData()
    }, [])
    

    return (
        <div onClick={() => props.setModalVisible(false)} className="modal">
            {transactions.map(item => <ReportModalItem item={item} key={item.id}/>)}
        </div>
    )
}

export default ReportModal;
