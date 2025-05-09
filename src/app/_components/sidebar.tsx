"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Settings,
  Package,
  ShoppingCart,
  BarChart,
  FileBarChart,
  LogOut,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

interface SidebarProps {
  className?: string;
  name?: string;
  email?: string;
}

export function Sidebar({ className = "", email, name }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 1024 &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMounted]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" />, href: "/" },
    {
      name: "Barang",
      icon: <Package className="w-5 h-5" />,
      href: "/items",
    },
    {
      name: "Penjualan",
      icon: <ShoppingCart className="w-5 h-5" />,
      href: "/sales",
    },
    {
      name: "Prediksi",
      icon: <BarChart className="w-5 h-5" />,
      href: "/predict",
    },
    {
      name: "Laporan",
      icon: <FileBarChart className="w-5 h-5" />,
      href: "/report",
    },
    {
      name: "Pengaturan",
      icon: <Settings className="w-5 h-5" />,
      href: "/settings",
    },
  ];

  if (pathName === "/login") {
    return null;
  }

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-3.5 left-4 p-2 rounded-full bg-blue-600 text-white shadow-lg z-30 hover:bg-blue-700 transition-colors lg:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-30 z-20 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed left-0 top-0 h-full z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 ease-in-out
          w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          shadow-lg lg:shadow-none
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">IN</span>
              </div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Prediksi
              </h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="px-4 mb-6">
              <div className="py-2 px-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Selamat datang kembali
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">
                  {name || "Admin"}
                </p>
              </div>
            </div>
            <ul className="space-y-1 px-3">
              {menuItems.map((item, index) => {
                const isActive = pathName === item.href;
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      onClick={closeSidebarOnMobile}
                    >
                      <span
                        className={`flex-shrink-0 ${
                          isActive ? "text-blue-600 dark:text-blue-400" : ""
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="ml-3">{item.name}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-5 bg-blue-600 dark:bg-blue-500 rounded-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex-shrink-0 flex items-center justify-center text-white font-medium">
                {name ? (
                  name.charAt(0).toUpperCase()
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                  {name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {email || "email@example.com"}
                </p>
              </div>
              <form action={logout}>
                <button
                  className="p-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500"
                  title="Logout"
                  type="submit"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
