"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Header = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-[#FFF3F3] w-full z-[3000] py-[2%] lg:py-[0.5%]">
      <div className="container-global flex justify-between items-center px-0">
        {/* Logo */}
        <Link href={"/"} className="w-[30%] md:w-[20%] lg:w-[10%]">
          <Image
            src="/colorfact logo.png"
            alt="header-logo"
            priority
            width={200}
            height={200}
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex justify-between xl:w-[20%] 2xl:w-[15%] lg:w-[30%] gap-x-[1rem] lg:gap-x-0">
          <Link href={"/"}>Accueil</Link>
          <Link href={"/a-propos"}>À propos</Link>
          <Link href={"/contact"}>Contact</Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="lg:hidden">
          <button onClick={() => setDrawerOpen(!isDrawerOpen)}>
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isDrawerOpen && (
        <>
          {/* Mobile Drawer Menu (Animated) */}
<div
  className={`lg:hidden fixed inset-0 z-[3001] transition-all duration-300 ${
    isDrawerOpen ? "visible opacity-100" : "invisible opacity-0"
  }`}
>
  {/* Backdrop */}
  <div
    className="absolute inset-0 bg-black/20 bg-opacity-50"
    onClick={() => setDrawerOpen(false)}
  ></div>

  {/* Drawer Panel */}
  <div
    className={`absolute top-0 right-0 h-full w-[70%] md:w-[30%] bg-white p-6 shadow-lg transform transition-transform duration-300 ${
      isDrawerOpen ? "translate-x-0" : "translate-x-full"
    }`}
  >
    {/* Close Button */}
    <div className="flex justify-end items-center mb-6">
      <button onClick={() => setDrawerOpen(false)}>
        <svg
          className="w-6 h-6 text-black"
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
    <nav className="flex flex-col gap-4">
      <Link href="/" onClick={() => setDrawerOpen(false)}>Accueil</Link>
      <Link href="/a-propos" onClick={() => setDrawerOpen(false)}>À propos</Link>
      <Link href="/contact" onClick={() => setDrawerOpen(false)}>Contact</Link>
    </nav>
  </div>
</div>

        </>
      )}
    </header>
  );
};

export default Header;
