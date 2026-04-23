"use client";

import Link from "next/link";
import useAuthStore from "@/store/authStore";

export default function Home() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 font-sans">
      <main className="max-w-2xl w-full bg-white p-12 shadow-sm border border-gray-200 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          E-Commerce Platform
        </h1>
        
        {user ? (
          <div className="space-y-6">
            <p className="text-xl text-gray-600">
              Welcome back, <span className="font-semibold text-gray-900">{user.name}</span>!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admin"
                className="px-8 py-3 bg-[#1E3A5F] text-white font-medium hover:bg-[#2E75B6] transition"
              >
                Go to Admin Panel
              </Link>
              <button
                onClick={logout}
                className="px-8 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-xl text-gray-600 mb-8">
              Manage your store, orders, and brands with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="px-8 py-3 bg-[#1E3A5F] text-white font-medium hover:bg-[#2E75B6] transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 border border-[#1E3A5F] text-[#1E3A5F] font-medium hover:bg-gray-50 transition"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
