import React, { useState, useEffect } from "react";

const DataList = (props) => {

    const [slicedItems, setSlicedItems] = useState([])
    const [inputValue, setInputValue] = useState('')

    const slice = (e) => {
        const array = props.items;
        const inputValue = e.target.value
        const searchValue = new RegExp(inputValue.trim(), 'i');
        const matches = array.filter(value => searchValue.test(value));
        setSlicedItems(matches.slice(0, 4))
        props.func({ ...props.transaction, [props.name]: e.target.value })
        setInputValue(e.target.value)
    }

    useEffect(() => {
        if (slicedItems.length === 1 && slicedItems[0] === inputValue) {
            setSlicedItems([]);
        }
    }, [slicedItems])


    return (
        <>
            <input onFocus={(event) => { event.target.select() }}
                type="text"
                className="form__control form__sm" list={props.name}
                value={props.value} required
                onChange={slice}
                placeholder={props.placeholder}
            />
            <datalist id={props.name}>
                {slicedItems.map((item) => <option value={item} key={item} />)}
            </datalist>
        </>
    )
}

export default DataList;
