import React from "react";

const ExcludeReportItem = (props) => {
    return (
        <div className={"double__button no__radius"}>
            <div onClick={props.sortByName} className="exreport__box transparent__color">{props.item.category__name}</div>
            <div onClick={props.sortBySumm} className="exreport__box transparent__color">{(props.item.total_summ).toLocaleString("ru",{minimumFractionDigits: 2})}</div>
        </div>
    )
}

export default ExcludeReportItem;
