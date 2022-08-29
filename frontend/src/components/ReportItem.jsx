import React from "react";
import { DateConvert } from "./utils/utils";

const ReportItem = (props) => {
    return (
        <div onClick={() => props.click(props.item)}  className={"double__button no__radius " + (props.item.economy < 0 ? "back__red" : "back__green")}>
            <div className="report__box transparent__color border__right">{DateConvert(props.item.operation_date)}</div>
            <div className="report__box transparent__color border__right">{(props.item.total_summ).toLocaleString()}</div>
            <div className="report__box transparent__color border__right">{(props.item.economy).toLocaleString()}</div>
            <div className={"report__box end__text " + (props.item.totalEconomy > 0 ? "green__color" : "red__color")}>{(props.item.totalEconomy).toLocaleString()}</div>
        </div>
    )
}

export default ReportItem;
