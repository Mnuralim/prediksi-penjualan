"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

interface NavbarProps {
  className?: string;
  name?: string;
  email?: string;
}

export function Navbar({ className = "", email, name }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathName = usePathname();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        isProfileOpen
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  if (pathName === "/login") {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-center">
        <h2
          className={`text-base md:text-lg font-medium text-gray-700 dark:text-gray-200 ${
            isMobile ? "pl-10" : ""
          }`}
        >
          Selamat datang,{" "}
          <span className="text-blue-600 dark:text-blue-400">
            {name || "Admin"}
          </span>
        </h2>
      </div>

      <div className="relative profile-menu" ref={profileMenuRef}>
        <button
          onClick={toggleProfile}
          className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-expanded={isProfileOpen}
          aria-haspopup="true"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white">
            {name ? name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <span className="text-gray-700 dark:text-gray-200 hidden sm:block">
            {name || "User"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
              isProfileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-800 z-50">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {email || "email@example.com"}
              </p>
            </div>
            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <User className="w-4 h-4" />
              <span>Profil</span>
            </button>
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
