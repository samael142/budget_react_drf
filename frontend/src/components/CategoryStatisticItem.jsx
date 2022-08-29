import React from "react";

const CategoryStatisticItem = (props) => {
    return (
        <div className="double__button">
            <div className="tr__box__acc"><b>{props.category}</b></div>
            <div className="tr__box__acc"><b>{(Math.floor(props.summ * 100) / 100).toLocaleString()}</b></div>
        </div>
    )
}

export default CategoryStatisticItem;
