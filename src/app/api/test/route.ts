import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ status: "ok", message: "API is working" });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}
