import React from "react";
import { useState } from "react";
import TotalItem from "./TotalItem";

const DayBox = (props) => {

    const [transactions, setTransactions] = useState([])
    // const [transactions, setTransactions] = useState([])
    // const [total, setTotal] = useState()

    return (
            <div className="day__box">
                <TotalItem total={props.totals.find(o => o.operation_date === props.el.operation_date)} currentDate={props.stringDate} key={props.el.operation_date} />
                {/* <transactions/> */}
            </div>
    )
}

export default DayBox;