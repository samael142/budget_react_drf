import React from "react";

const SelectElement = (props) => {


    const handleClick = () => {
        props.setSelectedItem(props.itemName)
        props.setShowElements(false)
        props.func({ ...props.transaction, [props.name]: props.value })
    }

    return (
        <div onClick={() => handleClick(props.itemName)} className="datalist__element">{props.itemName}</div>
    )
}

export default SelectElement;
