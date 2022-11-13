import React from "react";

const DatalistElement = (props) => {

    const handleClick = (itemName) => {
        props.setSlicedItems([])
        props.func({ ...props.transaction, [props.name]: itemName })
    }

    return (
        <div onClick={() => handleClick(props.itemName)} className="datalist__element">{props.itemName}</div>
    )
}

export default DatalistElement;
