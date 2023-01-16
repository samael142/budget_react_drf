import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetCurrentMonth } from "../utils/utils";
import ApiService from "../API/ApiService";
import MultipleSelect from "../MultipleSelect";

const ExcludeReportSettings = () => {

    const [categoriesList, setCategoriesList] = useState([])
    const [queryData, setQueryData] = useState({ category: [], month: GetCurrentMonth().firstday.slice(0, 7), summ: '' })
    const [categoriesWithId, setCategoriesWithId] = useState([])
    const [storedCategoriesList, setStoredCategoriesList] = useState([])
    const [initCategories, setInitCategories] = useState([])

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        localStorage.setItem('excludeReportCategory', categoriesList.map((category) => category.id).join('_'));
        localStorage.setItem('excludeReportSumm', queryData.summ);
        navigate("/exclude_report/generated_report", { state: queryData })
        // navigate("/report/generated_report", { state: queryData })
    }

    useEffect(() => {
      setQueryData({...queryData, category: categoriesList})
    }, [categoriesList])
    

    useEffect(() => {
        if (localStorage.getItem('excludeReportCategory') && localStorage.getItem('excludeReportSumm')) {
            setQueryData({ ...queryData, summ: localStorage.getItem('excludeReportSumm') })
            const storeCategories = localStorage.getItem('excludeReportCategory').split('_')
            setStoredCategoriesList(storeCategories.map((x) => parseInt(x)))
        }
        fetchCategoryesWithId()
    }, [])

    useEffect(() => {
      if (storedCategoriesList.length !==0 && categoriesWithId.length !==0) {
        let newArr = []
        for (let stCat of storedCategoriesList ) {
            let searchEl = categoriesWithId.find(x => x.id === stCat)
            newArr.push(searchEl)
        }
        setInitCategories(newArr)        
      }
    }, [storedCategoriesList, categoriesWithId])
    

    async function fetchCategoryesWithId() {
        const data = await ApiService.getCategoriesWithId()
        setCategoriesWithId(data)
    }

    return (
        <div>
            <br />
            <form onSubmit={handleSubmit}>
                <MultipleSelect
                    items={categoriesWithId}
                    func={setCategoriesList}
                    initItems={initCategories}
                />
                <br />
                <input
                    onChange={e => setQueryData({ ...queryData, summ: e.target.value })}
                    onFocus={(event) => { event.target.select() }}
                    type="number" step="0.01" className="form__control" placeholder="Сумма для сравнения"
                    value={queryData.summ} required />
                <br />
                <div className="tr__upper">
                    <input
                        onChange={e => setQueryData({ ...queryData, month: e.target.value })}
                        className="form__control form__sm row__2" type="month"
                        value={queryData.month} />
                </div>
                <input type="submit" className="btn btn__green" value="Отправить" />
            </form>
        </div>
    )
}

export default ExcludeReportSettings;
