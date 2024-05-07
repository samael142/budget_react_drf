import React, { useState, useEffect, useContext } from 'react';
import ApiService from '../API/ApiService';
// import { GetCurrentDate, GetStartMonth } from '../utils/utils';
import StatisticList from '../StatisticList';
import { MainContext } from '../../context';

const Statistic = () => {

    const [statisticArray, setStatisticArray] = useState([])
    // const [startDate, setStartDate] = useState(GetStartMonth(new Date()))
    // const [endDate, setEndDate] = useState(GetCurrentDate(new Date()))
    // const [statisticArray, setStatisticArray] = useState([])
    const { categories, setLastLink, statisticParameters, setStatisticParameters, setStatisticDetailModeArray } = useContext(MainContext)
    const [category, setCategory] = useState(statisticParameters.category)
    const [startDate, setStartDate] = useState(statisticParameters.startDate)
    const [endDate, setEndDate] = useState(statisticParameters.endDate)


    useEffect(() => {
        fetchData()
    }, [startDate, endDate, category])

    const changeStartDate = (value) => {
        setStatisticDetailModeArray([])
        setStartDate(value)
        setStatisticParameters({...statisticParameters, startDate: value})
    }

    const changeEndDate = (value) => {
        setStatisticDetailModeArray([])
        setEndDate(value)
        setStatisticParameters({...statisticParameters, endDate: value})
    }

    const changeCategory = (value) => {
        setStatisticDetailModeArray([])
        setCategory(value)
        setStatisticParameters({...statisticParameters, category: value})
    }
    
    useEffect(() => {
        setLastLink(window.location.pathname)
    }, [])



    const fetchData = async () => {
        const resp = await ApiService.getStatisticData(startDate, endDate, category)
        setStatisticArray(resp)
    }

    return (
        <div>
            <StatisticList data={statisticArray} startDate={startDate} endDate={endDate} />
            <div className='clear__block'></div>
            <div className="fix__footer height__100 container" style={{ justifyContent: 'flex-start', height: '145px' }}>
                <div className="tr__upper" style={{ marginBottom: '5px' }}>
                    <input
                        className="form__control form__sm row__2" type="date"
                        value={startDate}
                        onChange={(e) => changeStartDate(e.target.value)}
                    />
                    <input
                        className="form__control form__sm row__2" type="date"
                        value={endDate}
                        onChange={(e) => changeEndDate(e.target.value)}
                    />
                </div>
                <select
                    className="form__select form__sm"
                    style={{ backgroundImage: "url(/static/select.svg)" }}
                    onChange={e => changeCategory(e.target.value)}>
                    <option value={category}>{category}</option>
                    {categories.map((category) => <option value={category} key={category}>{category}</option>)}
                    <option value=''></option>
                </select>
            </div>
        </div>
    )
}

export default Statistic;
