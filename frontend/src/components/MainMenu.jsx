import React, { useContext } from "react";
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import home from '../static/home.svg'
import transaction from '../static/transaction.svg'
import accounts from '../static/accounts.svg'
import report from '../static/report.svg'
import exclude from '../static/exclude.svg'
import settings from '../static/settings.svg'
import left from '../static/left.svg'
import right from '../static/right.svg'
import { MainContext } from "../context";


const MainMenu = () => {

    const { onScreenDate, setOnScreenDate } = useContext(MainContext)

    const navigate = useNavigate();


    const homeClick = () => {
        setOnScreenDate(() => new Date())
        // clickToHome()
        navigate('/');
    }

    const rightArrowClick = () => {
        // setShowTransition(false)
        setOnScreenDate(() => new Date(onScreenDate.setMonth(onScreenDate.getMonth() + 1)))
    }

    const leftArrowClick = () => {
        // setShowTransition(false)
        setOnScreenDate(() => new Date(onScreenDate.setMonth(onScreenDate.getMonth() - 1)))
    }

    return (
        <div className="fix__footer container" id="main__menu">
            <div className="tr__box__acc1">
                <div className="down__menu1">
                    <ul className="new__nav">
                        <li className="nav__item left__arrow">
                            <div onClick={leftArrowClick}
                                className="nav__link left__arrow">
                                <img src={left} alt="Назад" className="nav__img" />
                            </div>
                        </li>
                        <li className="nav__item">
                            <Link to="/transaction/new" className="nav__link">
                                <img src={transaction} alt="Транзнакция" className="nav__img" />
                            </Link>
                        </li>
                        <li className="nav__item">
                            <Link to="/money_accounts/list" className="nav__link">
                                <img src={accounts} alt="Баланс" className="nav__img" />
                            </Link>
                        </li>
                        <li className="nav__item">
                            <Link to="/report" className="nav__link">
                                <img src={report} alt="Отчёт" className="nav__img" />
                            </Link>
                        </li>
                        <li className="nav__item">
                            <Link to="/exclude_report" className="nav__link">
                                <img src={exclude} alt="Отчёт2" className="nav__img" />
                            </Link>
                        </li>
                        <li className="nav__item">
                            <Link to='/settings' className="nav__link">
                                <img src={settings} alt="Настройки" className="nav__img" />
                            </Link>
                        </li>
                        <li className="nav__item">
                            <Link to="/" className="nav__link" onClick={homeClick} id="homeButton">
                                <img src={home} alt="Домашняя" className="nav__img" />
                            </Link>
                        </li>
                        <li className="nav__item right__arrow">
                            <div onClick={rightArrowClick}
                                className="nav__link right__arrow">
                                <img src={right} alt="Вперёд" className="nav__img" />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MainMenu;
