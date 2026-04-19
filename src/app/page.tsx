"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, BarChart3, MessageSquare, Settings } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setError(null);
      // Check if already initialized
      const checkResponse = await fetch("/api/init");
      const checkData = await checkResponse.json();

      if (!checkData.initialized) {
        // Initialize the database
        const initResponse = await fetch("/api/init", { method: "POST" });
        const initData = await initResponse.json();
        
        if (!initResponse.ok) {
          throw new Error(initData.details || "Failed to initialize database");
        }
        
        console.log("Database initialized:", initData);
      }
    } catch (err) {
      console.error("Initialization error:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading Roadmap Tracker...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              🚀 Roadmap Tracker
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Initialization Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                initializeApp();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Retry Initialization
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            🚀 Roadmap Tracker
          </h1>
          <p className="text-gray-600 mt-2">Track your 16-week building journey</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Daily View */}
          <Link href="/daily">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Daily View</h2>
                  <p className="text-gray-600 mt-2">Focus on today's tasks</p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
          </Link>

          {/* Weekly View */}
          <Link href="/weekly">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Weekly View</h2>
                  <p className="text-gray-600 mt-2">See this week's progress</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          </Link>

          {/* Progress Dashboard */}
          <Link href="/progress">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Progress</h2>
                  <p className="text-gray-600 mt-2">Track your overall progress</p>
                </div>
                <BarChart3 className="w-12 h-12 text-purple-600" />
              </div>
            </div>
          </Link>

          {/* Calendar View */}
          <Link href="/calendar">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
                  <p className="text-gray-600 mt-2">View all 16 weeks at once</p>
                </div>
                <Calendar className="w-12 h-12 text-orange-600" />
              </div>
            </div>
          </Link>

          {/* Areas Needing Attention */}
          <Link href="/attention">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Weak Areas</h2>
                  <p className="text-gray-600 mt-2">Focus where you're falling behind</p>
                </div>
                <MessageSquare className="w-12 h-12 text-red-600" />
              </div>
            </div>
          </Link>

          {/* Settings */}
          <Link href="/settings">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                  <p className="text-gray-600 mt-2">Configure your preferences</p>
                </div>
                <Settings className="w-12 h-12 text-gray-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
          <div className="prose prose-sm max-w-none text-gray-600">
            <p>
              Welcome to Roadmap Tracker! This application helps you track your 16-week building journey with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Daily task management with carry-over logic</li>
              <li>Weekly progress tracking by section</li>
              <li>Completion logging and notes</li>
              <li>Calendar view of all 16 weeks</li>
              <li>Areas needing attention dashboard</li>
            </ul>
            <p className="mt-4">
              Get started by checking out your tasks for today in the Daily View!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
