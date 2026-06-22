"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {useSidebar} from "@/context/SidebarContext";
import {
    LayoutDashboard, Package, ShoppingCart, Users, Settings,
    CreditCard, Menu, X, Power, ChevronLeft, ChevronRight,LayoutGrid,
} from "lucide-react";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/users", icon: Users },
    { label: "Orders", href: "/orders", icon: ShoppingCart },
    { label: "Products", href: "/dashboard/products", icon: Package },
    { label: "Category", href: "/dashboard/category", icon: LayoutGrid },
    { label: "Payments", href: "/payments", icon: CreditCard },
    { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { collapsed, setCollapsed } = useSidebar();

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={() => setOpen(!open)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white"
            >
                {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-screen bg-gray-900 text-gray-200 flex flex-col z-40 transform transition-all duration-200
                ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
                ${collapsed ? "w-20" : "w-64"}`}
            >
                {/* Header + desktop collapse toggle */}
                <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
                    {!collapsed && <span className="text-xl font-bold">Admin</span>}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden md:flex p-1.5 rounded-lg hover:bg-gray-800 cursor-pointer"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                title={collapsed ? label : undefined}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                                ${collapsed ? "justify-center" : ""}
                                ${active ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-300"}`}
                            >
                                <Icon size={18} />
                                {!collapsed && label}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    className={`cursor-pointer flex items-center gap-3 px-4 py-4 border border-gray-800 rounded-lg text-gray-300 hover:bg-gray-800 m-2
                    ${collapsed ? "justify-center" : ""}`}
                >
                    {collapsed ? (
                        <Power size={18} className="text-red-500" />
                    ) : (
                        <span className="border border-red-600 rounded px-10 py-1 bg-red-600 text-white flex items-center gap-2">
                            <Power size={18} /> Logout
                        </span>
                    )}
                </button>
            </aside>
        </>
    );
}