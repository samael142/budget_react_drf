import React from "react";

const ExcludeReportItem = (props) => {
    return (
        <div className={"double__button no__radius"}>
            <div className="exreport__box transparent__color">{props.item.category__name}</div>
            <div className="exreport__box transparent__color">{(props.item.total_summ).toLocaleString("ru",{minimumFractionDigits: 2})}</div>
        </div>
    )
}

export default ExcludeReportItem;
