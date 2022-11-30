import React from "react";
import CategoryStatisticItem from "./CategoryStatisticItem";
import SubcategoryStatisticItem from "./SubcategoryStatisticItem";

const StatisticList = (props) => {


    let statisticList = []
    let subcateriesList = []


    if (props.data.length !== 0) {
        let categoryMarker = props.data[0].category__name
        let categorySumm = 0
        props.data.push({ category__name: null, subcategory__name: null, total_summ: 0 })
        for (const el of props.data) {
            if (el.category__name === categoryMarker) {
                categorySumm += el.total_summ
                subcateriesList.push(
                    <SubcategoryStatisticItem subcategory={el.subcategory__name} summ={el.total_summ} key={el.subcategory__name + categoryMarker} />
                )
            } else {
                statisticList.push(
                    <CategoryStatisticItem category={categoryMarker} summ={categorySumm} key={categoryMarker} />
                )
                categorySumm = el.total_summ
                categoryMarker = el.category__name
                Array.prototype.push.apply(statisticList, subcateriesList);
                subcateriesList = [<SubcategoryStatisticItem subcategory={el.subcategory__name} summ={el.total_summ} key={el.subcategory__name + categoryMarker} />]
            }
        }
        if (statisticList.length === 0) {
            statisticList.push(
                <CategoryStatisticItem category={categoryMarker} summ={categorySumm} key={categoryMarker} />
            )
            Array.prototype.push.apply(statisticList, subcateriesList);
        }
    }



    return (
        <div>
            {statisticList}
        </div>
    )
}

export default StatisticList;
