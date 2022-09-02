import React, {useState, useEffect} from "react";
import ApiService from "../API/ApiService";
import { useLocation } from "react-router-dom";
import BudgetDetailItem from "../BudgetDetailItem";

const BudgetDeatil = () => {

    const { state } = useLocation()
    const [data, setData] = useState([])

    const fetchData = async () => {
        const response = await ApiService.getBudgetDetail(state.start_date, state.end_date, state.category.name, state.plain_summ)
        setData(response)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="container">
            {data.map(item => <BudgetDetailItem item={item} category={state.category.name} name={state.name} key={item[4]} />)}
            <div className="clear__block"></div>
        </div>
    )
}

export default BudgetDeatil;