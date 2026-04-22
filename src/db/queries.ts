import { getDatabase, saveDatabase } from "./index";
import { Task, Section, CarryOverLog } from "@/types";
import { randomUUID } from "crypto";
import { addDaysToDate } from "@/lib/date-utils";

// Initialize schema on first import
let initialized = false;
function ensureInitialized() {
  if (!initialized) {
    getDatabase();
    // Database already initialized with empty arrays
    initialized = true;
  }
}

// Task operations
export function getAllTasks(date?: string): Task[] {
  ensureInitialized();
  const db = getDatabase();
  
  if (date) {
    return db.tasks.filter(t => t.dueDate === date).sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - 
             (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
    });
  }
  
  return db.tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export function getTasksByDate(date: string): Task[] {
  ensureInitialized();
  const db = getDatabase();
  
  // Auto carry-over incomplete tasks from previous day
  autoCarryOverIncompletesTasks(date);
  
  return db.tasks
    .filter(t => t.dueDate === date)
    .sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - 
             (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
    });
}

export function getTasksByWeek(weekNumber: number): Task[] {
  ensureInitialized();
  const db = getDatabase();
  return db.tasks
    .filter(t => t.weekNumber === weekNumber)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek);
}

export function getTasksBySection(section: string): Task[] {
  ensureInitialized();
  const db = getDatabase();
  return db.tasks
    .filter(t => t.section === section)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
  ensureInitialized();
  const db = getDatabase();
  const id = randomUUID();
  const now = new Date().toISOString();

  const newTask: Task = {
    ...task,
    id,
    createdAt: now,
    updatedAt: now,
  };

  db.tasks.push(newTask);
  saveDatabase();
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  ensureInitialized();
  const db = getDatabase();
  const taskIndex = db.tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) return null;

  const task = db.tasks[taskIndex];
  const updated: Task = {
    ...task,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.tasks[taskIndex] = updated;
  saveDatabase();
  return updated;
}

export function deleteTask(id: string): boolean {
  ensureInitialized();
  const db = getDatabase();
  const initialLength = db.tasks.length;
  db.tasks = db.tasks.filter(t => t.id !== id);
  
  if (db.tasks.length < initialLength) {
    saveDatabase();
    return true;
  }
  return false;
}

export function getTask(id: string): Task | null {
  ensureInitialized();
  const db = getDatabase();
  return db.tasks.find(t => t.id === id) || null;
}

// Section operations
export function getAllSections(): Section[] {
  ensureInitialized();
  const db = getDatabase();
  return db.sections;
}

export function getSection(id: string): Section | null {
  ensureInitialized();
  const db = getDatabase();
  return db.sections.find(s => s.id === id) || null;
}

export function createSection(section: Omit<Section, "id">): Section {
  ensureInitialized();
  const db = getDatabase();
  const id = section.name.toLowerCase().replace(/\s+/g, "-");

  const newSection: Section = {
    ...section,
    id,
  };

  db.sections.push(newSection);
  saveDatabase();
  return newSection;
}

// CarryOver operations
export function getCarriedOverTasks(date: string): Task[] {
  ensureInitialized();
  const db = getDatabase();
  return db.tasks.filter(t => t.dueDate === date && t.isCarriedOver);
}

export function createCarryOverLog(
  taskId: string,
  fromDate: string,
  toDate: string,
  reason?: string
): CarryOverLog {
  ensureInitialized();
  const db = getDatabase();
  const id = randomUUID();
  const now = new Date().toISOString();

  const log: CarryOverLog = {
    id,
    taskId,
    fromDate,
    toDate,
    reason,
    dismissedAt: null,
    createdAt: now,
  };

  db.carryOverLogs.push(log);
  saveDatabase();
  return log;
}

export function getIncompleteTasksForDate(date: string): Task[] {
  ensureInitialized();
  const db = getDatabase();
  return db.tasks.filter(
    t => t.dueDate === date && 
    t.status !== "Completed" && 
    !t.isCarriedOver
  );
}

export function autoCarryOverIncompletesTasks(currentDate: string): Task[] {
  ensureInitialized();
  const db = getDatabase();
  
  // Get previous day's date
  const previousDate = addDaysToDate(currentDate, -1);
  
  // Find incomplete tasks from previous day that haven't already been carried over
  const incompleteTasks = db.tasks.filter(t => {
    // Must be from previous day, incomplete, and not already a carried-over task
    if (t.dueDate !== previousDate || t.status === "Completed" || t.isCarriedOver) {
      return false;
    }
    
    // Check if this task has already been carried over to the current date
    const alreadyCarriedOver = db.tasks.some(carried =>
      carried.dueDate === currentDate &&
      carried.isCarriedOver &&
      carried.carriedOverFrom === previousDate &&
      carried.title === t.title &&
      carried.section === t.section
    );
    
    return !alreadyCarriedOver;
  });
  
  // Create carry-over copies for current date
  const carriedOverTasks: Task[] = [];
  const now = new Date().toISOString();
  
  for (const task of incompleteTasks) {
    const newTaskId = randomUUID();
    const carriedTask: Task = {
      ...task,
      id: newTaskId,
      dueDate: currentDate,
      status: "Not Started",
      completedAt: null,
      completionLog: null,
      isCarriedOver: true,
      carriedOverFrom: previousDate,
      createdAt: now,
      updatedAt: now,
    };
    
    db.tasks.push(carriedTask);
    carriedOverTasks.push(carriedTask);
    
    // Create carry-over log
    createCarryOverLog(task.id, previousDate, currentDate, "Auto carry-over from incomplete tasks");
  }
  
  if (carriedOverTasks.length > 0) {
    saveDatabase();
  }
  
  return carriedOverTasks;
}


// Bulk operations
export function markAllTasksAsComplete(date: string): number {
  ensureInitialized();
  const db = getDatabase();
  let count = 0;
  const now = new Date().toISOString();

  for (const task of db.tasks) {
    if (task.dueDate === date && task.status !== "Completed") {
      task.status = "Completed";
      task.completedAt = now;
      task.updatedAt = now;
      count++;
    }
  }

  if (count > 0) {
    saveDatabase();
  }
  return count;
}

export function markAllTasksAsIncomplete(date: string): number {
  ensureInitialized();
  const db = getDatabase();
  let count = 0;

  for (const task of db.tasks) {
    if (task.dueDate === date) {
      task.status = "Not Started";
      task.completedAt = null;
      task.completionLog = null;
      task.updatedAt = new Date().toISOString();
      count++;
    }
  }

  if (count > 0) {
    saveDatabase();
  }
  return count;
}

// Statistics
export function getTaskStats(date: string) {
  ensureInitialized();
  const db = getDatabase();
  const tasks = db.tasks.filter(t => t.dueDate === date);
  
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Completed").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
  };
}

export function getWeekStats(weekNumber: number) {
  ensureInitialized();
  const db = getDatabase();
  const tasks = db.tasks.filter(t => t.weekNumber === weekNumber);
  
  const statsBySection: Record<string, any> = {};
  
  for (const task of tasks) {
    if (!statsBySection[task.section]) {
      statsBySection[task.section] = {
        section: task.section,
        total: 0,
        completed: 0,
        inProgress: 0,
      };
    }
    
    statsBySection[task.section].total++;
    if (task.status === "Completed") {
      statsBySection[task.section].completed++;
    } else if (task.status === "In Progress") {
      statsBySection[task.section].inProgress++;
    }
  }
  
  return Object.values(statsBySection);
}
