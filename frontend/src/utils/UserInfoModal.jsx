"use client";

import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import { Loader2 } from "lucide-react"; 

export default function UserInfoModal({ userId, isOpen, onClose }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId || !isOpen) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/user/${userId}`);
                setUser(res.data.user);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-800 transition"
                    aria-label="Close modal"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 User Information</h2>

                {loading ? (
                    <div className="flex justify-center items-center py-6 text-gray-500">
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Loading...
                    </div>
                ) : user ? (
                    <div className="space-y-3 text-gray-700">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="font-medium capitalize">{user.role}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-red-500">User not found.</p>
                )}
            </div>
        </div>
    );
}
