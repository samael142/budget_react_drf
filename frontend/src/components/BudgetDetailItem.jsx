import React from "react";
import { Link } from "react-router-dom";

const BudgetDetailItem = (props) => {
    return (
        <div className="tr__box">
        <div className={"" + (props.item[3] > 0 ? "tr__box__color__green" : "tr__box__color__red")}></div>
        <Link to={`/settings/budget/${props.budgetId}`}
            className={"tr__box__column " + (props.item[6] ? 'border__5px' : '')}>
            <div className="tr__box__row budget__row">
                <div><b>{props.name}</b>&nbsp;&nbsp;Категория:&nbsp;{props.category}</div>
            </div>
            <div className="tr__box__row budget__row">
                <div>{props.item[4]}&nbsp;-&gt;&nbsp;{props.item[5]}</div>
            </div>
            <div className="tr__box__row budget__row">
                <div><b className={"font__13 " + (props.item[3] < 0 ? 'red__color' : 'green__color')}>{props.item[3].toLocaleString("ru",{minimumFractionDigits: 2})}</b>&nbsp;</div>
                <div>(<span>{props.item[0].toLocaleString("ru",{minimumFractionDigits: 2})}</span>&nbsp;+&nbsp;</div>
                <div><span>{props.item[2].toLocaleString("ru",{minimumFractionDigits: 2})}</span>)&nbsp;</div>
                <div>+&nbsp;<span>{props.item[1].toLocaleString("ru",{minimumFractionDigits: 2})}</span></div>
            </div>
        </Link>
        </div>
    )
}

export default BudgetDetailItem;
