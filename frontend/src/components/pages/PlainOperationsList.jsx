import React, { useState, useEffect } from "react";
import ApiService from "../API/ApiService";
import PlainOperationItem from "../PlainOperationItem";

const PlainOperationsList = () => {

    const [plainOperations, setPlainOperations] = useState([])

    const fetchData = async () => {
        const response = await ApiService.getPlainOperations()
        setPlainOperations(response)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="container">
            {plainOperations.map(item => <PlainOperationItem plainOperation={item} key={item.id} />)}
            <div className="clear__block"></div>
        </div>

    )
}

export default PlainOperationsList;
