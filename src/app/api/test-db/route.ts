import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "✅ DB Connected Successfully" });
  } catch (error) {
    return NextResponse.json({ error: "❌ DB Connection Failed" }, { status: 500 });
  }
}
