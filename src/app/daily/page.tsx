"use client";

import { useEffect, useState, useCallback } from "react";
import { Task } from "@/types";
import TaskCard from "@/components/TaskCard";
import CreateTaskForm from "@/components/CreateTaskForm";
import { getTodayDate, formatDateForDisplay, addDaysToDate } from "@/lib/date-utils";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function DailyView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());

  const today = getTodayDate();

  const fetchTasks = useCallback(async (date: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks?date=${date}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate, fetchTasks]);

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update task");
      await fetchTasks(selectedDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleMarkAllComplete = async () => {
    try {
      const response = await fetch("/api/tasks/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", date: selectedDate }),
      });
      if (!response.ok) throw new Error("Failed to mark tasks");
      await fetchTasks(selectedDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handlePreviousDay = () => {
    setSelectedDate(addDaysToDate(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDaysToDate(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(today);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const isToday = selectedDate === today;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{isToday ? "Today's Tasks" : "Tasks"}</h1>
              <p className="mt-1 text-gray-600">{formatDateForDisplay(selectedDate)}</p>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={handlePreviousDay}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="Previous day"
              >
                <ChevronLeft size={20} />
              </button>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <button
                onClick={handleNextDay}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="Next day"
              >
                <ChevronRight size={20} />
              </button>

              {!isToday && (
                <button
                  onClick={handleToday}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <Calendar size={16} />
                  Today
                </button>
              )}

              <CreateTaskForm 
                onTaskCreated={() => fetchTasks(selectedDate)}
                initialDate={selectedDate}
              />

              <button
                onClick={handleMarkAllComplete}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Mark All Done
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tasks for today. Great job!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={(updates) => handleTaskUpdate(task.id, updates)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
