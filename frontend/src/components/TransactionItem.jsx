import React from "react";
import { Link } from "react-router-dom";
import { DateConvert } from "./utils/utils";
import { useParams } from 'react-router-dom';

const TransactionItem = (props) => {

    const params = useParams()

    if (!props.transaction.transfer_id) {
        return (
            <Link to={`/transaction/${props.transaction.id}`}
                className={"transition__item tr__box " + (props.transaction.past ? "past__color" : "")}
                style={props.transaction.hide_from_report ? { background: '#00bcd438' } : {}}
            >
                <div className="tr__box__row">
                    <div><b>{props.transaction.header ? props.transaction.header.name : ""}</b>
                    </div>
                    <div className={"num " + (props.transaction.operation_summ > 0 ? "green__color" : "red__color")}>
                        {parseFloat(props.transaction.operation_summ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="tr__box__row">
                    <div>{props.transaction.category ? props.transaction.category.name : ""}</div>
                    <div>{props.transaction.account ? props.transaction.account.name : ""}</div>
                </div>
                <div className="tr__box__row">
                    <div>{props.transaction.subcategory ? props.transaction.subcategory.name : ""}</div>
                    <div>{DateConvert(props.transaction.operation_date)}</div>
                </div>
            </Link>
        );
    } else {
        return (
            params.accountId
                ?
                <Link to={`/transfer/${props.transaction.transfer_id}`}
                    className="transition__item tr__box transfer__color">
                    <div className="tr__box__row">
                        <div><b>{props.transaction.comment}</b>
                        </div>
                        <div className={(props.transaction.operation_summ > 0 ? "green__color" : "red__color")}>
                            {parseFloat(props.transaction.operation_summ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="tr__box__row">
                        <div>Перевод</div>
                        <div>{DateConvert(props.transaction.operation_date)}</div>
                    </div>
                </Link>
                :
                props.transaction.operation_summ > 0 ?
                    <Link to={`/transfer/${props.transaction.transfer_id}`}
                        className="transition__item tr__box transfer__color">
                        <div className="tr__box__row">
                            <div><b>{props.transaction.comment}</b>
                            </div>
                            <div className="black__color">
                                {parseFloat(props.transaction.operation_summ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="tr__box__row">
                            <div>Перевод</div>
                            <div>{DateConvert(props.transaction.operation_date)}</div>
                        </div>
                    </Link>
                    : <></>
        )
    }
};

export default TransactionItem;
