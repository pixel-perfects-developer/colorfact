"use client";

import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Dashboard/SideBar";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-[50vh] overflow-y-auto bg-[#faf5e7]">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 block lg:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-0" onClick={() => setSidebarOpen(false)} />
        <aside className="relative w-64 bg-[#FFF3F3] h-full ">
          <div className="flex justify-between p-4">
            <Image
              src="/header.png"
              alt="Logo"
              width={92}
              height={22}
              className="ml-2"
            />
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <Sidebar isCollapsed={false} />
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden  lg:flex flex-col bg-[#FFF3F3] flex-shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20 pt-6" : "w-64 pt-2"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <Link href="/">  
            <Image
              src="/header.png"
              alt="Logo"
              width={92}
              height={22}
              className="ml-2 w-[80%]"
            />
            </Link>
          )}
          {/* <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-3"
          >
            {isCollapsed ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-text-align-justify-icon lucide-text-align-justify"><path d="M3 5h18"/><path d="M3 12h18"/><path d="M3 19h18"/></svg>
             :
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>}
          </button> */}
        </div>
        <Sidebar isCollapsed={isCollapsed} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
         {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#faf5e7] shadow-md">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}