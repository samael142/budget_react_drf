import React, { useContext, useEffect } from "react";
import ApiService from "../API/ApiService";
import { MainContext } from "../../context";
import MoneyAccountItem from "../MoneyAccountItem";
import { Link } from "react-router-dom";


const MoneyAccounts = (props) => {

    const { moneyAccounts, setMoneyAccounts } = useContext(MainContext)

    useEffect(() => {
        props.getMoneyAccountsList()
    }, [])



    const handleClick = async (moneyAccount) => {
        await ApiService.patchMoneyAccount(moneyAccount, moneyAccount.id)
        setMoneyAccounts(current =>
            current.map(obj => {
                if (obj.id === moneyAccount.id) {
                    return { ...obj, is_visible: moneyAccount.is_visible };
                }
                return obj;
            }),
        );
    }

    return (
        <div>
            {moneyAccounts.map(moneyAccount => <MoneyAccountItem moneyAccount={moneyAccount} key={moneyAccount.id} visibleClick={handleClick} />)}
            <br />
            <div className="single__element__center">
                <Link to="/money_accounts/new" className="footer__button">Добавить счёт</Link>
            </div>
            <div className="clear__block"></div>
        </div>
    )

}

export default MoneyAccounts;
