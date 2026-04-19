export type Priority = "High" | "Medium" | "Low";
export type TaskStatus = "Not Started" | "In Progress" | "Completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  priority: Priority;
  status: TaskStatus;
  section: string;
  weekNumber: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  completedAt?: string | null;
  completionLog?: string | null;
  createdAt: string;
  updatedAt: string;
  isCarriedOver?: boolean;
  carriedOverFrom?: string | null;
}

export interface Section {
  id: string;
  name: string;
  weekRange: string; // e.g., "1-4"
  color: string;
  description?: string;
}

export interface CarryOverLog {
  id: string;
  taskId: string;
  fromDate: string; // ISO date string
  toDate: string; // ISO date string
  reason?: string | null;
  dismissedAt?: string | null;
  createdAt: string;
}

export interface DailyLog {
  id: string;
  taskId: string;
  completedAt: string;
  note: string;
  duration?: number; // in minutes
  createdAt: string;
}

export interface WeeklyProgress {
  weekNumber: number;
  section: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  date: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  section: string;
  tasks: RoadmapTask[];
}

export interface RoadmapTask {
  title: string;
  description: string;
  priority: Priority;
  estimatedHours: number;
}
