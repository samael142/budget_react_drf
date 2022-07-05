import React from "react";
import DateConvert from "./DateConverter";

const TransactionItem = (props) => {
    if (!props.transaction.transfer_id) {
        return (
            <div onClick={() => console.log(props.transaction.id)} className={"tr__box " + (props.transaction.past ? "past__color" : "")}>
                <div className="tr__box__row">
                    <div><b>{props.transaction.header ? props.transaction.header.name : ""}</b>
                    </div>
                    <div className={"num " + (props.transaction.operation_summ > 0 ? "green__color" : "red__color")}>{parseFloat(props.transaction.operation_summ).toLocaleString()}</div>
                </div>
                <div className="tr__box__row">
                    <div>{props.transaction.category ? props.transaction.category.name : ""}</div>
                    <div>{props.transaction.account ? props.transaction.account.name : ""}</div>
                </div>
                <div className="tr__box__row">
                    <div>{props.transaction.subcategory ? props.transaction.subcategory.name : ""}</div>
                    <div>{DateConvert(props.transaction.operation_date)}</div>
                </div>
            </div>
        );
    } else {
        return (
            <div onClick={() => console.log(props.transaction.transfer_id)} className="tr__box transfer__color">
                <div className="tr__box__row">
                    <div><b>{props.transaction.comment}</b>
                    </div>
                    <div className={"num " + (props.transaction.operation_summ > 0 ? "green__color" : "red__color")}>{parseFloat(props.transaction.operation_summ).toLocaleString()}</div>
                </div>
                <div className="tr__box__row">
                    <div>{props.transaction.account ? props.transaction.account.name : ""}</div>
                    <div>{DateConvert(props.transaction.operation_date)}</div>
                </div>
            </div>
        )
    }
};

export default TransactionItem;
