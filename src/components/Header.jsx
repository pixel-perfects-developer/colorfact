"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Upload, Palette } from "lucide-react"; 

const Header = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);


  return (
    <header className="sticky top-0 bg-[#FAFAFA] w-full z-[3000] flex flex-col justify-center items-center h-[5rem] lg:h-[10vh] shadow-sm">
      <div className="flex items-center justify-between w-full px-[5%] relative">
        {/* 🟣 Left (Logo) */}
        <div className="flex items-center justify-start w-1/3">
          <Link href="/" className="flex items-center">
            <Image
              src={"/header.png"}
              alt="ColorFact logo"
              width={120}
              height={120}
              priority
              className="object-contain w-[80px] md:w-[70px] lg:w-[6vw] 2xl:w-[120px]"
            />
          </Link>
        </div>

        {/* 🟢 Center (Navigation Menu) */}
        <nav className="hidden lg:flex items-center justify-center gap-x-8 font-medium text-[#333] w-1/3">
          <Link
            href={"#"}
          >
         <h5 className="hover:text-[#F16935] transition-colors whitespace-nowrap"> Notre Histoire</h5>
          </Link>
          <Link
            href={"/tendances"}

          >
           <h5 
            className="hover:text-[#F16935] transition-colors whitespace-nowrap"
           > Tendances</h5>
          </Link>
        </nav>

        {/* 🔵 Right (Search Bar + CTAs) */}
        <div
          className="hidden lg:flex items-center justify-end w-1/3 gap-3"
        >
          {/* 🧡 CTA Buttons (from Banner) */}
          <Link
            href="/image-search"
            className="btn-orange  flex items-center gap-1 whitespace-nowrap"
          >
            <Upload className="size-5 lg:size-[0.85vw] 2xl:size-[0.85rem]" />
            Importer
          </Link>

          <Link
            href="/color-search"
            className="btn-orange  flex items-center gap-1 whitespace-nowrap"
          >
            <Palette className="size-5 lg:size-[0.85vw] 2xl:size-[0.85rem]"/>
            Couleur
          </Link>
         
        </div>

        {/* 🍔 Burger menu (mobile) */}
        <div className="flex items-center justify-end w-1/3 lg:hidden">
          <button onClick={() => setDrawerOpen(!isDrawerOpen)}>
            <svg
              className="size-7 text-[#333]"
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
        className={`lg:hidden fixed inset-0 z-[3001] transition-all duration-500 ease-in-out ${isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ease-in-out ${isDrawerOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setDrawerOpen(false)}
        ></div>

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[80%] md:w-[50%] bg-white p-6 shadow-lg transform transition-transform duration-[600ms] ease-in-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Close Button */}
          <div className="flex justify-end mb-6">
            <button onClick={() => setDrawerOpen(false)}>
              <svg
                className="size-6 text-[#333]"
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
          {/* Drawer Links */}
          <nav className="flex flex-col gap-5 text-[#333] text-[1.1rem] font-medium">
            <Link href="/our-story" onClick={() => setDrawerOpen(false)}>
              Notre Histoire
            </Link>
            <Link href={"/tendances"} onClick={() => setDrawerOpen(false)}>
              Tendances
            </Link>

            {/* 🧡 Mobile CTA Buttons */}
            <div className="flex  flex-col gap-3 mt-6">
              <Link
                href="/image-search"
                className="btn-orange flex items-center justify-center gap-2 !py-2"
                onClick={() => setDrawerOpen(false)}
              >
                <Upload className="w-4 h-4" />
                Importer un Article
              </Link>
              <Link
                href="/color-search"
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
