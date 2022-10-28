import React, { useState, useEffect } from 'react';
import ApiService from '../API/ApiService';
import MainList from '../MainList';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper";
import { scroller } from "react-scroll";
import { useParams, useNavigate } from 'react-router-dom';



const TransactionsList = ({ onScreenDate }) => {
    const [transactions, setTransactions] = useState([])
    const [totals, setTotals] = useState([])
    const [prevTransactions, setPrevTransactions] = useState([])
    const [pastTransactions, setPastTransactions] = useState([])
    const [prevTotals, setPrevTotals] = useState([])
    const [pastTotals, setPastTotals] = useState([])
    const [pastClone, setPastClone] = useState(structuredClone(onScreenDate))
    const [prevClone, setPrevClone] = useState(structuredClone(onScreenDate))

    let params = useParams();

    useEffect(() => {
        const el = document.getElementById("homeButton");
        el.addEventListener("click", clickToHome)
        fetchTransactions()
        setPrevClone(new Date(prevClone.setMonth(onScreenDate.getMonth() - 1)));
        setPastClone(new Date(pastClone.setMonth(onScreenDate.getMonth() + 1)));
        fetchPrevTransactions()
        fetchPastTransactions()
        return () => {
            el.removeEventListener("click", clickToHome)
        }
    }, [])

    useEffect(() => {
        if (totals.length !== 0) {
            scrollToSection()
        }
    }, [totals]);

    const scrollToSection = () => {
        scroller.scrollTo("current__date");
    };

    const clickToHome = () => {
        fetchTransactions()
        setPrevClone(new Date(prevClone.setMonth(onScreenDate.getMonth() - 1)));
        setPastClone(new Date(pastClone.setMonth(onScreenDate.getMonth() + 1)));
        fetchPrevTransactions()
        fetchPastTransactions()
    }

    async function fetchTransactions() {
        let totalsResponse
        let transactionsResponse
        if (params.accountId) {
            totalsResponse = await ApiService.getTotalsPerAccount(onScreenDate, params.accountId)
            transactionsResponse = await ApiService.getTransactionsPerAccount(onScreenDate, params.accountId)
        } else {
            totalsResponse = await ApiService.getTotals(onScreenDate)
            transactionsResponse = await ApiService.getTransactions(onScreenDate)
        }
        setTransactions(transactionsResponse)
        setTotals(totalsResponse)
    }

    async function fetchPrevTransactions() {
        if (params.accountId) {
            setPrevTransactions(await ApiService.getTransactionsPerAccount(prevClone, params.accountId))
            setPrevTotals(await ApiService.getTotalsPerAccount(prevClone, params.accountId))
        } else {
            setPrevTransactions(await ApiService.getTransactions(prevClone))
            setPrevTotals(await ApiService.getTotals(prevClone))
        }
    }

    async function fetchPastTransactions() {
        if (params.accountId) {
            setPastTransactions(await ApiService.getTransactionsPerAccount(pastClone, params.accountId))
            setPastTotals(await ApiService.getTotalsPerAccount(pastClone, params.accountId))
        } else {
            setPastTransactions(await ApiService.getTransactions(pastClone))
            setPastTotals(await ApiService.getTotals(pastClone))
        }
    }

    async function swipeToPast() {
        setPrevTotals(totals)
        setPrevTransactions(transactions)
        setTotals(pastTotals)
        setTransactions(pastTransactions)
        setPastClone(new Date(pastClone.setMonth(pastClone.getMonth() + 1)))
        setPrevClone(new Date(prevClone.setMonth(prevClone.getMonth() + 1)))
        await fetchPastTransactions()
    }

    async function swipeToPrev() {
        setPastTotals(totals)
        setPastTransactions(transactions)
        setTotals(prevTotals)
        setTransactions(prevTransactions)
        setPrevClone(new Date(prevClone.setMonth(prevClone.getMonth() - 1)))
        setPastClone(new Date(pastClone.setMonth(pastClone.getMonth() - 1)))
        await fetchPrevTransactions()
    }

    return (
        <>
            <Swiper
                modules={[Navigation]}
                grabCursor={true}
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                className="mySwiper"
                onReachBeginning={swipeToPrev}
                onReachEnd={swipeToPast}
            // navigation={{
            //     nextEl: '.right__arrow',
            //     prevEl: '.left__arrow',
            //     navigation: true
            // }}
            >
                <SwiperSlide>
                    <MainList
                        totals={totals}
                        transactions={transactions}
                    />
                </SwiperSlide>
            </Swiper>
        </>
    );
}

export default TransactionsList;
