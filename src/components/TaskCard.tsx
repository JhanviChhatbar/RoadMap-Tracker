"use client";

import { Task } from "@/types";
import { useState } from "react";
import { CheckCircle2, Circle, Trash2, Edit2, ArrowRight } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLog, setEditedLog] = useState(task.completionLog || "");
  const [isLoading, setIsLoading] = useState(false);

  const priorityColors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };

  const statusColors = {
    "Not Started": "border-gray-300 bg-gray-50",
    "In Progress": "border-blue-300 bg-blue-50",
    Completed: "border-green-300 bg-green-50",
  };

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      const newStatus = task.status === "Completed" ? "In Progress" : "Completed";
      await onUpdate({
        status: newStatus,
        completedAt: newStatus === "Completed" ? new Date().toISOString() : null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLog = async () => {
    setIsLoading(true);
    try {
      await onUpdate({
        completionLog: editedLog,
      });
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-lg shadow-sm ${statusColors[task.status]} transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <button
            onClick={handleToggleComplete}
            disabled={isLoading}
            className="mt-1 text-gray-400 hover:text-gray-600 transition"
          >
            {task.status === "Completed" ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1">
            <h3
              className={`font-semibold text-lg ${
                task.status === "Completed" ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>

            {task.isCarriedOver && task.carriedOverFrom && (
              <div className="flex items-center space-x-1 mt-1 text-orange-600 text-xs">
                <ArrowRight size={12} />
                <span>Carried over from {task.carriedOverFrom}</span>
              </div>
            )}

            {task.description && (
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            )}

            <div className="flex items-center space-x-2 mt-3">
              <span className={`px-2 py-1 text-xs font-semibold rounded ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <span className="text-xs text-gray-500">{task.section}</span>
            </div>

            {task.status === "Completed" && task.completedAt && (
              <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">
                  Completed: {new Date(task.completedAt).toLocaleString()}
                </p>
                {task.completionLog && (
                  <p className="text-sm text-gray-700">{task.completionLog}</p>
                )}
              </div>
            )}

            {task.status === "Completed" && isEditing && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={editedLog}
                  onChange={(e) => setEditedLog(e.target.value)}
                  placeholder="What did you accomplish? (max 500 chars)"
                  maxLength={500}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveLog}
                    disabled={isLoading}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {task.status === "Completed" && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-400 hover:text-gray-600 transition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
