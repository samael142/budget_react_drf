import React, { useState, useEffect, useLayoutEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from "../API/ApiService";
import NewEntryHead from "../NewEntryHead";
import { useContext } from "react";
import { MainContext } from "../../context";
import { GetCurrentDate } from "../utils/utils";
import Calculator from "../calculator/calculator";
import DataList from "../DatalistV2";
import Select from "../Select";

const TransactionForm = () => {

    let params = useParams();

    const readEditableTransaction = async () => {
        const editablTransaction = await ApiService.getTransactionById(params.transactionId)
        setDisabledHead(true)
        setTransaction({
            ...transaction,
            operation_date: editablTransaction.data.operation_date,
            operation_summ: Math.abs(parseFloat(editablTransaction.data.operation_summ)),
            account: editablTransaction.data.account !== null
                ? editablTransaction.data.account.id
                : '',
            header: editablTransaction.data.header.name,
            category: editablTransaction.data.category.name,
            subcategory: editablTransaction.data.subcategory.name,
            comment: editablTransaction.data.comment,
            past: editablTransaction.data.past,
            plain_id: editablTransaction.data.plain_id,
            hide_from_report: editablTransaction.data.hide_from_report
        })
        if (editablTransaction.data.account) {
            setSelectedAccountName(editablTransaction.data.account.name)
        }
        parseFloat(editablTransaction.data.operation_summ) < 0
            ? setOperationType('out')
            : setOperationType('in')
    }

    useLayoutEffect(() => {
        if (params.transactionId) {
            readEditableTransaction()
        };
    }, [])

    const { headers, categories, subcategories, moneyAccounts,
        setOnScreenDate, setHeaders, setCategories, setSubcategories } = useContext(MainContext)

    const navigate = useNavigate();

    // const currentDate = new Date()
    // const yyyy = currentDate.getFullYear()
    // const mm = currentDate.getMonth() + 1
    // const dd = currentDate.getDate()
    // const stringDate = [yyyy, (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join("-")


    const [transaction, setTransaction] = useState({
        operation_date: GetCurrentDate(new Date()),
        operation_summ: '',
        account: '',
        header: '',
        category: '',
        subcategory: '',
        comment: '',
        past: false,
        plain_id: '',
        hide_from_report: false,
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
    const [selectedAccountName, setSelectedAccountName] = useState("")
    const [activate, setActivate] = useState(transaction.past)
    const [disabledHead, setDisabledHead] = useState(false)
    const [showCalculator, setShowCalculator] = useState(false)
    const debValue = useDebounce(transaction.header, 200)

    useEffect(() => {
        searchExsistingHeader(debValue)
    }, [debValue])

    useEffect(() => {
        autosetTransactionFields()
    }, [lastHeader])

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

    const searchExsistingHeader = (header) => {
        let capHeader = header.charAt(0).toUpperCase() + header.slice(1);
        let searchingExsistingHeader = headers.find(o => o === capHeader)
        if (searchingExsistingHeader) {
            setLastHeader(searchingExsistingHeader)
        }
    }

    const toggleCalculator = () => {
        setShowCalculator(!showCalculator)
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

    const handleSubmit = async (event) => {
        event.preventDefault()
        const transactionForSave = {
            ...transaction,
            operation_summ: summConvert(transaction.operation_summ),
            header: transaction.header.charAt(0).toUpperCase() + transaction.header.slice(1).trim(),
            category: transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1).trim(),
            subcategory: transaction.subcategory.charAt(0).toUpperCase() + transaction.subcategory.slice(1).trim()
        }
        if (activate && transactionForSave.past) {
            transactionForSave.past = false
            transactionForSave.plain_id = ''
        } else if (activate) {
            transactionForSave.past = true
            transactionForSave.account = null
        }
        if (params.transactionId) {
            await ApiService.patchTransaction(transactionForSave, params.transactionId)
        } else {
            await ApiService.postTransaction(transactionForSave)
        }
        addNewTransactionParameters(transactionForSave.header, transactionForSave.category, transactionForSave.subcategory)
        if (event.nativeEvent.submitter.name === 'add') {
            navigateHome()
        } else {
            setTransaction({ ...initialState })
            setLastHeader('')
        }
    }

    const deleteTransaction = async () => {
        await ApiService.deleteTransaction(params.transactionId)
        navigateHome()
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

    const activateTransaction = () => {
        setActivate(!activate)
    }

    const hideFromReport = () => {
        setTransaction({...transaction, hide_from_report: !transaction.hide_from_report})
    }

    return (
        <>
            <NewEntryHead element={'transaction'} disabled={disabledHead} />
            <form onSubmit={handleSubmit}>
                <div className="tr__upper">
                    <input className="form__control form__sm row__2" type="date" id="start" name="operation_date"
                        onChange={e => setTransaction({ ...transaction, operation_date: e.target.value })}
                        value={transaction.operation_date} />
                    <select
                        onChange={e => setOperationType(e.target.value)}
                        className="form__select form__sm row__2"
                        name="operation_type"
                        style={{ backgroundImage: "url(/static/select.svg)" }}>
                        <option value={operationType}>
                            {operationType === 'out' ? 'Расход' : 'Приход'}
                        </option>
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
                    <input onClick={toggleCalculator} className="form__control" type="button" value="->"></input>
                </div>
                {showCalculator && <Calculator transaction={transaction} setTransaction={setTransaction} />}
                {/* <h5 className="select__label">Счёт:</h5> */}
                {/* <select
                    className="form__select form__sm"
                    style={{ backgroundImage: "url(/static/select.svg)" }}
                    onChange={e => setTransaction({ ...transaction, account: e.target.value })}>
                    <option value={transaction.account}>{selectedAccountName}</option>
                    {moneyAccounts.map((account) => <option value={account.id} key={account.id}>{account.name}</option>)}
                </select> */}
                <br />
                <Select
                    items={moneyAccounts}
                    transaction={transaction}
                    func={setTransaction}
                    name={'account'}
                    defaultValue={selectedAccountName}
                    label={'Выбрать счёт'} />
                    <br />
                {/* <br /> */}
                {/* <input onFocus={(event) => { event.target.select() }}
                    type="text" name="header"
                    className="form__control form__sm" list="headers"
                    placeholder="Заголовок"
                    value={transaction.header} required
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
                    required={true}
                // defaults={headersRating}
                />
                <br />
                {/* <input onFocus={(event) => { event.target.select() }}
                    type="text" name="category"
                    className="form__control form__sm" list="categories"
                    placeholder="Категория"
                    value={transaction.category} required
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
                    required={true}
                />
                <br />
                {/* <input onFocus={(event) => { event.target.select() }}
                    type="text" name="subcategory"
                    className="form__control form__sm" list="subcategories"
                    placeholder="Подкатегория"
                    value={transaction.subcategory} required
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
                    required={true}
                />
                <br />
                <input type="text" name="comment" className="form__control form__sm" placeholder="Комментарий"
                    onChange={e => setTransaction({ ...transaction, comment: e.target.value })}
                    value={transaction.comment} />
                <br />
                {params.transactionId && transaction.past &&
                    <div>
                        <input onChange={activateTransaction} name="activate" className="form__check" type="checkbox" value="0" id="activate" />
                        <label htmlFor="activate">Активировать</label>
                        <br />
                        <br />
                    </div>
                }
                {params.transactionId && !transaction.past &&
                    <div>
                        <input onChange={activateTransaction} name="activate" className="form__check" type="checkbox" value="0" id="activate" />
                        <label htmlFor="activate">Деактивировать</label>
                        <br />
                        <br />
                    </div>
                }
                {!transaction.past &&
                    <div>
                        <input onChange={hideFromReport} name="activate" className="form__check" type="checkbox" checked={transaction.hide_from_report} id="hide"/>
                        <label htmlFor="hide">Не учитывать в отчёте</label>
                        <br />
                        <br />
                    </div>
                }
                {/* {params.transactionId && transaction.past
                    ? <div>
                        <input onChange={activateTransaction} name="activate" className="form__check" type="checkbox" value="0" id="activate" />
                        <label for="activate">Активировать</label>
                        <br />
                        <br />
                    </div>
                    : <div>
                        <input onChange={activateTransaction} name="activate" className="form__check" type="checkbox" value="0" id="activate" />
                        <label for="activate">Деактивировать</label>
                        <br />
                        <br />
                    </div>
                } */}
                <button type="submit" name="add" className="btn btn__green">Отправить</button>
                {params.transactionId
                    ? <button type="button" onClick={deleteTransaction} className="btn btn__red">Удалить</button>
                    : <button type="submit" name="copy" className="btn btn__green">+Отправить</button>
                }
                <button type="button" onClick={navigateHome} className="btn btn__red">Закрыть</button>
            </form>
        </>
    )
}

export default TransactionForm;
