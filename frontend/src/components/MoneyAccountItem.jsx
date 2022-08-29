import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const MoneyAccountItem = (props) => {

    const [isVisible, setIsVisible] = useState(props.moneyAccount.is_visible)
    const didMount = useRef(false);

    const handleClick = () => {
        setIsVisible(!isVisible)
    }

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
        } else {
            props.moneyAccount.is_visible = isVisible
            props.visibleClick(props.moneyAccount)
        }
    }, [isVisible])


    return (
        <div className={"double__button " + (isVisible ? "" : "past__color")}>
            <div
                onClick={handleClick}
                className="tr__box__acc black__color transparent__color">{props.moneyAccount.name}
            </div>
            <Link
                to={`/money_accounts/${props.moneyAccount.id}`}
                className={"tr__box__acc transparent__color " + (parseFloat(props.moneyAccount.sum) > 0 ? "green__color" : "red__color")}>{parseFloat(props.moneyAccount.sum).toLocaleString()}
            </Link>
        </div>
    )
}

export default MoneyAccountItem;
