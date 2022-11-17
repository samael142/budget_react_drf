import React, { useState, useEffect } from "react";
import DatalistElement from "./DatalistElement";

const DataList = (props) => {


    const [slicedItems, setSlicedItems] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [showElements, setShowElements] = useState(false)

    const slice = (e) => {
        const array = props.items;
        const inputValue = e.target.value
        const searchValue = new RegExp(inputValue.trim(), 'i');
        const matches = array.filter(value => searchValue.test(value));
        setSlicedItems(matches.slice(0, 5))
        props.func({ ...props.transaction, [props.name]: e.target.value })
        setInputValue(e.target.value)
    }

    useEffect(() => {
        if (slicedItems.length === 1 && slicedItems[0] === inputValue) {
            setSlicedItems([]);
        }
    }, [slicedItems])

    useEffect(() => {
        if (props.defaults) {
            setSlicedItems(props.defaults)
        }
    }, [])

    const handleFocus = (e) => {
        e.target.select()
        setShowElements(true)
    }

    const handleBlur = (e) => {
        if (e.relatedTarget) {
            setShowElements(false)
        }
    }

    return (
        <>
            <input
                onFocus={handleFocus}
                onBlur={handleBlur}
                type="text"
                className="form__control form__sm" list={props.name}
                value={props.value}
                onChange={slice}
                placeholder={props.placeholder}
                required={props.required}
            />
            {showElements &&
                <div className="datalist__elements">
                    {slicedItems.map((item) =>
                        <DatalistElement
                            itemName={item}
                            key={item}
                            setInputValue={setInputValue}
                            setSlicedItems={setSlicedItems}
                            func={props.func}
                            transaction={props.transaction}
                            name={props.name} />)}
                </div>
            }
        </>
    )
}

export default DataList;
