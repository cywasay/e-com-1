"use client";
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] px-4 font-sans text-[#1a1a2e]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Access Denied</h1>
          <p className="text-[#6b6560]">You do not have permission to access this page.</p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 font-bold text-sm uppercase tracking-widest rounded-full text-[#1a1a2e] bg-[#c8a96e] hover:bg-[#b89b60] transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
