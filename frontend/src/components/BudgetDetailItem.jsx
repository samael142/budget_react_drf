import React from "react";

const BudgetDetailItem = (props) => {
    return (
        <div
            className={"tr__box " + (props.item[3] < 0 ? 'light__red ' : 'transfer__color ') + (props.item[6] ? 'border__5px' : '')}>
            <div className="tr__box__row budget__row">
                <div><b>{props.name}</b>&nbsp;&nbsp;Категория:&nbsp;{props.category}</div>
            </div>
            <div className="tr__box__row budget__row">
                <div>{props.item[4]}&nbsp;-&gt;&nbsp;{props.item[5]}</div>
            </div>
            <div className="tr__box__row budget__row">
                <div><b className={"font__13 " + (props.item[3] < 0 ? 'red__color' : 'green__color')}>{props.item[3]}</b>&nbsp;</div>
                <div>(<span>{props.item[0]}</span>&nbsp;+&nbsp;</div>
                <div><span>{props.item[2]}</span>)&nbsp;</div>
                <div>+&nbsp;<span>{props.item[1]}</span></div>
            </div>
        </div>
    )
}

export default BudgetDetailItem;
