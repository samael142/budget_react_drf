import React, { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from 'react-router-dom';
import ApiService from "./API/ApiService";

const TransactionForm = ({ headers, categories, subcategories, moneyAccounts,
    setOnScreenDate, setHeaders, setCategories, setSubcategories }) => {

    const navigate = useNavigate();

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

    const initialState = {
        operation_date: transaction.operation_date,
        operation_summ: '',
        account: transaction.account,
        header: '',
        category: '',
        subcategory: '',
        comment: ''
    }

    const [lastHeader, setLastHeader] = useState()
    const [operationType, setOperationType] = useState('out')
    const debValue = useDebounce(transaction.header, 500)

    useEffect(() => {
        searchExsistingHeader(debValue)
    }, [debValue])

    useEffect(() => {
        autosetTransactionFields()
    }, [lastHeader])

    const navigateHome = () => {
        setOnScreenDate(new Date())
        navigate('/');
    };

    const searchExsistingHeader = (header) => {
        let capHeader = header.charAt(0).toUpperCase() + header.slice(1);
        let searchingExsistingHeader = headers.find(o => o === capHeader)
        if (searchingExsistingHeader) {
            setLastHeader(searchingExsistingHeader)
        }
    }

    const autosetTransactionFields = async () => {
        if (lastHeader) {
            const lastTransaction = await ApiService.getLastHeaderTransaction(lastHeader)
            if (lastTransaction.data.header.name) {
                setTransaction({
                    ...transaction,
                    header: lastTransaction.data.header.name,
                    category: lastTransaction.data.category.name,
                    subcategory: lastTransaction.data.subcategory.name
                })
            }
        }
    }

    const summConvert = (summ) => {
        if (operationType === "out") {
            return "-" + summ
        }
        return summ
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const transactionForSave = {
            ...transaction,
            operation_summ: summConvert(transaction.operation_summ),
            header: transaction.header.charAt(0).toUpperCase() + transaction.header.slice(1).trim(),
            category: transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1).trim(),
            subcategory: transaction.subcategory.charAt(0).toUpperCase() + transaction.subcategory.slice(1).trim()
        }
        ApiService.postTransaction(transactionForSave)
        addNewTransactionParameters(transactionForSave.header, transactionForSave.category, transactionForSave.subcategory)
        if (event.nativeEvent.submitter.name === 'add') {
            navigateHome()
        } else {
            setTransaction({ ...initialState })
        }
    }

    const addNewTransactionParameters = (header, category, subcategory) => {
        if (!headers.includes(header)) {
            setHeaders([...headers, header])
        }
        if (!categories.includes(category)) {
            setCategories([...categories, category])
        }
        if (!subcategories.includes(subcategory)) {
            setSubcategories([...subcategories, subcategory])
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
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
                        value={transaction.operation_summ}
                        type="number" step="0.01" name="operation_summ" className="form__control form__sm" placeholder="Сумма"
                        required />
                    <input id="showCalculator" className="form__control" type="button" value="->"></input>
                </div>

                <h5 className="select__label">Счёт</h5>
                <select
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
                    {headers.map((header) => <option value={header} key={header} />)}
                </datalist>
                <br />
                <input onFocus={(event) => { event.target.select() }}
                    type="text" name="category"
                    className="form__control form__sm" list="categories"
                    placeholder="Категория"
                    value={transaction.category} required
                    onChange={e => setTransaction({ ...transaction, category: e.target.value })} />
                <datalist id="categories">
                    {categories.map((category) => <option value={category} key={category} />)}
                </datalist>
                <br />
                <input onFocus={(event) => { event.target.select() }}
                    type="text" name="subcategory"
                    className="form__control form__sm" list="subcategories"
                    placeholder="Подкатегория"
                    value={transaction.subcategory} required
                    onChange={e => setTransaction({ ...transaction, subcategory: e.target.value })} />
                <datalist id="subcategories">
                    {subcategories.map((subcategory) => <option value={subcategory} key={subcategory} />)}
                </datalist>
                <br />
                <input type="text" name="comment" className="form__control form__sm" placeholder="Комментарий"
                    onChange={e => setTransaction({ ...transaction, comment: e.target.value })}
                    value={transaction.comment} />
                <br />
                <button type="submit" name="add" className="btn btn__green">Отправить</button>
                <button type="submit" name="copy" className="btn btn__green">+Отправить</button>
                <button type="button" onClick={navigateHome} className="btn btn__red">Закрыть</button>
            </form>
        </>
    )
}

export default TransactionForm;
