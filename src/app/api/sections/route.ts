import { NextRequest, NextResponse } from "next/server";
import { getAllSections, getSection, createSection } from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const section = getSection(id);
      return NextResponse.json(section);
    }

    const sections = getAllSections();
    return NextResponse.json(sections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const section = createSection(body);
    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}
