"use client";

import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Dashboard/SideBar";
import Link from "next/link";

export default function AuthLayout({ children }) {

  return (
    <div className="flex min-h-[50vh] overflow-y-auto bg-[#faf5e7]">
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#faf5e7] shadow-md">
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}