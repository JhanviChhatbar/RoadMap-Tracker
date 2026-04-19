import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Try to dynamically import and test the database
    const { getDatabase, initializeDatabase } = await import("@/db/index");
    
    initializeDatabase();
    const db = getDatabase();
    
    return NextResponse.json({
      status: "ok",
      message: "Database connection successful",
      taskCount: db.tasks.length,
      sectionCount: db.sections.length,
    });
  } catch (error) {
    console.error("Database test error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
