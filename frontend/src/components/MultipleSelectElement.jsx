import React from "react";

const MultipleSelectElement = (props) => {

    const handleClick = () => {
        if (!props.selectedItems.includes(props.item)) {
            props.setSelectedItems([...props.selectedItems, props.item])
        }
        if (props.selectedItems.includes(props.item)) {
            const newArr = props.selectedItems.filter(object => {
                return object.id !== props.item.id;
            });
            props.setSelectedItems(newArr);
        }
    }

    const checkItemInSelectedItems = (item) => {
        if (props.selectedItems.includes(props.item)) {
            return true
        }
        return false
    }

    return (
        <div onClick={() => handleClick()} className="datalist__element"
            style={checkItemInSelectedItems(props.item) ? { background: 'salmon' } : {}}
        >{props.itemName}</div>
    )
}

export default MultipleSelectElement;
