"use client";
import {
  Users,
  Settings as SettingsIcon,
  LineChart,
  PlayCircle,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ isCollapsed = false, onTabClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();


  const btn = [
    { label: "Dashboard", icon: PlayCircle, href: "/dashboard" },
    { label: "Manage Trends", icon: LineChart, href: "/dashboard/trends" },
    { label: "Users", icon: Users, href: "/dashboard/users" },
    { label: "Settings", icon: SettingsIcon, href: "/dashboard/setting" },
  ];

  return (
    <>
      <div className="flex-1 lg:hidden flex flex-col sticky top-0 w-full">
        <header className="flex items-center justify-between p-4 bg-[#faf5e7] shadow-md">
             <Link href="/">
            <Image
              src="/header.png"
              alt="Logo"
              width={150}
              height={150}
              className=" w-[7rem]"
            />
          </Link>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </header>
      </div>
      {/* Mobile Sidebar */}
     <div
  className={`fixed inset-y-0 right-0 left-auto z-40 lg:hidden
    w-64 transition-transform duration-300 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
  `}
>
        <div
          className="absolute inset-0"
          onClick={() => setSidebarOpen(false)}
        />
        <aside className="relative w-64 bg-[#FFF3F3] h-full">
          <div className="flex justify-end p-4">
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4 mt-4">
        {btn.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname.replace(/\/$/, '') === item.href;

          return (
            <h5 key={index}>
              <Link
                href={item.href}
                onClick={() => onTabClick?.()}
                className={` m-auto flex items-center ${
                  isCollapsed ? "justify-center w-[55%] py-2 " : "py-[4%] w-[90%] gap-3"
                }  px-[4%]  rounded-[6px]
                ${
                  isActive
                    ? "bg-[#EEA9AB] text-white"
                    : "hover:bg-[#EEA9AB] hover:text-white"
                }
                `}
              >
                <Icon size={23} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </h5>
          );
        })}
      </div>
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-[16%] p-[0.5%]  fixed lg:flex flex-col bg-[#FFF3F3] flex-shrink-0 ">
        <div className="flex items-center justify-between ">
          <Link href="/">
            <Image
              src="/header.png"
              alt="Logo"
              width={92}
              height={22}
              className=" w-[70%]"
            />
          </Link>
        </div>
     

      <div className="space-y-[2%] mt-[6%]">
        {btn.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname.replace(/\/$/, '') === item.href;

          return (
            <h5 key={index}>
              <Link
                href={item.href}
                onClick={() => onTabClick?.()}
                className={` m-auto flex items-center ${
                  isCollapsed ? "justify-center w-[55%] py-2 " : "py-[4%] w-[90%] gap-3"
                }  px-[4%]  rounded-[6px]
                ${
                  isActive
                    ? "bg-[#EEA9AB] text-white"
                    : "hover:bg-[#EEA9AB] hover:text-white"
                }
                `}
              >
                <Icon className="size-[0.9rem] lg:size-[0.8vw]  2xl:size-[1.1rem]" />
                {!isCollapsed && <span className="text-[0.9rem] lg:text-[0.8vw]  2xl:text-[1.1rem]">{item.label}</span>}
              </Link>
            </h5>
          );
        })}
      </div>
      </aside>

      {/* Content */}
      
    </>
  );
}