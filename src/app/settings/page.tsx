"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/types";
import CreateSectionForm from "@/components/CreateSectionForm";

export default function SettingsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch("/api/sections");
        const data = await res.json();
        setSections(data);
      } catch (err) {
        console.error("Error fetching sections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleSectionCreated = (newSection: Section) => {
    setSections([...sections, newSection]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Sections Management */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sections</h2>
              <p className="text-gray-600 mt-1">Manage your project sections and organize tasks</p>
            </div>
            <CreateSectionForm onSectionCreated={handleSectionCreated} />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-600">Loading sections...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: section.color }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{section.name}</h3>
                      <p className="text-sm text-gray-600">Weeks: {section.weekRange}</p>
                      {section.description && (
                        <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">ID: {section.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && sections.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <p>No sections yet. Create your first section!</p>
            </div>
          )}
        </div>

        {/* Application Info */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Roadmap Tracker</strong> - A tool for tracking your 16-week building journey
            </p>
            <p>
              <strong>Version:</strong> 1.0.0
            </p>
            <p>
              <strong>Tech Stack:</strong> Next.js 15, React 19, Tailwind CSS, TypeScript
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
