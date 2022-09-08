import React, { useState, useEffect, useContext } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from "../API/ApiService";
import NewEntryHead from "../NewEntryHead";
import { MainContext } from "../../context";
import { GetCurrentDate } from "../utils/utils";

const PlainOperationForm = () => {

    const params = useParams()
    console.log(params);

    const { headers, categories, subcategories,
        setOnScreenDate, setHeaders, setCategories, setSubcategories } = useContext(MainContext)

    const navigate = useNavigate();

    const [transaction, setTransaction] = useState({
        operation_date: GetCurrentDate(new Date()),
        operation_summ: '',
        period: 'once',
        quantity: '1',
        header: '',
        category: '',
        subcategory: '',
        comment: ''
    })
    const [endDate, setEndDate] = useState(GetCurrentDate(new Date()))
    // const [lastHeader, setLastHeader] = useState()
    const [operationType, setOperationType] = useState('out')
    // const debValue = useDebounce(transaction.header, 500)

    // useEffect(() => {
    //     searchExsistingHeader(debValue)
    // }, [debValue])

    // useEffect(() => {
    //     autosetTransactionFields()
    // }, [lastHeader])

    const navigateHome = () => {
        setOnScreenDate(new Date())
        navigate('/');
    };

    // const searchExsistingHeader = (header) => {
    //     let capHeader = header.charAt(0).toUpperCase() + header.slice(1);
    //     let searchingExsistingHeader = headers.find(o => o === capHeader)
    //     if (searchingExsistingHeader) {
    //         setLastHeader(searchingExsistingHeader)
    //     }
    // }

    // const autosetTransactionFields = async () => {
    //     if (lastHeader) {
    //         const lastTransaction = await ApiService.getLastHeaderTransaction(lastHeader)
    //         if (lastTransaction.data.header.name) {
    //             setTransaction({
    //                 ...transaction,
    //                 header: lastTransaction.data.header.name,
    //                 category: lastTransaction.data.category.name,
    //                 subcategory: lastTransaction.data.subcategory.name
    //             })
    //         }
    //     }
    // }

    const summConvert = (summ) => {
        if (operationType === "out") {
            return "-" + summ
        }
        return summ
    }

    const calculateQuanityDays = (startDate, endDate) => {
        return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    }

    const calculateQuanityMonths = (startDate, endDate) => {
        let delta = 1
        if (startDate.getDate() > endDate.getDate()) { delta = 0 }
        let months;
        months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        months -= startDate.getMonth();
        months += endDate.getMonth();
        months += delta
        return months <= 0 ? 1 : months;
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
        switch (transaction.period) {
            case 'once':
                transactionForSave.quantity = 1
                break;
            case 'daily':
                transactionForSave.quantity = calculateQuanityDays(new Date(transaction.operation_date), new Date(endDate))
                break;
            case 'monthly':
                transactionForSave.quantity = calculateQuanityMonths(new Date(transaction.operation_date), new Date(endDate))
                break;
            default:
                break;
        }
        ApiService.postPlainOperation(transactionForSave)
        addNewTransactionParameters(transactionForSave.header, transactionForSave.category, transactionForSave.subcategory)
        setTimeout(() => {
            navigateHome()
        }, 300);
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
            <NewEntryHead element={'plain'} />
            <form onSubmit={handleSubmit}>
                <div className="tr__upper">
                    <input className="form__control form__sm row__2" type="date" name="operation_date"
                        onChange={e => setTransaction({ ...transaction, operation_date: e.target.value })}
                        value={transaction.operation_date} />
                    <select
                        onChange={e => setOperationType(e.target.value)}
                        defaultValue="out" className="form__select form__sm row__2" name="operation_type" style={{ backgroundImage: "url(/static/select.svg)" }}>
                        <option value="out">Расход</option>
                        <option value="in">Приход</option>
                    </select>
                </div>

                <div className="tr__upper">
                    <input className="form__control form__sm row__2" type="date" name="operation_date"
                        onChange={e => setEndDate(e.target.value)}
                        value={endDate} />
                    <select
                        onChange={e => setTransaction({ ...transaction, period: e.target.value })}
                        defaultValue={transaction.period} className="form__select form__sm row__2" name="operation_type" style={{ backgroundImage: "url(/static/select.svg)" }}>
                        <option value="once">Разовая</option>
                        <option value="daily">Ежедневная</option>
                        <option value="monthly">Ежемесячная</option>
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
                <button type="submit" className="btn btn__green">Отправить</button>
                <button type="button" onClick={navigateHome} className="btn btn__red">Закрыть</button>
            </form>
        </>
    )
}

export default PlainOperationForm;
