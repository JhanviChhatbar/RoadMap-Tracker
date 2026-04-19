import { NextRequest, NextResponse } from "next/server";
import { markAllTasksAsComplete, markAllTasksAsIncomplete } from "@/db/queries";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, date } = body;

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    let changes = 0;

    if (action === "complete") {
      changes = markAllTasksAsComplete(date);
    } else if (action === "incomplete") {
      changes = markAllTasksAsIncomplete(date);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, changes });
  } catch (error) {
    console.error("Error performing bulk action:", error);
    return NextResponse.json({ error: "Failed to perform bulk action" }, { status: 500 });
  }
}
