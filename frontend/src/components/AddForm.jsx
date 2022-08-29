import React from "react";
import { useState } from "react";
import TransactionForm from "./TransactionForm";
import TransferForm from "./TransferForm";
import PlaiOperationForm from "./pages/PlainOperationForm";

const AddForm = ({ headers, categories, subcategories, moneyAccounts,
    setOnScreenDate, setHeaders, setCategories, setSubcategories }) => {

    const [mainForm, setMainForm] = useState('transaction')

    const handleChange = (event) => {
        setMainForm(event.target.value);
    }

    return (
        <>
            <select
                onChange={handleChange}
                defaultValue="transaction" className="form__select title__single" style={{ width: 'auto' }}>
                <option value="transaction">Транзакция</option>
                <option value="transfer">Перевод</option>
                <option value="past">Планируемая транзакция</option>
            </select>
            <br />
            {mainForm === 'transaction' &&
                <TransactionForm
                    headers={headers}
                    categories={categories}
                    subcategories={subcategories}
                    moneyAccounts={moneyAccounts}
                    setOnScreenDate={setOnScreenDate}
                    setHeaders={setHeaders}
                    setCategories={setCategories}
                    setSubcategories={setSubcategories}
                />
            }
            {mainForm === 'transfer' &&
                <TransferForm
                    headers={headers}
                    categories={categories}
                    subcategories={subcategories}
                    moneyAccounts={moneyAccounts}
                    setOnScreenDate={setOnScreenDate}
                    setHeaders={setHeaders}
                    setCategories={setCategories}
                    setSubcategories={setSubcategories}
                />
            }
            {mainForm === 'past' &&
                <PlaiOperationForm
                    headers={headers}
                    categories={categories}
                    subcategories={subcategories}
                    moneyAccounts={moneyAccounts}
                    setOnScreenDate={setOnScreenDate}
                    setHeaders={setHeaders}
                    setCategories={setCategories}
                    setSubcategories={setSubcategories}
                />
            }
        </>
    )
}

export default AddForm;
