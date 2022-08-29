import React from "react";
import { Link } from "react-router-dom";

const Settings = () => {
    return (
        <div className="settings__menu">
            <Link to='statistic' className="settings__pt tr__box">Статистика</Link>
            <Link to='budget' className="settings__pt tr__box">Бюджет</Link>
            <Link to='last20' className="settings__pt tr__box">Последние 20 транзакций</Link>
            <Link to='filter' className="settings__pt tr__box">Выборка с фильтром</Link>
            <Link to='past' className="settings__pt tr__box">Планируемые</Link>
        </div>
    )
}

export default Settings;