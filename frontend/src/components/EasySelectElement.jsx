import React from "react";

const EasySelectElement = (props) => {

    const handleClick = () => {
        props.setSelectedItem(props.itemName)
        props.setShowElements(false)
        props.func(props.item)
    }

    return (
        <div onClick={() => handleClick()} className="datalist__element">{props.itemName}</div>
    )
}

export default EasySelectElement;
