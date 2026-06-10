"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const fileRef = useRef(null);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [cardLoading, setCardLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Failed");

                const profile = data.data;
                setUser(profile);
                setFormData({ name: profile.name || "", email: profile.email || "" });
                setAvatarPreview(profile.avatar_url || null);
                localStorage.setItem("user", JSON.stringify(profile));
            } catch {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");

            // TODO: Replace with your actual API endpoint
            // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
            //   method: "PUT",
            //   headers: {
            //     "Content-Type": "application/json",
            //     Authorization: `Bearer ${token}`,
            //   },
            //   body: JSON.stringify({ name: formData.name, email: formData.email }),
            // });
            // if (!res.ok) throw new Error("Failed to update profile");
            // const data = await res.json();

            await new Promise((r) => setTimeout(r, 800));
            const updated = { ...user, name: formData.name, email: formData.email, avatar_url: avatarPreview };
            localStorage.setItem("user", JSON.stringify(updated));
            setUser(updated);
            setSuccess("Profile updated successfully!");
            setEditing(false);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    const handleAddCard = async () => {
        setCardLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-card`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    return_url: `${window.location.origin}/profile`,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to initiate payment setup");

            window.location.href = data.data;
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setCardLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <svg className="w-6 h-6 animate-spin text-violet-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-[20px] font-medium text-gray-900">Profile</h1>
                    <button
                        onClick={handleLogout}
                        className="text-[13px] text-red-500 hover:text-red-600 flex items-center gap-1.5 transition"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Logout
                    </button>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

                    {/* Cover */}
                    <div className="h-20 bg-gradient-to-r from-[#1a1a2e] to-[#0f3460]" />

                    {/* Avatar + name */}
                    <div className="flex items-end gap-4 px-6 -mt-9 relative z-10">
                        <div className="relative">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar"
                                    className="w-[72px] h-[72px] rounded-full border-[3px] border-white object-cover"
                                />
                            ) : (
                                <div className="w-[72px] h-[72px] rounded-full border-[3px] border-white bg-violet-600 flex items-center justify-center text-white text-xl font-medium">
                                    {getInitials(user?.name)}
                                </div>
                            )}
                            {editing && (
                                <>
                                    <button
                                        onClick={() => fileRef.current.click()}
                                        className="absolute bottom-0 right-0 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center border-2 border-white"
                                    >
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                    </button>
                                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </>
                            )}
                        </div>
                        <div className="pb-3">
                            <p className="text-[16px] font-medium text-gray-900">{user?.name}</p>
                            <p className="text-[12px] text-gray-500">{user?.email}</p>
                            {user?.isVerified && (
                                <span className="inline-flex items-center gap-1 text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full mt-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verified
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5">

                        {/* Alerts */}
                        {error && (
                            <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-[13px] text-red-600">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 px-3 py-2.5 rounded-lg bg-green-50 border border-green-100 text-[13px] text-green-600">
                                {success}
                            </div>
                        )}

                        {/* Profile info */}
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">Profile info</p>

                        {/* Name */}
                        <div className="flex items-center gap-3 py-3 border-b border-gray-100">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] text-gray-400 mb-0.5">Full name</p>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                        className="w-full text-[14px] border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                                    />
                                ) : (
                                    <p className="text-[14px] text-gray-900">{user?.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-3 py-3 border-b border-gray-100">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] text-gray-400 mb-0.5">Email address</p>
                                {editing ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                                        className="w-full text-[14px] border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                                    />
                                ) : (
                                    <p className="text-[14px] text-gray-900">{user?.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Avatar field */}
                        <div className="flex items-center gap-3 py-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] text-gray-400 mb-0.5">Avatar</p>
                                {editing ? (
                                    <button
                                        onClick={() => fileRef.current.click()}
                                        className="text-[13px] text-violet-600 hover:underline"
                                    >
                                        {avatarPreview ? "Change photo" : "Upload photo"}
                                    </button>
                                ) : (
                                    <p className="text-[14px] text-gray-400 italic">
                                        {avatarPreview ? "Photo uploaded" : "No avatar uploaded"}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Profile edit actions */}
                        <div className="mt-5 flex gap-2">
                            {editing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 h-9 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-[13px] font-medium rounded-lg transition flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Saving...
                                            </>
                                        ) : "Save changes"}
                                    </button>
                                    <button
                                        onClick={() => { setEditing(false); setError(""); setSuccess(""); }}
                                        className="h-9 px-4 border border-gray-200 text-[13px] text-gray-600 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setEditing(true); setSuccess(""); }}
                                    className="flex-1 h-9 border border-violet-200 text-violet-600 text-[13px] font-medium rounded-lg hover:bg-violet-50 transition flex items-center justify-center gap-2"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                    </svg>
                                    Edit profile
                                </button>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-6" />

                        {/* Payment method */}
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">Payment method</p>

                        {user?.card ? (
                            <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[13px] font-medium text-gray-900 capitalize">
                                        {user.card.brand} •••• {user.card.last4}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                        Expires {user.card.exp_month}/{user.card.exp_year}
                                    </p>
                                </div>
                                <span className="text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                    Active
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[13px] text-gray-500">No card saved yet</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">Powered by Stripe — secure & encrypted</p>
                                </div>
                                <button
                                    onClick={handleAddCard}
                                    disabled={cardLoading}
                                    className="flex items-center gap-1.5 text-[13px] font-medium text-violet-600 hover:text-violet-700 disabled:opacity-60 transition"
                                >
                                    {cardLoading ? (
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    )}
                                    {cardLoading ? "Redirecting..." : "Add card"}
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}