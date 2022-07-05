import React from "react";
import MainList from "./MainList";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper";

export default function SwiperTest(props) {
    return (
        <>
            <Swiper
                modules={[Navigation]}
                grabCursor={true}
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                className="mySwiper"
                onReachBeginning={() => { props.SetOnScreenDate(new Date(props.onScreenDate.setMonth(props.onScreenDate.getMonth() - 1))) }}
                onReachEnd={() => { props.SetOnScreenDate(new Date(props.onScreenDate.setMonth(props.onScreenDate.getMonth() + 1))) }}
                navigation={{
                    nextEl: '.right__arrow',
                    prevEl: '.left__arrow',
                    navigation: true
                }}
            >
                <SwiperSlide>
                    <MainList
                        totals={props.totals}
                        transactions={props.transactions}
                    />
                </SwiperSlide>
            </Swiper>
        </>
    );
}
