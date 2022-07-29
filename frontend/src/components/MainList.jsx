import React from 'react';
import TotalItem from "./TotalItem";
import TransactionItem from "./TransactionItem";


const MainList = ({ transactions, totals }) => {


    let currentMonthMarker = false
    const mainList = []
    let dateMarker
    const currentDate = new Date()
    const yyyy = currentDate.getFullYear()
    const mm = currentDate.getMonth() + 1
    const dd = currentDate.getDate()
    const stringDate = [yyyy, (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join("-")

    for (const el of transactions) {
        if (dateMarker !== el.operation_date) {
            mainList.push(
                <TotalItem total={totals.find(o => o.operation_date === el.operation_date)} currentDate={stringDate} key={el.operation_date} />
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
        <div className={!currentMonthMarker ? "current__date" : ""}>
            {mainList}
            <div className='clear__block'></div>
        </div>
    )
}

export default MainList;
