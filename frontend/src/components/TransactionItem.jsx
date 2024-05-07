import React from "react";
import { Link } from "react-router-dom";
import { DateConvert } from "./utils/utils";
import { useParams } from 'react-router-dom';

const TransactionItem = (props) => {

    const params = useParams()

    if (!props.transaction.transfer_id) {
        return (
            <Link to={`/transaction/${props.transaction.id}`}
                className={"tr__box " + (props.transaction.past ? "past__color" : "")}
                style={props.transaction.hide_from_report ? { background: '#00bcd438' } : {}}
            >
                <div className={"" + (props.transaction.operation_summ > 0 ? "tr__box__color__green" : "tr__box__color__red")}></div>
                <div className="tr__box__column">
                    <div className="tr__box__row">
                        <div><b>{props.transaction.header ? props.transaction.header.name : ""}</b>
                        </div>
                        <div className={"num " + (props.transaction.operation_summ > 0 ? "green__color" : "red__color")}>
                            {Math.abs(parseFloat(props.transaction.operation_summ)).toLocaleString("ru", { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div className="tr__box__row font__10">
                        <div>{props.transaction.category ? props.transaction.category.name : ""}</div>
                    </div>


                    <div className="tr__box__row font__10">
                        <div>{props.transaction.category ? props.transaction.subcategory.name : ""}</div>
                        <div>{props.transaction.account ? props.transaction.account.name : ""}</div>
                    </div>
                </div>
            </Link>
        );
    } else {
        return (
            params.accountId
                ?
                <Link to={`/transfer/${props.transaction.transfer_id}`}
                    className="transition__item tr__box transfer__color">
                    <div className={"" + (props.transaction.operation_summ > 0 ? "tr__box__color__green" : "tr__box__color__red")}></div>
                    <div className="tr__box__column">
                        <div className="tr__box__row">
                            <div><b>{props.transaction.comment}</b>
                            </div>
                            <div className={"num " + (props.transaction.operation_summ > 0 ? "green__color" : "red__color")}>
                                {Math.abs(parseFloat(props.transaction.operation_summ)).toLocaleString("ru", { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="tr__box__row">
                            <div>Перевод</div>
                        </div>
                    </div>
                </Link>
                :
                props.transaction.operation_summ > 0 ?
                    <Link to={`/transfer/${props.transaction.transfer_id}`}
                        className="transition__item tr__box transfer__color">
                        <div className="tr__box__color__gradient"></div>
                        <div className="tr__box__column">
                            <div className="tr__box__row">
                                <div><b>{props.transaction.comment}</b>
                                </div>
                                <div className="black__color">
                                    {parseFloat(props.transaction.operation_summ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                                </div>

                            </div>
                            <div className="tr__box__row">
                                <div>Перевод</div>
                            </div>
                        </div>
                    </Link>
                    : <></>
        )
    }
};

export default TransactionItem;
