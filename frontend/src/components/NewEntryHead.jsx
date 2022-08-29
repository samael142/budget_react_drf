import React from "react";
import { useNavigate } from 'react-router-dom';

const NewEntryHead = ( {element} ) => {

    const navigate = useNavigate();

    const handleChange = (event) => {
        navigate('/' + event.target.value + '/new');
    }

    return (
        <>
            <select
                onChange={handleChange}
                defaultValue={element} className="form__select title__single" style={{ width: 'auto' }}>
                <option value="transaction">Транзакция</option>
                <option value="transfer">Перевод</option>
                <option value="plain">Планируемая транзакция</option>
            </select>
            <br />
        </>
    )
}

export default NewEntryHead;
