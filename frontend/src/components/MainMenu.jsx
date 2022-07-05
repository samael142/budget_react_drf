import React from "react";
import { scroller } from "react-scroll";


const MainMenu = ({ SetOnScreenDate }) => {

    // const scrollToSection = () => {
    //     scroller.scrollTo("current__date", {
    //         duration: 400,
    //         smooth: "easeInOutQuart",
    //     });
    // };

    const homeClick = () => {
        SetOnScreenDate(new Date())
        // setTimeout(scrollToSection, 1000)
    }

    return (
        <div className="fix__footer container">
            <div className="tr__box__acc1">
                <div className="down__menu1">
                    <ul className="new__nav">
                        <li className="nav__item left__arrow">
                            <div
                                className="nav__link left__arrow">
                                <img src="/static/left.svg" alt="Назад" className="nav__img" />
                            </div>
                        </li>
                        <li className="nav__item">
                            <div className="nav__link">
                                <img src="/static/transaction.svg" alt="Транзнакция" className="nav__img" />
                            </div>
                        </li>
                        <li className="nav__item">
                            <div className="nav__link">
                                <img src="/static/accounts.svg" alt="Баланс" className="nav__img" />
                            </div>
                        </li>
                        <li className="nav__item">
                            <div className="nav__link">
                                <img src="/static/report.svg" alt="Отчёт" className="nav__img" />
                            </div>
                        </li>
                        <li className="nav__item">
                            <div className="nav__link">
                                <img src="/static/settings.svg" alt="Настройки" className="nav__img" />
                            </div>
                        </li>
                        <li className="nav__item">
                            <div className="nav__link" onClick={homeClick}>
                                <img src="/static/home.svg" alt="Домашняя" className="nav__img" />
                            </div>
                        </li>
                        <li className="nav__item right__arrow">
                            <div
                                className="nav__link right__arrow">
                                <img src="/static/right.svg" alt="Вперёд" className="nav__img" />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MainMenu;