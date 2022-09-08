import React from "react";
import { Link } from "react-router-dom";

const BudgetDetailItem = (props) => {
    return (
        <Link to={`/settings/budget/${props.budgetId}`}
            className={"tr__box " + (props.item[3] < 0 ? 'light__red ' : 'transfer__color ') + (props.item[6] ? 'border__5px' : '')}>
            <div className="tr__box__row budget__row">
                <div><b>{props.name}</b>&nbsp;&nbsp;Категория:&nbsp;{props.category}</div>
            </div>
            <div className="tr__box__row budget__row">
                <div>{props.item[4]}&nbsp;-&gt;&nbsp;{props.item[5]}</div>
            </div>
            <div className="tr__box__row budget__row">
                <div><b className={"font__13 " + (props.item[3] < 0 ? 'red__color' : 'green__color')}>{props.item[3].toLocaleString()}</b>&nbsp;</div>
                <div>(<span>{props.item[0].toLocaleString()}</span>&nbsp;+&nbsp;</div>
                <div><span>{props.item[2].toLocaleString()}</span>)&nbsp;</div>
                <div>+&nbsp;<span>{props.item[1].toLocaleString()}</span></div>
            </div>
        </Link>
    )
}

export default BudgetDetailItem;
