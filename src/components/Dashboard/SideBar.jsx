"use client";

import {
  Users,
  Settings as SettingsIcon,
  LineChart,
  PlayCircle,
  Menu,
  X,
  ChevronDown,
  List,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {  useState } from "react";

export default function Sidebar({ isCollapsed = false, onTabClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openTrends, setOpenTrends] = useState(false);
  const pathname = usePathname();



  const btn = [
    { label: "Dashboard", icon: PlayCircle, href: "/dashboard" },

    {
      label: "Manage Trends",
      icon: LineChart,
      accordion: true,
      children: [
        {
          label: "All Trends",
          href: "/dashboard/trends",
          icon: List,
        },
        {
          label: "Create Trend",
          href: "/dashboard/trends/create",
          icon: PlusCircle,
        },
      ],
    },

    { label: "Users", icon: Users, href: "/dashboard/users" },
    { label: "Settings", icon: SettingsIcon, href: "/dashboard/setting" },
  ];

  /* ================= COMMON MENU RENDER ================= */
  const renderMenu = () =>
    btn.map((item, index) => {
      const Icon = item.icon;

      /* ===== MANAGE TRENDS ACCORDION ===== */
      if (item.accordion) {
        return (
          <div key={index} className="w-[90%] m-auto">
            <button
              type="button"
              onClick={() => setOpenTrends((p) => !p)}
              className={`w-full flex items-center gap-3 px-[4%] py-[4%] rounded-[6px]
          
              `}
            >
              <Icon className="size-[0.9rem] lg:size-[0.8vw] 2xl:size-[1.1rem]" />

              {!isCollapsed && (
                <>
                  <span className="flex-1 font-bold text-left text-[0.9rem] lg:text-[0.8vw] 2xl:text-[1.1rem]">
                    Manage Trends
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openTrends ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {/* 🔽 Accordion Children */}
            {openTrends && !isCollapsed && (
              <div className="ml-[12%]">
       {item.children.map((child) => {
  const ChildIcon = child.icon;
  const cleanPath = pathname.replace(/\/$/, "");
  const isChildActive = cleanPath === child.href;

  return (
    <Link
      key={child.href}
      href={child.href}
      onClick={() => {
        onTabClick?.();
        setSidebarOpen(false);
      }}
      className={`flex items-center  my-[2%] gap-x-2 p-[4%] rounded-md
        ${
          isChildActive
            ? "bg-[#f1b7b9] text-white"
            : "hover:bg-[#f1b7b9] hover:text-white"
        }
      `}
    >
      <ChildIcon className="size-[0.9rem] lg:size-[0.8vw] 2xl:size-[1.1rem]" />
      <span className="text-[0.8rem] lg:text-[0.7vw] 2xl:text-[0.9rem]">
        {child.label}
      </span>
    </Link>
  );
})}

              </div>
            )}
          </div>
        );
      }

      /* ===== NORMAL LINKS ===== */
      const isActive = pathname.replace(/\/$/, "") === item.href;

      return (
        <h5 key={index}>
          <Link
            href={item.href}
            onClick={() => {
              onTabClick?.();
              setSidebarOpen(false);
            }}
            className={`m-auto flex items-center px-[4%] py-[4%] w-[90%] gap-3 rounded-[6px]
              ${
                isActive
                  ? "bg-[#EEA9AB] text-white"
                  : "hover:bg-[#EEA9AB] hover:text-white"
              }
            `}
          >
            <Icon className="size-[0.9rem] lg:size-[0.8vw] 2xl:size-[1.1rem]" />
            {!isCollapsed && (
              <span className="text-[0.9rem] lg:text-[0.8vw] 2xl:text-[1.1rem]">
                {item.label}
              </span>
            )}
          </Link>
        </h5>
      );
    });

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="flex-1 lg:hidden flex flex-col sticky top-0 w-full">
        <header className="flex items-center justify-between p-4 bg-[#faf5e7] shadow-md">
          <Link href="/">
            <Image
              src="/header.png"
              alt="Logo"
              width={150}
              height={150}
              className="w-[7rem]"
            />
          </Link>

          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </header>
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed inset-y-0 right-0 z-40 lg:hidden w-64
          transition-transform duration-300 ease-in-out
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

          <div className="space-y-4 mt-4">{renderMenu()}</div>
        </aside>
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden h-screen w-[16%] p-[0.5%] fixed lg:flex flex-col bg-[#FFF3F3]">
        <div>
          <Link href="/">
            <Image
              src="/header.png"
              alt="Logo"
              width={92}
              height={22}
              className="w-[70%]"
            />
          </Link>
        </div>

        <div className="space-y-[2%] mt-[6%]">{renderMenu()}</div>
      </aside>
    </>
  );
}
