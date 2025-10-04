import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import VaultItem from "@/models/VaultItem";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "No auth token" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const body = await req.json();
    const item = await VaultItem.create({
      userId: decoded.userId,
      ...body, // all encrypted fields
    });

    return NextResponse.json({ success: true, id: item._id });
  } catch (err) {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
