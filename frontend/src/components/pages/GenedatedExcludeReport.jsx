import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ApiService from "../API/ApiService";
import { useNavigate } from "react-router-dom";
import ExcludeReportList from "../ExcludeReportList";
import ExcludeReportItem from "../ExcludeReportItem";
import { getListOfDays, getDaysQuantity } from "../utils/utils";

const GeneratedExcludeReport = () => {

    const { state } = useLocation()
    const [reportData, setReportData] = useState([])
    const navigate = useNavigate();
    const [dataForRenderer, setDataForRender] = useState([])
    const [sortingdMode, setSortingMode] = useState('name')

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (reportData.length !== 0) {
            dataHandler()
        }
    }, [reportData])


    const fetchData = async () => {
        const response = await ApiService.getExcludeReportData(
            state.category.map((category) => category.id),
            state.month)
        setReportData(response)
    }

    const dataHandler = () => {
        let newArr = []
        let newObj = { week: [], transactions: [], days: 0, summ: 0, economy: 0, totalEconomy: 0 }
        for (let weekList of getListOfDays(state.month)) {
            newObj.week = [weekList[0], weekList.at(-1)]
            newObj.days = weekList.length
            for (let transaction of reportData) {
                if (weekList.find(element => element === transaction.operation_date)) {
                    let existingCategory = newObj.transactions.find(element => element.category__name === transaction.category__name)
                    if (existingCategory) {
                        existingCategory.total_summ += transaction.total_summ
                    } else {
                        newObj.transactions.push({ category__name: transaction.category__name, total_summ: transaction.total_summ })
                    }
                    newObj.summ += transaction.total_summ
                }
            }
            newObj.transactions.sort((a, b) => a.category__name.localeCompare(b.category__name));
            newObj.economy = newObj.summ + state.summ * newObj.days
            newObj.totalEconomy += newObj.economy
            newArr.push(newObj)
            newObj = { week: [], transactions: [], days: 0, summ: 0, economy: 0, totalEconomy: newObj.totalEconomy }
        }
        setDataForRender(newArr)
    }

    const navigateHome = () => {
        navigate('/');
    };

    const RenderGlobalFooter = () => {
        const totalSumm = reportData.map((item) => parseFloat(item.total_summ)).reduce((partialSum, a) => partialSum + a, 0)
        const totalPlan = getDaysQuantity(state.month) * state.summ
        return (
            <>
                <br />
                <div className="double__button no__radius">
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        Итого потрачено:
                    </div>
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        {(totalSumm).toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="double__button no__radius">
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        Итого запланировано:
                    </div>
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        {(totalPlan).toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="double__button no__radius">
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        Экономия:
                    </div>
                    <div className={"exreport__box transparent__color " +
                        (totalPlan + totalSumm >= 0 ? "green__color" : "red__color")}
                        style={{ fontWeight: 'bold' }}>
                        {(totalPlan + totalSumm).toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </>
        )
    }

    const sortByName = () => {
        if (sortingdMode !== 'name') {
            dataForRenderer.forEach(element => element.transactions.sort((a, b) => a.category__name.localeCompare(b.category__name)))
            setSortingMode('name')
        }
    }

    const sortBySumm = () => {
        if (sortingdMode !== 'summ') {
            dataForRenderer.forEach(element => element.transactions.sort((a, b) => a.total_summ - b.total_summ))
            setSortingMode('summ')
        }
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '5px' }}>
                <div onClick={sortByName} className="exreport__box transparent__color"
                    style={{ fontWeight: 'bold', fontSize: 20  }}>
                    &#8595;
                </div>
                <div onClick={sortBySumm} className="exreport__box transparent__color"
                    style={{ fontWeight: 'bold', fontSize: 20 }}>
                    &#8595;
                </div>
            </div>
            {dataForRenderer.map((item, index) =>
                <div key={index}>
                    <div className="exreport__box transparent__color" style={{ fontWeight: 'bold' }}>
                        {item.week[0]} &#8594; {item.week.at(-1)}
                    </div>
                    {item.transactions.map((transaction, subindex) => <ExcludeReportItem key={subindex} item={transaction} />)}
                    <div style={{ marginBottom: '5px' }}>
                        <div className="double__button no__radius">
                            <div className="exreport__box transparent__color"
                                style={{ fontWeight: 'bold' }}>
                                Итого неделя {dataForRenderer.indexOf(item) + 1}:
                            </div>
                            <div className="exreport__box transparent__color"
                                style={{ fontWeight: 'bold' }}>
                                {item.summ.toLocaleString("ru", { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="double__button no__radius">
                            <div className="exreport__box transparent__color"
                                style={{ fontWeight: 'bold' }}>
                                Экономия:
                            </div>
                            <div className={"exreport__box transparent__color " +
                                (item.economy >= 0 ? "green__color" : "red__color")}
                                style={{ fontWeight: 'bold' }}>
                                {item.economy.toLocaleString("ru", { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="double__button no__radius">
                            <div className="exreport__box transparent__color"
                                style={{ fontWeight: 'bold' }}>
                                Общая экономия:
                            </div>
                            <div className={"exreport__box transparent__color " +
                                (item.totalEconomy >= 0 ? "green__color" : "red__color")}
                                style={{ fontWeight: 'bold' }}>
                                {item.totalEconomy.toLocaleString("ru", { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <RenderGlobalFooter />

            <br />
            <input type="button" onClick={navigateHome} className="btn btn__red" value="Закрыть" />
            <div className='clear__block'></div>
        </>
    )
}

export default GeneratedExcludeReport;
