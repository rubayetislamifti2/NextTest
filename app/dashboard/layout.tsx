"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { collapsed } = useSidebar();
    return (
        <div className="flex">
            <Sidebar />
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-200
                ${collapsed ? "md:ml-20" : "md:ml-64"}`}
            >
                <Header />
                <main className="flex-1 p-6 bg-gray-50">{children}</main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <LayoutContent {...{ children }} />
        </SidebarProvider>
    );
}