import React, { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";

const TransactionForm = ({ headers, categories, subcategories, moneyAccounts }) => {

    const currentDate = new Date()
    const yyyy = currentDate.getFullYear()
    const mm = currentDate.getMonth() + 1
    const dd = currentDate.getDate()
    const stringDate = [yyyy, (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join("-")


    const [transaction, setTransaction] = useState({
        operation_date: stringDate,
        operation_summ: '',
        account: '',
        header: '',
        category: '',
        subcategory: '',
        comment: ''
    })
    const [operationType, setOperationType] = useState('out')
    const debValue = useDebounce(transaction.header, 1000)

    useEffect(() => {
        console.log(debValue)
    }, [debValue])

    const summComvert = (summ) => {
        if (operationType === "out") {
            return "-" + summ
        }
        return summ
    }

    return (
        <>
            <div className="title__single">Транзакция</div>
            <form>
                <div className="tr__upper">
                    <input className="form__control form__sm row__2" type="date" id="start" name="operation_date"
                        onChange={e => setTransaction({ ...transaction, operation_date: e.target.value })}
                        value={transaction.operation_date} />
                    <select
                        onChange={e => setOperationType(e.target.value)}
                        defaultValue="out" className="form__select form__sm row__2" name="operation_type" style={{ backgroundImage: "url(/static/select.svg)" }}>
                        <option value="out">Расход</option>
                        <option value="in">Приход</option>
                    </select>
                </div>
                <hr className="top__hr" />
                <div className="input__group">
                    <input onFocus={(event) => { event.target.select() }}
                        onChange={e => setTransaction({ ...transaction, operation_summ: e.target.value })}
                        type="number" step="0.01" name="operation_summ" className="form__control form__sm" placeholder="Сумма"
                        required />
                    <input id="showCalculator" className="form__control" type="button" value="->"></input>
                </div>

                <h5 className="select__label">Счёт</h5>
                <select
                    name="account"
                    className="form__select form__sm"
                    style={{ backgroundImage: "url(/static/select.svg)" }}
                    onChange={e => setTransaction({ ...transaction, account: e.target.value })}
                    defaultValue="">
                    <option value="" disabled />
                    {moneyAccounts.map((account) => <option value={account.id} key={account.id}>{account.name}</option>)}
                </select>
                <br />
                <input onFocus={(event) => { event.target.select() }}
                    type="text" name="header"
                    className="form__control form__sm" list="headers"
                    placeholder="Заголовок"
                    value={transaction.header} required
                    onChange={e => setTransaction({ ...transaction, header: e.target.value })} />
                <datalist id="headers">
                    {headers.map((header) => <option value={header.name} key={header.name} />)}
                </datalist>
                <br />
                <input onFocus={(event) => { event.target.select() }} type="text" name="category" className="form__control form__sm" list="categories"
                    placeholder="Категория" value={transaction.category} required onChange={e => setTransaction({ ...transaction, category: e.target.value })} />
                <datalist id="categories">
                    {categories.map((category) => <option value={category.name} key={category.name} />)}
                </datalist>
                <br />
                <input onFocus={(event) => { event.target.select() }} type="text" name="subcategory" className="form__control form__sm" list="subcategories"
                    placeholder="Подкатегория" value={transaction.subcategory} required onChange={e => setTransaction({ ...transaction, subcategory: e.target.value })} />
                <datalist id="subcategories">
                    {subcategories.map((subcategory) => <option value={subcategory.name} key={subcategory.name} />)}
                </datalist>
                <br />

                <input type="text" name="comment" className="form__control form__sm" placeholder="Комментарий"
                    onChange={e => setTransaction({ ...transaction, comment: e.target.value })}
                    value={transaction.comment} />
                <br />
            </form>
        </>
    )
}

export default TransactionForm;
