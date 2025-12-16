"use client";
import {
  Users,
  Settings as SettingsIcon,
  LineChart,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isCollapsed = false, onTabClick }) {
  const pathname = usePathname();

  const btn = [
    { label: "Dashboard", icon: PlayCircle, href: "/dashboard" },
    { label: "Manage Trends", icon: LineChart, href: "/dashboard/trends" },
    { label: "Users", icon: Users, href: "/dashboard/users" },
    { label: "Settings", icon: SettingsIcon, href: "/dashboard/setting" },
  ];

  return (
    <div className="w-full h-screen p-[4%] bg-[#FFF3F3] overflow-hidden">
     

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
    </div>
  );
}