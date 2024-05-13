import React from "react";
import { DateConvert, GetWeekDay } from "./utils/utils";
import { useNavigate } from "react-router-dom";


const BudgetItem = (props) => {

    const navigate = useNavigate()

    const handleClick = (event) => {
        event.preventDefault()
        navigate("/settings/budget/detail", { state: props.budget })
    }

    return (
        <div className="tr__box">
        <div className="tr__box__column" onClick={handleClick}>
            <div className="tr__box__row">
                <div><b>{props.budget.name}</b></div>
            </div>
            <div className="tr__box__row">
                <div>{GetWeekDay(props.budget.start_date)},&nbsp;{DateConvert(props.budget.start_date)}&nbsp;-&nbsp;{GetWeekDay(props.budget.end_date)},&nbsp;{DateConvert(props.budget.end_date)}</div>
            </div>
            <div className="tr__box__row">
                <div>Категория:&nbsp;{props.budget.category.name}</div>
            </div>
        </div>
        </div>
    )
}

export default BudgetItem;
