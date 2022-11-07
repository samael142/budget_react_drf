import React, { useState } from 'react';
import ApiService from '../API/ApiService';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { MainContext } from "../../context";


const Login = () => {

    const navigate = useNavigate()
    const { setIsAuthenticated, getTransactionParameters } = useContext(MainContext)

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [showLoginError, setShowLoginError] = useState(false)

    const handleSubmit = async (event) => {

        event.preventDefault()
        try {
            const response = await ApiService.getToken(login, password)
            setIsAuthenticated(true)
            localStorage.setItem('token', response.data.token)
            getTransactionParameters()
        } catch (err) {
            setShowLoginError(true)
        }
    }

    return (
        <div className="container no_footer">
            <div className="title__single">Вход в систему</div>
            <br />
            <form onSubmit={handleSubmit}>
                <input value={login} onChange={e => setLogin(e.target.value)} type="text" name="username" className="form__control" placeholder="Логин" required />
                <br />
                {showLoginError && <label className="red__color" htmlFor="password">Неправильное имя пользователя или пароль</label>}
                <input id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" className="form__control" placeholder="Пароль" required />
                <br />
                <br />
                <div className="tr__upper tr__upper__left">
                    <input type="submit" className="btn btn__green" value="Войти" />
                </div>
            </form>
        </div>
    )
}

export default Login;