import React from "react";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../API/ApiService";
import { MainContext } from "../../context";
import { GetCurrentDate } from "../utils/utils";

const BudgetForm = () => {

    const params = useParams();
    const [budget, setBudget] = useState({
        name: "",
        plain_summ: "",
        start_date: GetCurrentDate(new Date()),
        end_date: GetCurrentDate(new Date()),
        category: ""
    })

    useEffect(() => {
        if (params.budgetId) {
            readEditableBudget()
        };
    }, [])

    const readEditableBudget = async () => {
        const editableBudget = await ApiService.getBudgetById(params.budgetId)
        setBudget({
            ...budget,
            name: editableBudget.name,
            plain_summ: editableBudget.plain_summ,
            start_date: editableBudget.start_date,
            end_date: editableBudget.end_date,
            category: editableBudget.category
        })
    }

    const { categories } = useContext(MainContext)

    const navigate = useNavigate()

    const navigateHome = () => {
        navigate('/settings/budget');
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (params.budgetId) {
            await ApiService.patchBudget(budget, params.budgetId)
        } else {
            await ApiService.postBudget(budget)
        }
        navigateHome()
    }

    const deleteBudget = async () => {
        await ApiService.deleteBudget(params.budgetId)
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
                    <option value={budget.category}>{budget.category}</option>
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
                    {params.budgetId
                        ? <button type="button" onClick={deleteBudget} className="btn btn__red">Удалить</button>
                        : <></>
                    }
                    <input type="button" className="btn btn__red" value="Закрыть" onClick={navigateHome} />
                </div>
            </form>
        </div>
    )
}

export default BudgetForm;
