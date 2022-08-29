import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ApiService from "../API/ApiService";
import ReportItem from "../ReportItem";
import { useNavigate } from "react-router-dom";
import ReportModal from "../ReportModal";

const GeneratedReport = () => {

    const { state } = useLocation()
    const [reportData, setReportData] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [date, setDate] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const response = await ApiService.getReportData(state.category, state.start, state.end)
        let totalEconomy = 0
        for (let el of response) {
            el.economy = Math.floor((parseFloat(state.summ) + parseFloat(el.total_summ)) * 100) / 100
            totalEconomy += el.economy
            el.totalEconomy = totalEconomy
        }
        setReportData(response)
    }

    const navigateHome = () => {
        navigate('/');
    };

    const handleClick = (item) => {
        setDate(item.operation_date)
        setModalVisible(true)
    }

    return (
        <div>
            <div className="double__button no__radius">
                <div className="report__box transparent__color border__right">Дата</div>
                <div className="report__box transparent__color border__right">Расход</div>
                <div className="report__box transparent__color border__right">Экономия</div>
                <div className="report__box end__text transparent__color">Итог</div>
            </div>
            {reportData.map(item => <ReportItem item={item} key={item.operation_date} click={handleClick}/>)}
            <br />
            <input type="button" onClick={navigateHome} className="btn btn__red" value="Закрыть" />
            {modalVisible && <ReportModal setModalVisible={setModalVisible} date={date} category={state.category}/>}
        </div>
    )
}

export default GeneratedReport;
