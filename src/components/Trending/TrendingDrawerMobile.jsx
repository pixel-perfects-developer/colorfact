"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const slugify = (text) =>
  text
    ?.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const TrendingDrawerMobile = ({ mostRead }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Button */}
      <button onClick={() => setOpen(!open)} >
        <svg
          className="w-7 h-7 text-[#333]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div
        className={`mt-[5.5rem] lg:hidden fixed inset-0 z-[3001] transition-all duration-500 ease-in-out ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ease-in-out ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        ></div>

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[80%] md:w-[50%] bg-white p-6 shadow-lg transform transition-transform duration-[600ms] ease-in-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}
          <div className="flex justify-end w-[98%] mb-6">
            <button onClick={() => setOpen(false)} className="border-2 border-[#F16935] rounded-full p-[2%] flex items-center justify-center" >
              <svg
                className="w-4 h-4 text-[#333]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/*  */}
    <div>
           <h3 className="text-lg font-semibold">Most Read</h3>

      <div className="mt-[2%] border-t border-black overflow-y-auto h-[50rem] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]s">
        {mostRead.map((item,index) => (
          <Link key={index} href={`/tendencias/${slugify(item.title)}`}>
            <div className="py-6 border-b border-gray-300 flex gap-4 cursor-pointer">
              <Image
                src={item.mainImage}
                width={400}
                height={400}
                className="w-20 h-20 object-cover"
                alt={item.title}
              />
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {item.category}
                </p>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs uppercase tracking-wide mt-2">
                  BY {item.authorName}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
          
        </div>
      </div>
    </>
  );
};

export default TrendingDrawerMobile;
