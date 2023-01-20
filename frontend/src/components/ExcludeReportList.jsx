import React from 'react';
import ExcludeReportItem from './ExcludeReportItem';
import { getISODay } from "date-fns";


const ExcludeReportList = (props) => {

    let mainList = []

    const getDaysQuantity = () => {
        const year = parseInt(props.month.slice(0, 4))
        const month = parseInt(props.month.slice(5))
        let days = 0
        const daysObject = {
            1: 31,
            3: 31,
            4: 30,
            5: 31,
            6: 30,
            7: 31,
            8: 31,
            9: 30,
            10: 31,
            11: 30,
            12: 31
        }
        if (month == 2) {
            ((year % 4 == 0) && (year % 100 != 0))
                ? days = 29
                : days = 28
        } else {
            days = daysObject[month]
        }

        return days
    }

    const getListOfDays = () => {
        const daysQuantity = getDaysQuantity()
        let weeksList = []
        let week = []
        for (let i = 1; i <= daysQuantity; i++) {
            let day = props.month + '-' + (i < 10 ? '0' : '') + i.toString()
            week.push(day)
            if (getISODay(new Date(day)) === 7) {
                weeksList.push(week)
                week = []
            }
        }
        weeksList.push(week)

        return weeksList
    }

    const renderHeader = (week) => {
        const start = week[0]
        const end = week[week.length - 1]

        return (
            <div className="exreport__box transparent__color" style={{ fontWeight: 'bold' }}>{start} &#8594; {end}</div>
        )
    }

    const renderFooter = (weekNumber, summ, economy, totalEconomy) => {
        return (
            <div style={{ marginBottom: '5px' }}>
                <div className="double__button no__radius">
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        Итого неделя {weekNumber}:
                    </div>
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        {summ.toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="double__button no__radius">
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        Экономия:
                    </div>
                    <div className={"exreport__box transparent__color " +
                        (economy >= 0 ? "green__color" : "red__color")}
                        style={{ fontWeight: 'bold' }}>
                        {economy.toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="double__button no__radius">
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        Общая экономия:
                    </div>
                    <div className={"exreport__box transparent__color " +
                        (totalEconomy >= 0 ? "green__color" : "red__color")}
                        style={{ fontWeight: 'bold' }}>
                        {totalEconomy.toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>
        )
    }

    const renderGlobalFooter = () => {
        const totalSumm = props.data.map((item) => parseFloat(item.total_summ)).reduce((partialSum, a) => partialSum + a, 0)
        const totalPlan = getDaysQuantity() * props.summ
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

    let newArr = []
    let newObj = { week: [], transactions: [], days: 0, summ: 0, economy: 0, totalEconomy: 0 }
    for (let weekList of getListOfDays()) {
        newObj.week = [weekList[0], weekList.at(-1)]
        newObj.days = weekList.length
        for (let transaction of props.data) {
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
        newObj.economy = newObj.summ + props.summ * newObj.days
        newObj.totalEconomy += newObj.economy
        newArr.push(newObj)

        newObj = { week: [], transactions: [], days: 0, summ: 0, economy: 0, totalEconomy: newObj.totalEconomy }
    }

    for (let element of newArr) {
        mainList.push(renderHeader(element.week))
        element.transactions.map((transaction) => mainList.push(<ExcludeReportItem item={transaction} />))
        mainList.push(renderFooter(newArr.indexOf(element) + 1, element.summ, element.economy, element.totalEconomy))
    }
    mainList.push(renderGlobalFooter())

    return mainList
}

export default ExcludeReportList;
