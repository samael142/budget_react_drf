import React, {useState, useEffect} from "react";
import ApiService from "../API/ApiService";
import { useLocation } from "react-router-dom";

const BudgetDeatil = () => {

    const { state } = useLocation()
    const [data, setData] = useState([])

    const fetchData = async () => {
        const response = await ApiService.getBudgetDetail(state.start_date, state.end_date, state.category.name, state.plain_summ)
        setData(response)
    }

    useEffect(() => {
        fetchData()
        // console.log(state);
    }, [])

    return (
        <h1>budget detail</h1>
    )
}

export default BudgetDeatil;