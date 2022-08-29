import React from "react";
import { useLocation } from "react-router-dom";

const GeneratedFilter = () => {

    const { state } = useLocation()

    console.log(state);

    return (
        <div>
            <h1>Hello</h1>
        </div>
    )
}

export default GeneratedFilter;
