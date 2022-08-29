import React, { useState, useContext, useLayoutEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { MainContext } from "../../context";
import ApiService from "../API/ApiService";
import NewEntryHead from "../NewEntryHead";
import { GetCurrentDate } from "../utils/utils";


const TransferForm = () => {

    const [fromAccountName, setFromAccountName] = useState('')
    const [toAccountName, setToAccountName] = useState('')

    let params = useParams();

    const readEditableTransactions = async () => {
        const response = await ApiService.getTransfer(params.transferId)
        response.forEach(function (item) {
            if (parseFloat(item.operation_summ) < 0) {
                setTransactionFrom({
                    ...transactionFrom,
                    id: item.id,
                    operation_date: item.operation_date,
                    operation_summ: item.operation_summ,
                    account: item.account.id,
                    transfer_id: item.transfer_id,
                    comment: item.comment
                })
                setFromAccountName(item.account.name)
            }
            if (parseFloat(item.operation_summ) > 0) {
                setTransactionTo({
                    ...transactionTo,
                    id: item.id,
                    operation_date: item.operation_date,
                    operation_summ: item.operation_summ,
                    account: item.account.id,
                    transfer_id: item.transfer_id,
                    comment: item.comment
                })
                setToAccountName(item.account.name)
            }
        });
    }

    useLayoutEffect(() => {
        if (params.transferId) {
            readEditableTransactions()
        };
    }, [])

    const { moneyAccounts, setOnScreenDate } = useContext(MainContext)

    const navigate = useNavigate();

    // const currentDate = new Date()
    // const yyyy = currentDate.getFullYear()
    // const mm = currentDate.getMonth() + 1
    // const dd = currentDate.getDate()
    // const stringDate = [yyyy, (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join("-")


    const [transactionFrom, setTransactionFrom] = useState({
        id: '',
        operation_date: GetCurrentDate(new Date()),
        operation_summ: '',
        account: '',
        transfer_id: String(Date.now()).slice(-8),
        comment: ''
    })

    const [transactionTo, setTransactionTo] = useState({
        id: '',
        operation_date: GetCurrentDate(new Date()),
        operation_summ: '',
        account: '',
        transfer_id: transactionFrom.transfer_id,
        comment: ''
    })

    const deleteTransactions = async () => {
        let promise = new Promise((resolve, reject) => {
            resolve(ApiService.deleteTransfer(params.transferId))
        });
        await promise
        navigateHome()
    }

    const navigateHome = () => {
        setOnScreenDate(new Date())
        navigate('/');
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (params.transferId) {
            await ApiService.patchTransaction(transactionFrom, transactionFrom.id)
            await ApiService.patchTransaction(transactionTo, transactionTo.id)
        } else {
            await ApiService.postTransaction(transactionFrom)
            await ApiService.postTransaction(transactionTo)
        }
        navigateHome()
    }

    return (
        <>
            <NewEntryHead element={'transfer'} />
            <form onSubmit={handleSubmit}>
                <div className="tr__upper">
                    <input className="form__control form__sm row__2" type="date" id="start" name="operation_date"
                        onChange={e => {
                            setTransactionFrom({ ...transactionFrom, operation_date: e.target.value });
                            setTransactionTo({ ...transactionTo, operation_date: e.target.value });
                        }
                        }
                        value={transactionFrom.operation_date} />
                </div>
                <hr className="top__hr" />
                <div className="input__group">
                    <input onFocus={(event) => { event.target.select() }}
                        onChange={e => {
                            setTransactionFrom({ ...transactionFrom, operation_summ: "-" + e.target.value });
                            setTransactionTo({ ...transactionTo, operation_summ: e.target.value });
                        }
                        }
                        value={transactionTo.operation_summ}
                        type="number" step="0.01" name="operation_summ" className="form__control form__sm" placeholder="Сумма"
                        required />
                    <input id="showCalculator" className="form__control" type="button" value="->"></input>
                </div>

                <h5 className="select__label">Откуда</h5>
                <select
                    className="form__select form__sm"
                    style={{ backgroundImage: "url(/static/select.svg)" }}
                    onChange={e => {
                        setTransactionFrom({ ...transactionFrom, account: e.target.value });
                        setTransactionTo({ ...transactionTo, comment: "Перевод с " + e.target.options[e.target.selectedIndex].text });
                    }}>
                    <option value={transactionFrom.account}>{fromAccountName}</option>
                    {moneyAccounts.map((account) => <option value={account.id} key={account.id}>{account.name}</option>)}
                </select>
                <h5 className="select__label">Куда</h5>
                <select
                    className="form__select form__sm"
                    style={{ backgroundImage: "url(/static/select.svg)" }}
                    onChange={e => {
                        setTransactionTo({ ...transactionTo, account: e.target.value });
                        setTransactionFrom({ ...transactionFrom, comment: "Перевод на " + e.target.options[e.target.selectedIndex].text });
                    }}>
                    <option value={transactionTo.account}>{toAccountName}</option>
                    {moneyAccounts.map((account) => <option value={account.id} key={account.id}>{account.name}</option>)}
                </select>
                <br />
                <button type="submit" className="btn btn__green">Отправить</button>
                {params.transferId
                    ? <button type="button" onClick={deleteTransactions} className="btn btn__red">Удалить</button>
                    : <button type="submit" name="copy" className="btn btn__green">+Отправить</button>
                }
                <button type="button" onClick={navigateHome} className="btn btn__red">Закрыть</button>
            </form>
        </>
    )
}

export default TransferForm;
