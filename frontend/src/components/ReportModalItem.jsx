import React from "react";
import { DateConvert } from "./utils/utils";

const ReportModalItem = (props) => {
    return (
        <div className="tr__box height__63 no__shadow">
            <div className="tr__box__row">
                <div><b>{props.item.header.name}</b></div>
                <div className={"num " + (parseFloat(props.item.operation_summ) > 0 ? "green__color" : "red__color")}>{parseFloat(props.item.operation_summ).toLocaleString()}</div>
            </div>
            <div className="tr__box__row">
                <div>{props.item.category.name}</div>
                <div>{props.item.account.name}</div>
            </div>
            <div className="tr__box__row">
                <div>{props.item.subcategory.name}</div>
                <div>{DateConvert(props.item.operation_date)}</div>
            </div>
        </div>
    )
}

export default ReportModalItem;
