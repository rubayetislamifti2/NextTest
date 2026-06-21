"use client";

import { useState } from "react";
import { Package, ShoppingCart, Users, CreditCard } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const stats = [
    { label: "Total Products", value: "1234", icon: Package, color: "bg-blue-100 text-blue-600" },
    { label: "Total Orders", value: "1234", icon: ShoppingCart, color: "bg-blue-100 text-blue-600" },
    { label: "Total Income", value: "$1234", icon: CreditCard, color: "bg-blue-100 text-blue-600" },
    { label: "Total Users", value: "1234", icon: Users, color: "bg-blue-100 text-blue-600" },
];

const yearlyData = [
    { label: "Jan", income: 4200 },
    { label: "Feb", income: 5100 },
    { label: "Mar", income: 4800 },
    { label: "Apr", income: 6300 },
    { label: "May", income: 5700 },
    { label: "Jun", income: 7200 },
    { label: "Jul", income: 6800 },
    { label: "Aug", income: 8100 },
    { label: "Sep", income: 7500 },
    { label: "Oct", income: 9000 },
    { label: "Nov", income: 8400 },
    { label: "Dec", income: 9800 },
];

// বর্তমান মাসের সব দিন নিয়ে ডামি ডেটা জেনারেট করছি
function generateMonthlyData() {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => ({
        label: String(i + 1),
        income: Math.floor(Math.random() * 4000) + 1000, // ডামি ভ্যালু, পরে API দিয়ে replace করবে
    }));
}

const monthlyData = generateMonthlyData();

export default function DashboardPage() {
    const [view, setView] = useState<"yearly" | "monthly">("yearly");
    const chartData = view === "yearly" ? yearlyData : monthlyData;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        className="bg-white rounded-xl shadow p-5 flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-full ${color}`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{label}</p>
                            <p className="text-xl font-bold">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Income metrics chart */}
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Income Overview</h2>

                    {/* Toggle buttons */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setView("yearly")}
                            className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition ${
                                view === "yearly"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            Yearly
                        </button>
                        <button
                            onClick={() => setView("monthly")}
                            className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition ${
                                view === "monthly"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip
                            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                            formatter={(value) => [`$${value}`, "Income"]}
                        />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "#2563eb" }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}