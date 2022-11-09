import React, { useState, useEffect } from 'react';
import './calculator.css';


export default function Calculator(props) {
    const [num, setNum] = useState(props.transaction.operation_summ);
    // const [oldNum, setOldNum] = useState(0);
    // const [operator, setOperator] = useState();
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    useEffect(() => {
        if (!props.transaction.operation_summ) {
            setNum(0)
        }
    }, [])


    function inputNum(e) {
        e.preventDefault()
        let input = e.target.value
        if (num === 0) {
            setNum(input);
        } else {
            setNum(num + input)
        }
    }

    function inputDot(e) {
        e.preventDefault()
        let input = e.target.value
        if (num.length >= 1 && !(/\./).test(num)) {
            setNum(num + input)
        }
    }

    function inputOperator(e) {
        e.preventDefault()
        let input = e.target.value
        if (num) {
            if (num.slice(-1) in digits) { setNum(num + input) }
        }
    }


    function clear(e) {
        e.preventDefault()
        setNum(0);
    }

    function del(e) {
        e.preventDefault()
        if (num.length !== 1 && num) {
            setNum(num.slice(0, -1))
       };
    }

    // function porcentagem(e) {
    //     setNum(num / 100);
    // }

    // function changeSign() {
    //     if (num > 0) {
    //         setNum(-num);
    //     } else {
    //         setNum(Math.abs(num));
    //     }
    // }

    // function operatorHandler(e) {
    //     let operatorInput = e.target.value;
    //     setOperator(operatorInput);
    //     setOldNum(num);
    //     setNum(0);
    // }

    function calculate(e) {
        e.preventDefault()
        if (num) {
            if (num.slice(-1) in digits) {
                if (isFinite(eval(num))) {
                    setNum(eval(num).toString())
                    props.setTransaction({ ...props.transaction, operation_summ: eval(num).toString() })
                }
            };
        }
    }

    return (
        <>
            <div className='wrapper'>
                <h2 className='resultado'>{num}</h2>
                <div className='button__box'>
                    <button className='button__calc' onClick={clear}>AC</button>
                    <button className='button__calc' onClick={del}>del</button>
                    <button className='button__calc' style={{ visibility: "hidden" }}>k</button>
                    <button className='orange button__calc' onClick={inputOperator} value={'/'}>/</button>
                    <button className='grey button__calc' onClick={inputNum} value={7}>7</button>
                    <button className='grey button__calc' onClick={inputNum} value={8}>8</button>
                    <button className='grey button__calc' onClick={inputNum} value={9}>9</button>
                    <button className='orange button__calc' onClick={inputOperator} value={'*'}>X</button>
                    <button className='grey button__calc' onClick={inputNum} value={4}>4</button>
                    <button className='grey button__calc' onClick={inputNum} value={5}>5</button>
                    <button className='grey button__calc' onClick={inputNum} value={6}>6</button>
                    <button className='orange button__calc' onClick={inputOperator} value={'-'}>-</button>
                    <button className='grey button__calc' onClick={inputNum} value={1}>1</button>
                    <button className='grey button__calc' onClick={inputNum} value={2}>2</button>
                    <button className='grey button__calc' onClick={inputNum} value={3}>3</button>
                    <button className='orange button__calc' onClick={inputOperator} value={'+'}>+</button>
                    <button className='grey button__calc' onClick={inputNum} value={0}>0</button>
                    <button className='button__calc' style={{ visibility: "hidden" }}>k</button>
                    <button className='grey button__calc' onClick={inputDot} value={"."}>,</button>
                    <button className='orange button__calc' onClick={calculate}>=</button>
                </div>
            </div>
        </>
    )
}