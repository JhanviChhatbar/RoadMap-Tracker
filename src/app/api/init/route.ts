import { NextResponse } from "next/server";

let isInitializing = false;
let isInitialized = false;

export async function POST() {
  try {
    // Prevent race conditions during initialization
    if (isInitializing) {
      return NextResponse.json({ message: "Database initialization in progress" }, { status: 202 });
    }

    if (isInitialized) {
      return NextResponse.json({ message: "Database already initialized" });
    }

    isInitializing = true;

    // Dynamically import at runtime (this ensures better-sqlite3 is loaded in server context)
    const { createSection, createTask, getAllTasks } = await import("@/db/queries");
    const { ROADMAP_DATA, SECTIONS } = await import("@/lib/roadmap-data");
    const { getDateString, getDayOfWeek } = await import("@/lib/date-utils");

    // Check if data already exists
    const existingTasks = getAllTasks();
    if (existingTasks.length > 0) {
      isInitialized = true;
      isInitializing = false;
      return NextResponse.json({ message: "Database already initialized" });
    }

    // Create sections
    for (const section of SECTIONS) {
      try {
        createSection({
          name: section.name,
          weekRange: section.weekRange,
          color: section.color,
        });
      } catch (err) {
        // Section might already exist, continue
        console.warn(`Section creation warning for ${section.name}:`, err);
      }
    }

    // Create tasks from roadmap data
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    let taskCount = 0;
    for (const week of ROADMAP_DATA.weeks) {
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const taskDate = new Date(startDate);
        taskDate.setDate(taskDate.getDate() + (week.weekNumber - 1) * 7 + dayOffset);
        const dateString = getDateString(taskDate);
        const dayOfWeek = getDayOfWeek(dateString);

        // Only add 1-2 tasks per day
        const tasksPerDay = dayOffset < 2 ? 1 : dayOffset < 4 ? 1 : dayOffset < 6 ? 1 : 0;

        for (let i = 0; i < tasksPerDay && i < week.tasks.length; i++) {
          try {
            const task = week.tasks[i];
            createTask({
              title: task.title,
              description: task.description,
              dueDate: dateString,
              priority: task.priority,
              status: "Not Started",
              section: week.section,
              weekNumber: week.weekNumber,
              dayOfWeek: dayOfWeek,
            });
            taskCount++;
          } catch (err) {
            console.warn("Task creation error:", err);
          }
        }
      }
    }

    isInitialized = true;
    isInitializing = false;

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      tasksCreated: taskCount,
    });
  } catch (error) {
    isInitializing = false;
    console.error("Error initializing database:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to initialize database", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { getAllTasks } = await import("@/db/queries");
    const tasks = getAllTasks();
    return NextResponse.json({
      initialized: tasks.length > 0,
      taskCount: tasks.length,
    });
  } catch (error) {
    console.error("Error checking initialization:", error);
    return NextResponse.json(
      { error: "Failed to check initialization" },
      { status: 500 }
    );
  }
}
