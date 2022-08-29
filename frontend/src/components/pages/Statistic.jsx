import React, { useState, useEffect, useContext } from 'react';
import ApiService from '../API/ApiService';
import { GetCurrentDate, GetStartMonth } from '../utils/utils';
import StatisticList from '../StatisticList';
import { MainContext } from '../../context';

const Statistic = () => {

    const [statisticArray, setStatisticArray] = useState([])
    const [startDate, setStartDate] = useState(GetStartMonth(new Date()))
    const [endDate, setEndDate] = useState(GetCurrentDate(new Date()))
    const [category, setCategory] = useState('')

    const {categories} = useContext(MainContext)

    useEffect(() => {
        fetchData()
    }, [startDate, endDate, category])

    const fetchData = async () => {
        const resp = await ApiService.getStatisticData(startDate, endDate, category)
        setStatisticArray(resp)
    }

    return (
        <div>
            <StatisticList data={statisticArray} />
            <div className='clear__block'></div>
            <div className="fix__footer height__100 container" style={{justifyContent: 'flex-start', height: '145px'}}>
                <div className="tr__upper" style={{marginBottom: '5px'}}>
                    <input
                        className="form__control form__sm row__2" type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        className="form__control form__sm row__2" type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <select
                    className="form__select form__sm"
                    style={{ backgroundImage: "url(/static/select.svg)" }}
                    onChange={e => setCategory(e.target.value)}>
                    <option value=''></option>
                    {categories.map((category) => <option value={category} key={category}>{category}</option>)}
                </select>
            </div>
        </div>
    )
}

export default Statistic;
