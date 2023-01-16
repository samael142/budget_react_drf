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

    const renderFooter = (weekNumber, summ, weekLength, totalEconomy) => {
        return (
            <div style={{ marginBottom: '5px' }}>
                <div className="double__button no__radius">
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        Итого неделя {weekNumber}:
                    </div>
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        {(summ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="double__button no__radius">
                    <div className="exreport__box transparent__color"
                        style={{ fontWeight: 'bold' }}>
                        Экономия:
                    </div>
                    <div className={"exreport__box transparent__color " +
                        (summ + weekLength * props.summ >= 0 ? "green__color" : "red__color")}
                        style={{ fontWeight: 'bold' }}>
                        {(summ + weekLength * props.summ).toLocaleString("ru", { minimumFractionDigits: 2 })}
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
                        {(totalEconomy).toLocaleString("ru", { minimumFractionDigits: 2 })}
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
                        (totalPlan + totalSumm>= 0 ? "green__color" : "red__color")}
                        style={{ fontWeight: 'bold' }}>
                        {(totalPlan + totalSumm).toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </>
        )
    }

    renderGlobalFooter()

    const weeksList = getListOfDays()
    let totalEconomy = 0
    for (let week of weeksList) {
        mainList.push(renderHeader(week))
        let summ = 0
        let weekLength = week.length
        for (let transaction of props.data) {
            if (week.find(element => element === transaction.operation_date)) {
                mainList.push(<ExcludeReportItem item={transaction} />)
                summ += parseFloat(transaction.total_summ)
            }
        }
        totalEconomy += summ + weekLength * props.summ
        mainList.push(renderFooter(weeksList.indexOf(week) + 1, summ, weekLength, totalEconomy))

    }
    mainList.push(renderGlobalFooter())

    return (
        <>
            {mainList}
        </>
    )
}

export default ExcludeReportList;
