import React, { useState, useEffect } from "react";
import ApiService from "../API/ApiService";
import BudgetItem from "../BudgetItem";
import { Link } from "react-router-dom";

const BudgetList = () => {

    const [budgets, setBudgets] = useState([])

    const fetchData = async () => {
        const response = await ApiService.getBudgets()
        setBudgets(response)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="container">
            {budgets.map(item => <BudgetItem budget={item} key={item.id} />)}
            <br />
            <div className="single__element__center">
                <Link to="/settings/budget/new" className="footer__button">Новый бюджет</Link>
            </div>
        </div>

    )
}

export default BudgetList;
