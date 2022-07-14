import React, { useEffect } from 'react';
import TotalItem from "./TotalItem";
import TransactionItem from "./TransactionItem";
import { scroller } from "react-scroll";
import { CSSTransition } from 'react-transition-group';


const MainList = ({ transactions, totals, setShow, show }) => {

    let currentMonthMarker = false

    useEffect(() => {
        setShow(true);
    }, [totals])


    const mainList = []

    const scrollToSection = () => {
        scroller.scrollTo("current__date");
    };

    const scrollToTop = () => {
        scroller.scrollTo("container");
    };

    useEffect(() => {
        if (mainList.length && currentMonthMarker) {
            scrollToSection()
        } else {
            scrollToTop()
        }
    }, [mainList]);

    const currentDate = new Date()
    const yyyy = currentDate.getFullYear()
    const mm = currentDate.getMonth() + 1
    const dd = currentDate.getDate()
    const stringDate = [yyyy, (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join("-")

    for (const totalElement of totals) {
        mainList.push(<TotalItem total={totalElement} currentDate={stringDate} key={totalElement.operation_date} />)
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
            <CSSTransition
                unmountOnExit
                in={show}
                timeout={300}
                classNames="transition__box">
                <div className='transition__box'>
                    {mainList}
                </div>
            </CSSTransition>
            <div className='clear__block'></div>
        </>
    )
}

export default MainList;
