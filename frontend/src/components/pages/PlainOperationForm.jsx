import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from "../API/ApiService";
import NewEntryHead from "../NewEntryHead";
import { MainContext } from "../../context";
import { GetCurrentDate } from "../utils/utils";
import DataList from "../DatalistV2";

const PlainOperationForm = () => {

    const periodObject = {
        once: 'Разовая',
        daily: 'Ежедневная',
        monthly: 'Ежемесячная'
    }

    const params = useParams()

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
    const [operationType, setOperationType] = useState('out')
    const [disabledHead, setDisabledHead] = useState(false)

    const readEditableTransaction = async () => {
        const editableTransaction = await ApiService.getPlainOperationById(params.plainOperationId)
        const plainTransactions = await ApiService.getPlainTransactions(params.plainOperationId)
        setEndDate(plainTransactions[1].operation_date)
        setDisabledHead(true)
        setTransaction({
            ...transaction,
            operation_date: plainTransactions[0].operation_date,
            operation_summ: Math.abs(parseFloat(editableTransaction.operation_summ)),
            period: editableTransaction.period,
            header: editableTransaction.header,
            category: editableTransaction.category,
            subcategory: editableTransaction.subcategory,
            comment: editableTransaction.comment
        })
        parseFloat(editableTransaction.operation_summ) < 0
            ? setOperationType('out')
            : setOperationType('in')
    }

    useEffect(() => {
        if (params.plainOperationId) {
            readEditableTransaction()
        };
    }, [])

    useEffect(() => {
        const el = document.getElementById("main__menu");
        el.classList.toggle("hide");
        return () => {
            el.classList.toggle("hide");
        }
    }, [])


    const navigateHome = () => {
        setOnScreenDate(new Date())
        navigate('/');
    };

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

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (params.plainOperationId) {
            await ApiService.deletePlainOperation(params.plainOperationId)
        }
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
        await ApiService.postPlainOperation(transactionForSave)
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

    const deletePlainOperation = async () => {
        await ApiService.deletePlainOperation(params.plainOperationId)
        navigateHome()
    }

    return (
        <>
            <NewEntryHead element={'plain'} disabled={disabledHead} />
            <form onSubmit={handleSubmit}>
                <div className="tr__upper">
                    <input className="form__control form__sm row__2" type="date" name="operation_date"
                        onChange={e => setTransaction({ ...transaction, operation_date: e.target.value })}
                        value={transaction.operation_date}
                    />
                    <select
                        onChange={e => setOperationType(e.target.value)}
                        disabled={params.plainOperationId ? true : false}
                        defaultValue="out" className="form__select form__sm row__2" name="operation_type" style={{ backgroundImage: "url(/static/select.svg)" }}>
                        <option value={operationType}>
                            {operationType === 'out' ? 'Расход' : 'Приход'}
                        </option>
                        <option value="out">Расход</option>
                        <option value="in">Приход</option>
                    </select>
                </div>

                <div className="tr__upper">
                    <input className="form__control form__sm row__2" type="date" name="operation_date" id="endDate"
                        onChange={e => setEndDate(e.target.value)}
                        value={endDate}
                    />
                    <select id="period"
                        onChange={e => setTransaction({ ...transaction, period: e.target.value })}
                        disabled={params.plainOperationId ? true : false}
                        defaultValue={transaction.period} className="form__select form__sm row__2" name="operation_type" style={{ backgroundImage: "url(/static/select.svg)" }}>
                        {params.plainOperationId && <option value={transaction.period}>{periodObject[transaction.period]}</option>}
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
                {/* <input onFocus={(event) => { event.target.select() }}
                    type="text" name="header"
                    className="form__control form__sm" list="headers"
                    placeholder="Заголовок"
                    value={transaction.header} required
                    disabled={params.plainOperationId ? true : false}
                    onChange={e => setTransaction({ ...transaction, header: e.target.value })} />
                <datalist id="headers">
                    {headers.map((header) => <option value={header} key={header} />)}
                </datalist> */}
                <DataList
                    items={headers}
                    name='header'
                    value={transaction.header}
                    placeholder='Заголовок'
                    transaction={transaction}
                    func={setTransaction}
                />
                <br />
                {/* <input onFocus={(event) => { event.target.select() }}
                    type="text" name="category"
                    className="form__control form__sm" list="categories"
                    placeholder="Категория"
                    value={transaction.category} required
                    disabled={params.plainOperationId ? true : false}
                    onChange={e => setTransaction({ ...transaction, category: e.target.value })} />
                <datalist id="categories">
                    {categories.map((category) => <option value={category} key={category} />)}
                </datalist> */}
                <DataList
                    items={categories}
                    name='category'
                    value={transaction.category}
                    placeholder='Категория'
                    transaction={transaction}
                    func={setTransaction}
                />
                <br />
                {/* <input onFocus={(event) => { event.target.select() }}
                    type="text" name="subcategory"
                    className="form__control form__sm" list="subcategories"
                    placeholder="Подкатегория"
                    value={transaction.subcategory} required
                    disabled={params.plainOperationId ? true : false}
                    onChange={e => setTransaction({ ...transaction, subcategory: e.target.value })} />
                <datalist id="subcategories">
                    {subcategories.map((subcategory) => <option value={subcategory} key={subcategory} />)}
                </datalist> */}
                <DataList
                    items={subcategories}
                    name='subcategory'
                    value={transaction.subcategory}
                    placeholder='Подкатегория'
                    transaction={transaction}
                    func={setTransaction}
                />
                <br />
                <input type="text" name="comment" className="form__control form__sm" placeholder="Комментарий"
                    disabled={params.plainOperationId ? true : false}
                    onChange={e => setTransaction({ ...transaction, comment: e.target.value })}
                    value={transaction.comment} />
                <br />
                <button type="submit" className="btn btn__green">Отправить</button>
                {params.plainOperationId
                    ? <button type="button" onClick={deletePlainOperation} className="btn btn__red">Удалить</button>
                    : <></>
                }
                <button type="button" onClick={navigateHome} className="btn btn__red">Закрыть</button>


                {/* <button type="submit" className="btn btn__green">Отправить</button>
                <button type="button" onClick={navigateHome} className="btn btn__red">Закрыть</button> */}
            </form>
        </>
    )
}

export default PlainOperationForm;
