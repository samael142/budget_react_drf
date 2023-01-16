import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ApiService from "../API/ApiService";
import ExcludeReportItem from "../ExcludeReportItem";
import { useNavigate } from "react-router-dom";
import { getISOWeek } from "date-fns";
import ExcludeReportList from "../ExcludeReportList";

const GeneratedExcludeReport = () => {

    const { state } = useLocation()
    const [reportData, setReportData] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        fetchData()
    }, [])

    // useEffect(() => {
    //     if (reportData.length !== 0) {
    //         for (let element of reportData) {
    //             element.week = getISOWeek(new Date(element.operation_date))
    //         }
    //         let weeksArray = []
    //         let week = [reportData[0]]
    //         for (let day of reportData.slice(1)) {
    //             if (week[[week.length - 1]].week === day.week) {
    //                 week.push(day)
    //             } else {
    //                 let res = Array.from(
    //                     week.reduce((a,{subcategory__name,total_summ})=>{
    //                       return a.set(subcategory__name, (a.get(subcategory__name)||0) + total_summ);
    //                     }, new Map())
    //                   ).map(([subcategory__name,total_summ])=>({subcategory__name,total_summ}));

    //                 weeksArray.push(res)
    //                 week = [day]
    //             }
    //         }
    //     }
    // }, [reportData])


    const fetchData = async () => {
        const response = await ApiService.getExcludeReportData(
            state.category.map((category) => category.id),
            state.month)
        setReportData(response)
    }

    const navigateHome = () => {
        navigate('/');
    };


    return (
        <div>
            <ExcludeReportList data={reportData} month={state.month} summ={state.summ}/>
            {/* {reportData.map(item => <ExcludeReportItem item={item} key={reportData.indexOf(item)} />)} */}
            <br />
            <input type="button" onClick={navigateHome} className="btn btn__red" value="Закрыть" />
            <div className='clear__block'></div>
        </div>
    )
}

export default GeneratedExcludeReport;
