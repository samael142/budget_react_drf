import React from "react";
import DateConvert from "./DateConverter";

const TotalItem = (props) => {

    return (
        <div className={"transition__item total__box " + (props.total.operation_date === props.currentDate ? "current__date" : "")}>
            <div className="t__left">
                <div className="t__int">{DateConvert(props.total.operation_date)}&nbsp;</div>
                <div className="t__str">{props.total.day}</div>
            </div>
            <div className="t__right">
                <div className="t__str">Баланс:&nbsp;</div>
                <div className={"t__int " + (props.total.total > 0 ? "green__color" : "red__color")}>
                    {parseFloat(props.total.total).toLocaleString()}
                </div>
            </div>
        </div>
    )
}

export default TotalItem;