"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomArrow = ({ onClick, direction, disabled,  }) => {
  const activeColor =  "#F16935";
  const inactiveColor =  "#28397836";

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`rounded-full flex items-center justify-center p-[0.5%] transition-all duration-300 
      ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"} 
      `}
      style={{
        backgroundColor: disabled ? inactiveColor : activeColor,
      }}
    >
      {direction === "prev" ? (
        <ChevronLeft
          className="text-white transition-all duration-300"
          style={{
            fontSize: "clamp(1rem, 1.7vw, 2rem)",
          }}
        />
      ) : (
        <ChevronRight
          className="text-white transition-all duration-300"
          style={{
            fontSize: "clamp(1rem, 1.7vw, 2rem)",
          }}
        />
      )}
    </div>
  );
};

export const CustomPrevArrow = ({ swiperRef, disabled,  }) => (
  <CustomArrow
    direction="prev"
    disabled={disabled}
    onClick={() => swiperRef.current?.slidePrev()}
  />
);

export const CustomNextArrow = ({ swiperRef, disabled, }) => (
  <CustomArrow
    direction="next"
    disabled={disabled}
    onClick={() => swiperRef.current?.slideNext()}
  />
);
