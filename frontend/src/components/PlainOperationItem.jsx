import React from "react";
import { DateConvert } from "./utils/utils";
import { Link } from "react-router-dom";


const PlainOperationItem = (props) => {

    return (
        <Link to={`/settings/past/${props.plainOperation.id}`}
        className={"tr__box " + (props.plainOperation.disabled ? 'past__color' : '')}>
            <div className="tr__box__row">
                <div className="tr__box__row__left">{props.plainOperation.header}</div>
                <div className={"tr__box__row__right " + (props.plainOperation.summ > 0 ? 'green__color' : 'red__color')}>
                    {props.plainOperation.summ.toLocaleString("ru",{minimumFractionDigits: 2})}
                </div>
            </div>
            <div className="tr__box__row">
                <div className="tr__box__row__left">{props.plainOperation.category}</div>
                <div className="tr__box__row__right">Ближ: {DateConvert(props.plainOperation.curr_date)}</div>
            </div>
            <div className="tr__box__row">
                <div className="tr__box__row__left">{props.plainOperation.subcategory}</div>
                <div className="tr__box__row__right">Посл: {DateConvert(props.plainOperation.end_date)}</div>
            </div>
        </Link>
    )
}

export default PlainOperationItem;
