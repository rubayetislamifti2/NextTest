"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, User, Settings, LogOut } from "lucide-react";

export default function Header() {
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
            {/* Search box */}
            <div className="relative w-full max-w-md">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Right side: notification + profile */}
            <div className="flex items-center gap-5 ml-4">
                {/* Notification bell - independent button */}
                <button className="relative cursor-pointer">
                    <Bell size={22} className="text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        3
                    </span>
                </button>

                {/* Profile + dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center">
                            N
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-gray-800">Rubayet</p>
                            <p className="text-gray-400 text-xs">Admin</p>
                        </div>
                    </div>

                    {/* Profile dropdown - সবসময় mounted, animation দিয়ে show/hide */}
                    <div
                        className={`absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 origin-top-right transition-all duration-200 ease-out
                        ${
                            profileOpen
                                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                        }`}
                    >
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="font-medium text-gray-800">Rubayet</p>
                            <p className="text-xs text-gray-400">rubayet@sparktechagency.com</p>
                        </div>

                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                            <User size={16} />
                            Profile
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                            <Settings size={16} />
                            Settings
                        </button>

                        <div className="border-t border-gray-100 mt-1">
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}