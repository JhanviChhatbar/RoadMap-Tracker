"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AttentionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Areas Needing Attention</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg">Weak areas dashboard coming soon...</p>
          <p className="text-gray-500 mt-2">This page will highlight areas where you need to focus more.</p>
        </div>
      </main>
    </div>
  );
}
