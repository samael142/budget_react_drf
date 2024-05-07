import React from 'react';
import TotalItem from "./TotalItem";
import TransactionItem from "./TransactionItem";
import DayBox from './DayBox';

const MainListTest = ({ transactions, totals }) => {

    let currentMonthMarker = false
    const mainList = []
    let dateMarker
    const currentDate = new Date()
    const yyyy = currentDate.getFullYear()
    const mm = currentDate.getMonth() + 1
    const dd = currentDate.getDate()
    const stringDate = [yyyy, (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join("-")
    const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

    for (const el of transactions) {
        if (dateMarker !== el.operation_date) {
            if (totals.find(o => o.operation_date === el.operation_date) === undefined) {
                let insertionDate = new Date(el.operation_date);
                totals.push({ operation_date: el.operation_date, total: undefined, day: weekDays[insertionDate.getDay()] });
            }
            mainList.push(
                    <DayBox el = {el} totals = {totals} stringDate = {stringDate}/>
                    // <TotalItem total={totals.find(o => o.operation_date === el.operation_date)} currentDate={stringDate} key={el.operation_date} />
            )
            if (el.operation_date === stringDate) {
                currentMonthMarker = true
            }
            mainList.push(
                <TransactionItem transaction={el} key={el.id} />
            )
        } else {
            mainList.push(
                <TransactionItem transaction={el} key={el.id} />
            )
        }
        dateMarker = el.operation_date
    }

    return (
        mainList
    )
}

export default MainListTest;
