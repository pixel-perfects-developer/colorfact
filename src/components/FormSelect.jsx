"use client";
import React, { forwardRef } from "react";

const FormSelect = forwardRef(
  (
    {
      setOpen,
      open,
      selectedLabel,
      isBlueDropdown,
      MainService,
      handleSelectChange,
      selectedCategory,
    },
    ref
  ) => {
    return (
      <div className="flex w-full  justify-center mb-4">
        <div ref={ref} className="relative w-full">
          <button
            onClick={() => setOpen(!open)}
            className={`w-full text-left border-2 border-[#A6A6A6] text-[black] px-[1rem] py-[0.8rem]
 ${
   open ? "rounded-tl-[0.45rem] rounded-tr-[0.45rem]" : "rounded-[0.45rem]"
 } bg-white
                       transition-all duration-200 focus:outline-none flex items-center justify-between`}
          >
            <h5 className=" font-medium ">
              {selectedCategory || selectedLabel}
            </h5>

            {/* Arrow Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`absolute left-0 w-full bg-white rounded-bl-[0.45rem] rounded-br-[0.45rem]
              shadow-md overflow-y-auto z-[50] transition-all duration-300 origin-top
              ${
                open
                  ? "scale-y-100 opacity-100 visible"
                  : "scale-y-0 opacity-0 invisible"
              }
              ${
                MainService?.length > 6 ? "max-h-[25vh]" : "max-h-fit"
              } [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
          >
            {MainService?.map((item) => {
              const value = typeof item === "string" ? item : item?.name;
              const key = typeof item === "string" ? item : item?.id;

              return (
                <div
                  key={key}
                  onClick={() => {
                    handleSelectChange(value);
                    setOpen(false);
                  }}
                  className={`px-[1rem] py-[0.8rem] text-sm cursor-pointer transition-all duration-150
        ${
          selectedCategory?.trim().toLowerCase() === value?.toLowerCase()
            ? isBlueDropdown
              ? "bg-[#2D3F8F] text-white font-medium"
              : "bg-[#F16935] text-white font-medium"
            : isBlueDropdown
            ? "hover:bg-[#2d3f8f85] text-black"
            : "hover:bg-orange-50 text-black"
        }`}
                >
                  {value}
                </div>
              );
            })}

            {/* {MainService?.map((item) => (
  <div
    key={item}
    onClick={() => {
      handleSelectChange(item);
      setOpen(false);
    }}
    className={`px-[1rem] py-[0.8rem] text-sm cursor-pointer transition-all duration-150
      ${
        selectedCategory?.trim().toLowerCase() === item.toLowerCase()
          ? isBlueDropdown
            ? "bg-[#2D3F8F] text-white font-medium"
            : "bg-[#F16935] text-white font-medium"
          : isBlueDropdown
          ? "hover:bg-[#2d3f8f85] text-black"
          : "hover:bg-orange-50 text-black"
      }`}
  >
    {item}
  </div>
))} */}
          </div>
        </div>
      </div>
    );
  }
);

export default FormSelect;
