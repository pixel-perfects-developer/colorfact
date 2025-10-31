"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Upload, Palette } from "lucide-react"; // CTA icons

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
    <header className="sticky top-0 bg-[#FAFAFA] w-full z-[3000] py-[1.5rem] lg:py-[0.5%] shadow-sm">
      <div className="flex items-center justify-between w-full px-[5%] relative">
        {/* 🟣 Left (Logo) */}
        <div className="flex items-center justify-start w-1/3">
          <Link href="/" className="flex items-center">
            <Image
              src="/colorfact logo.png"
              alt="ColorFact logo"
              width={160}
              height={160}
              priority
              className="w-[80%] h-auto object-contain"
            />
          </Link>
        </div>

        {/* 🟢 Center (Navigation Menu) */}
        <nav className="hidden lg:flex items-center justify-center gap-x-8 font-medium text-[#333] w-1/3">
          <Link
            href="/our-story"
            className="hover:text-[#F16935] transition-colors whitespace-nowrap"
          >
            Notre Histoire
          </Link>
          <Link
            href="/trends"
            className="hover:text-[#F16935] transition-colors whitespace-nowrap"
          >
            Tendances
          </Link>
        </nav>

        {/* 🔵 Right (Search Bar + CTAs) */}
        <div
          className="hidden lg:flex items-center justify-end w-1/3 gap-3"
          ref={searchRef}
        >
          {/* Search bar */}
          {/* <div className="relative flex items-center bg-white border border-gray-200 text-sm text-[#333]  rounded-[12px] shadow-sm outline-none transition-all duration-300">
            <input
              type="text"
              placeholder="Rechercher..."
              className="px-3 py-[6px] outline-none w-[160px] xl:w-[180px] bg-transparent"
            />
            <button
              className="p-2 rounded-full bg-white hover:bg-gray-50 transition"
              aria-label="Rechercher"
            >
              <svg
                className="w-5 h-5 text-[#333]"
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
          </div> */}

          {/* 🧡 CTA Buttons (from Banner) */}
          <Link
            href="/televerser-image"
              className="btn-orange !text-[0.8rem] !px-3 !py-1.5 flex items-center gap-1 whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            Importer
          </Link>

          <Link
            href="/palette-de-couleurs"
            className="btn-orange !text-[0.8rem] !px-3 !py-1.5 flex items-center gap-1 whitespace-nowrap"
          >
            <Palette className="w-4 h-4" />
            Couleur
          </Link>
        </div>

        {/* 🍔 Burger menu (mobile) */}
        <div className="flex items-center justify-end w-1/3 lg:hidden">
          <button onClick={() => setDrawerOpen(!isDrawerOpen)}>
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
        </div>
      </div>

      {/* 🟠 Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[3001] transition-all duration-500 ease-in-out ${
          isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ease-in-out ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setDrawerOpen(false)}
        ></div>

        {/* Drawer Panel */}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="flex flex-col gap-5 text-[#333] text-[1.1rem] font-medium">
            <Link href="/our-story" onClick={() => setDrawerOpen(false)}>
              Notre Histoire
            </Link>
            <Link href="/trends" onClick={() => setDrawerOpen(false)}>
              Tendances
            </Link>

            {/* 🧡 Mobile CTA Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <Link
                href="/televerser-image"
                className="btn-orange flex items-center justify-center gap-2 !py-2"
                onClick={() => setDrawerOpen(false)}
              >
                <Upload className="w-4 h-4" />
                Importer un Article
              </Link>
              <Link
                href="/palette-de-couleurs"
                className="btn-orange flex items-center justify-center gap-2 !py-2"
                onClick={() => setDrawerOpen(false)}
              >
                <Palette className="w-4 h-4" />
                Choisir une Couleur
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
