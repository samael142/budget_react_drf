import { useState, useEffect } from "react"
import MultipleSelectElement from "./MultipleSelectElement"

const MultipleSelect = (props) => {

    const [selectedItems, setSelectedItems] = useState([])

    useEffect(() => {
        props.func(selectedItems)
    }, [selectedItems])

    useEffect(() => {
      setSelectedItems(props.initItems)
    }, [props.initItems])
    
    return (
        <>
            <label htmlFor="category">Выбрать категории для исключения</label>
            <div className="form__control form__sm" id="category">
                <div className="datalist__elements">
                    {props.items.map((item) =>
                        <MultipleSelectElement
                            item={item}
                            itemName={item.name}
                            value={item.id}
                            key={item.id}
                            func={props.func}
                            setSelectedItems={setSelectedItems}
                            selectedItems={selectedItems}
                        />)}
                </div>
            </div>
        </>
    )
}

export default MultipleSelect;
