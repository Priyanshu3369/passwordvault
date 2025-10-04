import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import VaultItem from "@/models/VaultItem";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "No auth token" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const { id, ...updateData } = await req.json();
    const item = await VaultItem.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      updateData,
      { new: true }
    );

    return NextResponse.json({ success: true, item });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
