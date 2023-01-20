import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ApiService from "../API/ApiService";
import { useNavigate } from "react-router-dom";
import ExcludeReportList from "../ExcludeReportList";

const GeneratedExcludeReport = () => {

    const { state } = useLocation()
    const [reportData, setReportData] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        fetchData()
    }, [])

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
            <br />
            <input type="button" onClick={navigateHome} className="btn btn__red" value="Закрыть" />
            <div className='clear__block'></div>
        </div>
    )
}

export default GeneratedExcludeReport;
