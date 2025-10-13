"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

const Header = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Close search bar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
   <header className="sticky top-0 bg-[#FAFAFA] w-full z-[3000] py-[1.5rem] lg:py-[1%] shadow-sm">
  <div className="flex items-center justify-between w-full px-[5%] relative">
    
    {/* 🟣 Mobile Burger Icon (Left) */}
    <div className="lg:hidden flex items-center">
      <button onClick={() => setDrawerOpen(!isDrawerOpen)}>
        <svg
          className="w-6 h-6 text-[#333]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    {/* 🟢 Centered Logo */}
    <div className="absolute left-1/2 transform -translate-x-1/2">
      <Link href="/" className="flex justify-center items-center w-[auto] md:w-[25%] lg:w-[60%]">
        <Image
          src="/colorfact logo.png"
          alt="ColorFact logo"
          width={200}
          height={200}
          priority
          className="w-[60%] md:w-full h-auto object-contain"
        />
      </Link>
    </div>

    {/* 🔵 Desktop Nav Links (Right Side) */}
    <nav className="hidden lg:flex items-center gap-x-[2.5rem] font-medium text-[#333] ml-auto">
      <Link href="/our-story" className="hover:text-[#F16935] transition-colors">
        Our Story
      </Link>
      <Link href="/trends" className="hover:text-[#F16935] transition-colors">
        Trends
      </Link>
      <Link href="/article-finder" className="hover:text-[#F16935] transition-colors">
        Article Finder
      </Link>

      {/* 🔍 Search Input + Icon */}
      <div className="relative flex items-center bg-white border border-gray-200 text-sm text-[#333]  rounded-full shadow-sm outline-none transition-all duration-300">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-[4%] outline-none"
        />
        <button
          className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition "
          aria-label="Search"
        >
          <svg
            className="w-6 h-6 text-[#333]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.35-4.65a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </nav>
  </div>

  {/* 🟠 Mobile Drawer (unchanged) */}
<div
  className={`lg:hidden fixed inset-0 z-[3001] transition-all duration-500 ease-in-out ${
    isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
  }`}
>

  {/* 🔹 Backdrop (fade-in/out) */}
  <div
    className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ease-in-out ${
      isDrawerOpen ? "opacity-100" : "opacity-0"
    }`}
    onClick={() => setDrawerOpen(false)}
  ></div>

  {/* 🔹 Drawer Panel (slide-in/out animation) */}
  <div
    className={`absolute top-0 right-0 h-full w-[70%] md:w-[50%] bg-white p-6 shadow-lg transform transition-transform duration-[600ms] ease-in-out ${
      isDrawerOpen ? "translate-x-0" : "translate-x-full"
    }`}
  >
    {/* Close Button */}
    <div className="flex justify-end mb-6">
      <button onClick={() => setDrawerOpen(false)}>
        <svg
          className="w-6 h-6 text-[#333]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Nav Links */}
    <nav className="flex flex-col gap-5 text-[#333] text-[1.1rem] font-medium">
      <Link href="/our-story" onClick={() => setDrawerOpen(false)}>
        Our Story
      </Link>
      <Link href="/trends" onClick={() => setDrawerOpen(false)}>
        Trends
      </Link>
      <Link href="/article-finder" onClick={() => setDrawerOpen(false)}>
        Article Finder
      </Link>

      {/* Search Box */}
      <div className="mt-6">
     <div className="relative flex items-center gap-x-2 bg-white border border-gray-200 text-sm text-[#333] rounded-full shadow-sm overflow-hidden">
  <input
    type="text"
    placeholder="Search..."
    className="flex-1 px-4 py-2 outline-none bg-transparent"
  />
  <button
    className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition"
    aria-label="Search"
  >
            <svg
  className="w-6 h-6 text-[#333] hover:text-[#F16935] transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.35-4.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  </div>
</div>

</header>

  );
};

export default Header;
