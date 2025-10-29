"use client";

import { useState, useRef } from 'react';

export const useSwiper = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperState, setSwiperState] = useState({
    isBeginning: true,
    isEnd: false,
  });
  const swiperRef = useRef(null);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
    setSwiperState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  };

  return {
    activeIndex,
    swiperRef,
    handleSlideChange,
    setActiveIndex,
    swiperState,
  };
};
