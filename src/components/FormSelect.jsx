"use client";
import React, { forwardRef } from "react";

const FormSelect = forwardRef(
  (
    {
      setOpen,
      open,
      selectedLabel,
      MainService,
      handleSelectChange,
      selectedCategory,
    },
    ref
  ) => {
    return (
      <div className="flex   justify-center mb-4">
        <div ref={ref} className="relative w-full">
          <button
            onClick={() => setOpen(!open)}
            className={`w-full text-left border-2 border-[#A6A6A6] text-[black] py-[0.45rem] px-[1rem]
 ${
   open ? "rounded-tl-[0.45rem] rounded-tr-[0.45rem]" : "rounded-[0.45rem]"
 } bg-white
                       transition-all duration-200 focus:outline-none flex items-center justify-between`}
          >
            <span>{selectedCategory || "Select Category"}</span>

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
            className={`absolute left-0 w-full bg-[#00cfaa] rounded-bl-[0.45rem] rounded-br-[0.45rem]
                        shadow-md overflow-hidden z-[50]
                        transition-all duration-300 origin-top ${
                          open
                            ? "scale-y-100 opacity-100 visible"
                            : "scale-y-0 opacity-0 invisible"
                        }`}
          >
            {MainService?.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  handleSelectChange(item.name);
                  setOpen(false);
                }}
                className={`p-[1rem] text-sm text-white cursor-pointer transition-colors duration-150 ${
                  selectedCategory === item.id
                    ? "bg-[#292a76] font-medium"
                    : "bg-[#00cfaa]"
                }`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default FormSelect;
