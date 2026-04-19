"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Task, Section } from "@/types";
import TaskCard from "@/components/TaskCard";
import { getWeekDateRange } from "@/lib/date-utils";

export default function WeeklyView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch tasks for current week
        const tasksRes = await fetch(`/api/tasks?week=${currentWeek}`);
        if (!tasksRes.ok) throw new Error("Failed to fetch tasks");
        const tasksData = await tasksRes.json();
        setTasks(tasksData);

        // Fetch sections
        const sectionsRes = await fetch("/api/sections");
        if (!sectionsRes.ok) throw new Error("Failed to fetch sections");
        const sectionsData = await sectionsRes.json();
        setSections(sectionsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentWeek]);

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update task");
      
      // Refresh tasks
      const tasksRes = await fetch(`/api/tasks?week=${currentWeek}`);
      const tasksData = await tasksRes.json();
      setTasks(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const tasksBySection = sections.map((section) => ({
    section,
    tasks: tasks.filter((t) => t.section === section.id),
  }));

  const weekStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    notStarted: tasks.filter((t) => t.status === "Not Started").length,
  };

  const completionPercentage = weekStats.total > 0 
    ? Math.round((weekStats.completed / weekStats.total) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading week {currentWeek}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Week {currentWeek}</h1>
                <p className="text-gray-600 mt-1">
                  {(() => {
                    const range = getWeekDateRange(currentWeek);
                    const startDate = new Date(range.start).toLocaleDateString();
                    const endDate = new Date(range.end).toLocaleDateString();
                    return `${startDate} - ${endDate}`;
                  })()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft size={20} />
              </button>

              <input
                type="number"
                min="1"
                value={currentWeek}
                onChange={(e) => setCurrentWeek(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Week Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{weekStats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{weekStats.completed}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{weekStats.inProgress}</p>
          </div>
          <div className="bg-gray-50 rounded-lg shadow-lg p-6 border-l-4 border-gray-400">
            <p className="text-gray-600 text-sm">Completion</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{completionPercentage}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-900">Weekly Progress</h2>
            <span className="text-sm text-gray-600">{weekStats.completed} of {weekStats.total} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Tasks by Section */}
        <div className="space-y-8">
          {tasksBySection.map(({ section, tasks: sectionTasks }) => (
            <div key={section.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div
                className="px-6 py-4 text-white"
                style={{ backgroundColor: section.color }}
              >
                <h2 className="text-xl font-bold">{section.name}</h2>
                <p className="text-sm opacity-90">
                  {sectionTasks.length} task{sectionTasks.length !== 1 ? "s" : ""}
                  {sectionTasks.length > 0 && (
                    <span className="ml-2">
                      ({sectionTasks.filter((t) => t.status === "Completed").length} completed)
                    </span>
                  )}
                </p>
              </div>

              <div className="p-6">
                {sectionTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tasks for this section this week</p>
                ) : (
                  <div className="space-y-4">
                    {sectionTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onUpdate={(updates) => handleTaskUpdate(task.id, updates)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">No tasks for this week yet</p>
            <p className="text-gray-500 mt-2">Create your first task to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
