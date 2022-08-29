import React from "react";

const SubcategoryStatisticItem = (props) => {
    return (
        <div className="double__button">
            <div className="tr__box__acc">&nbsp;&bull;&nbsp;{props.subcategory}</div>
            <div className="tr__box__acc">{(Math.floor(props.summ * 100) / 100).toLocaleString()}</div>
        </div>
    )
}

export default SubcategoryStatisticItem;
