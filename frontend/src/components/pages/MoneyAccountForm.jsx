import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../API/ApiService";

const MoneyAccountForm = (props) => {

    const [moneyAccount, setMoneyAccount] = useState({
        name: "",
        currency: "1"
    })

    const navigate = useNavigate()

    const navigateHome = () => {
        navigate('/');
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        await ApiService.postMoneyAccount(moneyAccount)
        props.getMoneyAccountsList()
        navigateHome()
    }

    return (
        <div>
            <div className="title__single">Новый счёт</div>
            <br />
            <br />
            <form onSubmit={handleSubmit}>
                <input
                    onChange={e => setMoneyAccount({ ...moneyAccount, name: e.target.value })}
                    value={moneyAccount.name}
                    type="text" className="form__control" placeholder="Название" required />
                <br />
                <br />
                <div className="tr__upper tr__upper__left">
                    <input type="submit" className="btn btn__green" value="Отправить" />
                    <input type="button" className="btn btn__red" value="Закрыть" onClick={navigateHome} />
                </div>
            </form>
        </div>
    )
}

export default MoneyAccountForm;
