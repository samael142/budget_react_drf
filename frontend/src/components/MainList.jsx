import React, { useEffect } from 'react';
import TotalItem from "./TotalItem";
import TransactionItem from "./TransactionItem";
import { scroller } from "react-scroll";


const MainList = ({ transactions, totals }) => {

    let currentMonthMarker = false

    const mainList = []

    const scrollToSection = () => {
        scroller.scrollTo("current__date", {
            duration: 400,
            smooth: "easeInOutQuart",
        });
    };

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         scrollToSection()
    //     }, 1000);
    //     return () => clearTimeout(timer);
    // }, []);
    useEffect(() => {
        if (mainList.length && currentMonthMarker) {
            scrollToSection()
        }
    }, [mainList]);

    const currentDate = new Date()
    const yyyy = currentDate.getFullYear()
    const mm = currentDate.getMonth() + 1
    const dd = currentDate.getDate()
    const stringDate = [yyyy, (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join("-")

    for (const totalElement of totals) {
        mainList.push(<TotalItem total={totalElement} key={totalElement.operation_date} currentDate={stringDate} />)
        if (totalElement.operation_date === stringDate) {
            currentMonthMarker = true
        }
        for (const transactionElement of transactions) {
            if (transactionElement.operation_date === totalElement.operation_date) {
                mainList.push(<TransactionItem transaction={transactionElement} key={transactionElement.id} />)
            }
        }
    }

    return (
        <>
            <div>
                {mainList}
            </div>
            <div className='clear__block'></div>
        </>
    )
}

export default MainList;
