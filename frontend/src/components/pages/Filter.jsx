import React, { useContext, useState } from "react";
import { MainContext } from "../../context";
import { GetCurrentDate } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import DataList from "../DatalistV2";

const Filter = () => {

    const [queryData, setQueryData] = useState(
        {
            filterHeader: '',
            filterCategory: '',
            filterSubcategory: '',
            start: GetCurrentDate(new Date()),
            end: GetCurrentDate(new Date())
        })
    const { headers, categories, subcategories } = useContext(MainContext)

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        navigate("/settings/filter/generated_filter", { state: queryData })

    }

    return (
        <div>
            <br />
            <form onSubmit={handleSubmit}>
                {/* <input
                    value={queryData.filterHeader}
                    onChange={e => setQueryData({ ...queryData, filterHeader: e.target.value })}
                    onFocus={(event) => { event.target.select() }}
                    type="text" className="form__control" list="header"
                    placeholder="Заголовок" />
                <datalist id="header">
                    {headers.map((header) => <option value={header} key={header} />)}
                </datalist> */}
                <DataList
                    items={headers}
                    name='filterHeader'
                    value={queryData.filterHeader}
                    placeholder='Заголовок'
                    transaction={queryData}
                    func={setQueryData}
                />
                <br />
                {/* <input
                    value={queryData.filterCategory}
                    onChange={e => setQueryData({ ...queryData, filterCategory: e.target.value })}
                    onFocus={(event) => { event.target.select() }}
                    type="text" className="form__control" list="category"
                    placeholder="Категория" />
                <datalist id="category">
                    {categories.map((category) => <option value={category} key={category} />)}
                </datalist> */}
                <DataList
                    items={categories}
                    name='filterCategory'
                    value={queryData.filterCategory}
                    placeholder='Категория'
                    transaction={queryData}
                    func={setQueryData}
                />
                <br />
                {/* <input
                    value={queryData.filterSubcategory}
                    onChange={e => setQueryData({ ...queryData, filterSubcategory: e.target.value })}
                    onFocus={(event) => { event.target.select() }}
                    type="text" className="form__control" list="subcategory"
                    placeholder="Подкатегория" />
                <datalist id="subcategory">
                    {subcategories.map((subcategory) => <option value={subcategory} key={subcategory} />)}
                </datalist> */}
                <DataList
                    items={subcategories}
                    name='filterSubcategory'
                    value={queryData.filterSubcategory}
                    placeholder='Подкатегория'
                    transaction={queryData}
                    func={setQueryData}
                />
                <br />
                <div className="tr__upper">
                    <input
                        onChange={e => setQueryData({ ...queryData, start: e.target.value })}
                        className="form__control form__sm row__2" type="date"
                        value={queryData.start} />
                    <input
                        onChange={e => setQueryData({ ...queryData, end: e.target.value })}
                        className="form__control form__sm row__2" type="date"
                        value={queryData.end} />
                </div>
                <input type="submit" className="btn btn__green" value="Отправить" />
            </form>
        </div>
    )
}

export default Filter
