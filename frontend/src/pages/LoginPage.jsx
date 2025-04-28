'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axiosInstance';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const { data } = await axios.post(
                'http://localhost:9090/api/v1/auth/login', // URL
                form,
                {
                    headers: {
                        'Content-Type': 'application/json',

                    },
                }
            );

            console.log(
                data
            )
            const { token } = data;

            Cookies.set('token', token, { expires: 7 });
            localStorage.setItem('token', token);

            router.push('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Section */}
            <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/login-bg.jpg')" }}>
                {/* Image provided from public/login-bg.jpg */}
            </div>

            {/* Right Section */}
            <div className="flex flex-col justify-center w-full md:w-1/2 px-8 py-12">
                <h2 className="text-3xl font-bold mb-8 text-center">Welcome Back</h2>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded"
                    >
                        Log In
                    </button>

                    <p className="text-center text-sm mt-4">
                        Don't have an account? <a href="/signup" className="text-blue-500 underline">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
