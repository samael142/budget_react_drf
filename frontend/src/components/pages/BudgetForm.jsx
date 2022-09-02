import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../API/ApiService";
import { MainContext } from "../../context";
import { GetCurrentDate } from "../utils/utils";

const BudgetForm = () => {

    const [budget, setBudget] = useState({
        name: "",
        plain_summ: "",
        start_date: GetCurrentDate(new Date()),
        end_date: GetCurrentDate(new Date()),
        category: ""
    })

    const { categories } = useContext(MainContext)

    const navigate = useNavigate()

    const navigateHome = () => {
        navigate('/settings/budget');
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        await ApiService.postBudget(budget)
        navigateHome()
    }

    return (
        <div>
            <div className="title__single">Новый бюджет</div>
            <br />
            <br />
            <form onSubmit={handleSubmit}>
                <input
                    onChange={e => setBudget({ ...budget, name: e.target.value })}
                    value={budget.name}
                    type="text" className="form__control" placeholder="Название" required />
                <h5 className="select__label">Категория</h5>
                <select
                    className="form__select"
                    style={{ backgroundImage: "url(/static/select.svg)" }}
                    onChange={e => setBudget({ ...budget, category: e.target.value })}
                    required>
                    <option value=''></option>
                    {categories.map((category) => <option value={category} key={category}>{category}</option>)}
                </select>
                <br />
                <input type="number" step="0.01" className="form__control"
                    placeholder="Планируемая сумма" value={budget.plain_summ} onChange={e => setBudget({ ...budget, plain_summ: e.target.value })} required />
                <br />
                <div className="tr__upper">
                    <input className="form__control form__sm row__2" type="date" value={budget.start_date}
                        onChange={e => setBudget({ ...budget, start_date: e.target.value })}
                        required />
                    <input className="form__control form__sm row__2" type="date" value={budget.end_date}
                        onChange={e => setBudget({ ...budget, end_date: e.target.value })}
                        required />
                </div>

                <div className="tr__upper tr__upper__left">
                    <input type="submit" className="btn btn__green" value="Отправить" />
                    <input type="button" className="btn btn__red" value="Закрыть" onClick={navigateHome} />
                </div>
            </form>
        </div>
    )
}

export default BudgetForm;
