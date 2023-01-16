import { useState, useEffect } from "react"
import EasySelectElement from "./EasySelectElement"

const EasySelect = (props) => {

    const [showElements, setShowElements] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')
    const [defaultVlalue, setDefaultValue] = useState('')

    const handleClick = (e) => {
        e.preventDefault()
        setShowElements(!showElements)
    }

    // useEffect(() => {
    //     if (!selectedItem && props.defaultValue) {
    //         setSelectedItem(props.defaultValue)
    //         // setDefaultValue(props.defaultValue)
    //     }
    // }, [props])


    return (
        <div onClick={handleClick} className="form__control form__sm">
            <div>
                {selectedItem
                    ? <div className="datalist__element" style={{ display: "inline" }}>{selectedItem}</div>
                    : <div className="datalist__element" style={{ background: "white", display: "inline" }}>{props.label}</div>
                }
            </div>
            {showElements &&
                <div className="datalist__elements">
                    {props.items.map((item) =>
                        <EasySelectElement
                            item={item}
                            itemName={item.name}
                            value={item.id}
                            key={item.id}
                            func={props.func}
                            setSelectedItem={setSelectedItem}
                            setShowElements={setShowElements} />)}
                </div>
            }
        </div>
    )
}

export default EasySelect;
