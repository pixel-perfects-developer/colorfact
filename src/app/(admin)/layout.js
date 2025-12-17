"use client";

import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Dashboard/SideBar";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // 🔐 AUTH CHECK
  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");

    if (isLogin !== "true") {
      router.replace("/authentication/login");
    } else {
      setIsAuthChecked(true);
    }
  }, [router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // ⛔ Prevent rendering before auth check
  if (!isAuthChecked) return null;

  return (
    <div className="flex min-h-[50vh] overflow-y-auto bg-[#faf5e7]">
      
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 block lg:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0"
          onClick={() => setSidebarOpen(false)}
        />
        <aside className="relative w-64 bg-[#FFF3F3] h-full">
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
          <Sidebar />
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col bg-[#FFF3F3] flex-shrink-0 w-64 pt-2">
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <Image
              src="/header.png"
              alt="Logo"
              width={92}
              height={22}
              className="ml-2 w-[80%]"
            />
          </Link>
        </div>
        <Sidebar />
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#faf5e7] shadow-md">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
